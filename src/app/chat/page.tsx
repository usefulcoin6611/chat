"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export interface ChatMessage {
    id?: string;
    chatId?: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp?: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatPartners, setChatPartners] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const user = localStorage.getItem("chat_username");
    if (!user) {
      router.push("/");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const markAsRead = async (senderUser: string, recipientUser: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      await fetch(`${baseUrl}/api/chat/messages/read/${senderUser}/${recipientUser}`, {
        method: "PUT",
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const loadChatHistory = async (senderUser: string, recipientUser: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/chat/messages/${senderUser}/${recipientUser}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Cache-Control': 'no-cache'
        },
      });
      if (res.ok) {
        const history: ChatMessage[] = await res.json();
        setMessages((prev) => {
          // Hanya update state jika ada perubahan jumlah pesan 
          // atau pesan terakhir berbeda, guna mencegah layar re-scroll ke bawah saat polling statis
          if (prev.length !== history.length) return history;
          if (prev.length > 0 && history.length > 0 && prev[prev.length - 1].id !== history[history.length - 1].id) {
            return history;
          }
          return prev;
        });
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const loadChatPartners = async (userId: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/chat/users/${userId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (res.ok) {
        const users: string[] = await res.json();
        setChatPartners(users);
      }
    } catch (err) {
      console.error("Failed to load chat partners", err);
    }
  };

  // Interval polling untuk daftar user (setiap 5 detik)
  useEffect(() => {
    if (!currentUser) return;
    
    loadChatPartners(currentUser);
    const id = setInterval(() => loadChatPartners(currentUser), 5000);
    return () => clearInterval(id);
  }, [currentUser]);

  // Interval polling setiap 3 detik untuk pesan
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (currentUser && activeChat) {
      // Load pertama kali saat chat dibuka
      loadChatHistory(currentUser, activeChat);
      markAsRead(activeChat, currentUser);

      // Set polling interval
      intervalId = setInterval(() => {
        loadChatHistory(currentUser, activeChat);
        markAsRead(activeChat, currentUser); // otomatis Read jika chat sedang terbuka
      }, 3000); // 3 detik
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentUser, activeChat]);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId.trim()) return;
    if (recipientId.trim() !== activeChat) {
      setMessages([]); // Kosongkan chat sebelumnya saat beralih percakapan
      setActiveChat(recipientId.trim());
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const chatMessage: ChatMessage = {
      senderId: currentUser,
      recipientId: activeChat,
      content: inputText.trim(),
    };

    setInputText(""); // Kosongkan inputan optimis

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(chatMessage),
      });

      if (res.ok) {
        // Ambil ulang data karena berhasil mengirim
        loadChatHistory(currentUser, activeChat);
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Hapus pesan ini?")) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/chat/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (res.ok) {
        // Refresh riwayat pesan setelah menghapus
        loadChatHistory(currentUser, activeChat);
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("chat_username");
    router.push("/");
  };

  return (
    <div className="flex bg-slate-100 dark:bg-slate-950 flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-slate-800/50">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback className="bg-indigo-600 text-white font-bold">
                {currentUser.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{currentUser}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            Logout
          </Button>
        </div>
        
        <div className="p-4 flex-1">
          <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Mulai Percakapan Baru</h2>
          <form onSubmit={handleStartChat} className="flex space-x-2">
             <Input 
                placeholder="Username teman..."
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                className="flex-1 rounded-lg"
             />
             <Button type="submit" variant="secondary" className="rounded-lg">Chat</Button>
          </form>

          {activeChat && !chatPartners.includes(activeChat) && (
            <div className="mt-8">
               <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Chat Aktif</h2>
               <div className="flex items-center p-3 cursor-pointer rounded-lg bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarFallback className="bg-purple-600 text-white">
                            {activeChat.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activeChat}</p>
                        <p className="text-xs text-indigo-500 mt-1 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                            Online
                        </p>
                    </div>
               </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Riwayat Chat</h2>
            <div className="space-y-2">
              {chatPartners.map((partner) => (
                <div 
                  key={partner}
                  onClick={() => {
                    setMessages([]);
                    setActiveChat(partner);
                  }}
                  className={`flex items-center p-3 cursor-pointer rounded-lg transition-all ${
                    activeChat === partner 
                      ? "bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={activeChat === partner ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}>
                      {partner.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <p className={`text-sm font-medium truncate ${activeChat === partner ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"}`}>
                      {partner}
                    </p>
                  </div>
                </div>
              ))}
              {chatPartners.length === 0 && (
                <p className="text-xs text-slate-400 italic">Belum ada riwayat chat.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center bg-white dark:bg-slate-900 shadow-sm z-10">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-purple-600 text-white">
                  {activeChat.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                 <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{activeChat}</h3>
              </div>
            </div>

            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50" ref={scrollRef}>
              <div className="flex flex-col space-y-4 pb-4">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser;
                  return (
                    <div key={m.id || Math.random().toString()} className={`flex items-start group ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                          <Avatar className="h-8 w-8 mr-2 mt-0.5 flex-shrink-0">
                            <AvatarFallback className="bg-purple-600 text-white text-xs">
                              {m.senderId.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                      )}
                      
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div className="flex items-center space-x-2">
                          {isMe && m.id && (
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => handleDeleteMessage(m.id!)}
                               className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm bg-white"
                               title="Hapus Pesan"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                             </Button>
                          )}

                          <div className={`rounded-2xl px-4 py-2 ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                              : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm'
                          }`}>
                            <p className="text-[15px] leading-relaxed break-words">{m.content}</p>
                            <p className={`text-[10px] mt-1 text-right leading-none ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                               {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
                            </p>
                          </div>

                          {!isMe && m.id && (
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               onClick={() => handleDeleteMessage(m.id!)}
                               className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-sm bg-white"
                               title="Hapus Pesan"
                             >
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                             </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p>Belum ada pesan. Sapa {activeChat} sekarang!</p>
                    </div>
                )}
                {/* Invisible element to anchor scroll to bottom */}
                <div className="h-4 w-full flex-shrink-0"></div>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 rounded-full px-5 bg-slate-100 dark:bg-slate-800 border-transparent focus-visible:ring-indigo-500 focus-visible:border-transparent"
                />
                <Button type="submit" disabled={!inputText.trim()} className="rounded-full w-12 h-12 p-0 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 ml-1"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"/></svg>
            </div>
            <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">Spring Chat</h3>
            <p>Silakan mulai percakapan baru dari menu di samping.</p>
          </div>
        )}
      </div>
    </div>
  );
}
