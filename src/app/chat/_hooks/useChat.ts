import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage } from "../_types/chat";
import * as chatService from "../_services/chatService";

export function useChat() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatPartners, setChatPartners] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMsgCount = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastReadTimestamps, setLastReadTimestamps] = useState<Record<string, number>>({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([audioBlob], `audio-recording-${Date.now()}.webm`, { type: 'audio/webm' });
        
        // Use existing upload logic
        setIsUploading(true);
        try {
          const blob = await chatService.uploadToBlob(file);
          const chatMessage: ChatMessage = {
              senderId: currentUser,
              recipientId: activeChat,
              content: blob.url,
          };
          await chatService.sendMessage(chatMessage);
          loadChatHistory(currentUser, activeChat);
        } catch (err) {
          console.error('Failed to upload voice message', err);
        } finally {
          setIsUploading(false);
        }

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Tidak dapat mengakses mikrofon.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("chat_theme");
    if (savedTheme !== "light") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("chat_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("chat_theme", "light");
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("chat_username");
    if (!user) {
      router.push("/");
      return;
    }
    
    setCurrentUser(user);
    loadChatPartners(user);

    const savedTimestamps = localStorage.getItem(`chat_read_times_${user}`);
    if (savedTimestamps) {
      setLastReadTimestamps(JSON.parse(savedTimestamps));
    }

    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
  }, [router]);

  useEffect(() => {
    if (messages.length > prevMsgCount.current && prevMsgCount.current > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== currentUser) {
        audioRef.current?.play().catch(e => console.log("Sound blocked by browser policy", e));
      }
    }
    prevMsgCount.current = messages.length;
  }, [messages, currentUser]);

  const markAsRead = async (senderUser: string, recipientUser: string) => {
    const now = Date.now();
    const newTimestamps = { ...lastReadTimestamps, [senderUser]: now };
    setLastReadTimestamps(newTimestamps);
    localStorage.setItem(`chat_read_times_${recipientUser}`, JSON.stringify(newTimestamps));
    
    setUnreadCounts(prev => ({ ...prev, [senderUser]: 0 }));

    try {
      await chatService.markMessagesAsRead(senderUser, recipientUser);
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const loadChatHistory = async (senderUser: string, recipientUser: string) => {
    try {
      const history = await chatService.getChatMessages(senderUser, recipientUser);
      setMessages((prev) => {
        if (prev.length !== history.length) return history;
        if (prev.length > 0 && history.length > 0 && prev[prev.length - 1].id !== history[history.length - 1].id) {
          return history;
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const checkAllUnread = async (me: string, partners: string[]) => {
    const counts: Record<string, number> = { ...unreadCounts };
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    for (const partner of partners) {
      if (partner === activeChat) {
          counts[partner] = 0;
          continue;
      }
      try {
        const msgs = await chatService.getChatMessages(me, partner);
        const lastRead = lastReadTimestamps[partner] || 0;
        const unread = msgs.filter(m => 
          m.senderId === partner && 
          (m.timestamp ? new Date(m.timestamp).getTime() : 0) > lastRead
        ).length;
        counts[partner] = unread;
      } catch (e) {}
    }
    setUnreadCounts(counts);
  };

  const loadChatPartners = async (userId: string) => {
    try {
      const users = await chatService.getChatPartners(userId);
      setChatPartners(users);
      if (currentUser) {
          checkAllUnread(userId, users);
      }
    } catch (err) {
      console.error("Failed to load chat partners", err);
    }
  };

  useEffect(() => {
    if (!currentUser) return;
    loadChatPartners(currentUser);
    const id = setInterval(() => loadChatPartners(currentUser), 5000);
    return () => clearInterval(id);
  }, [currentUser]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (currentUser && activeChat) {
      inputRef.current?.focus();
      loadChatHistory(currentUser, activeChat);
      markAsRead(activeChat, currentUser);

      intervalId = setInterval(() => {
        loadChatHistory(currentUser, activeChat);
        markAsRead(activeChat, currentUser);
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser, activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId.trim()) return;
    if (recipientId.trim() !== activeChat) {
      setMessages([]);
      prevMsgCount.current = 0;
      setActiveChat(recipientId.trim());
    }
  };

  const handleSelectPartner = (partner: string) => {
    if (partner !== activeChat) {
      setMessages([]);
      prevMsgCount.current = 0;
      setActiveChat(partner);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If there is a preview file, send it first/with
    if (previewFile) {
        await sendPreview();
        if (!inputText.trim()) return; // If only image, stop here
    }

    if (!inputText.trim() || !activeChat) return;

    const chatMessage: ChatMessage = {
      senderId: currentUser,
      recipientId: activeChat,
      content: inputText.trim(),
    };

    setInputText("");

    try {
      await chatService.sendMessage(chatMessage);
      loadChatHistory(currentUser, activeChat);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const confirmDelete = async () => {
    if (!msgToDelete) return;

    try {
      await chatService.deleteMessage(msgToDelete);
      loadChatHistory(currentUser, activeChat);
    } catch (err) {
      console.error("Failed to delete message", err);
    } finally {
      setIsDeleteDialogOpen(false);
      setMsgToDelete(null);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMsgToDelete(messageId);
    setIsDeleteDialogOpen(true);
  };

  const handleEmojiClick = (emojiData: any) => {
    setInputText((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const blob = await chatService.uploadToBlob(file);
      const chatMessage: ChatMessage = {
          senderId: currentUser,
          recipientId: activeChat,
          content: blob.url,
      };

      await chatService.sendMessage(chatMessage);
      loadChatHistory(currentUser, activeChat);
    } catch (err) {
      console.error('Upload failed:', err);
      alert("Gagal mengunggah gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          setPreviewFile(file);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        }
      }
    }
  };

  const cancelPreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const sendPreview = async () => {
    if (!previewFile) return;
    const fileToSend = previewFile;
    cancelPreview(); // Clear UI first
    await uploadFile(fileToSend);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const logout = () => {
    localStorage.removeItem("chat_username");
    router.push("/");
  };

  return {
    currentUser,
    recipientId,
    setRecipientId,
    activeChat,
    setActiveChat,
    messages,
    setMessages,
    chatPartners,
    inputText,
    setInputText,
    scrollRef,
    inputRef,
    fileInputRef,
    isUploading,
    unreadCounts,
    isDarkMode,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    toggleTheme,
    handleStartChat,
    handleSelectPartner,
    handleSendMessage,
    handleDeleteMessage,
    confirmDelete,
    handleEmojiClick,
    handleFileUpload,
    handlePaste,
    previewFile,
    previewUrl,
    isSidebarCollapsed,
    toggleSidebar,
    cancelPreview,
    sendPreview,
    logout,
    isRecording,
    startRecording,
    stopRecording
  };
}
