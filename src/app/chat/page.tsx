"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { stompService, ChatMessage } from "@/lib/stompClient";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string>("");
  const [recipientId, setRecipientId] = useState<string>("");
  const [activeChat, setActiveChat] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const user = localStorage.getItem("chat_username");
    if (!user) {
      router.push("/");
      return;
    }
    setCurrentUser(user);

    stompService.connect(
      user,
      (newMsg) => {
        setMessages((prev) => {
            // Filter duplicates if any
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
        });
      },
      () => console.log("STOMP Connected"),
      (err) => console.error("STOMP Error", err)
    );

    return () => {
      stompService.disconnect();
    };
  }, [router]);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);

  const loadChatHistory = async (senderUser: string, recipientUser: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/chat/messages/${senderUser}/${recipientUser}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (res.ok) {
        const history: ChatMessage[] = await res.json();
        setMessages(history);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId.trim()) return;
    setActiveChat(recipientId.trim());
    loadChatHistory(currentUser, recipientId.trim());
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const chatMessage: ChatMessage = {
      senderId: currentUser,
      recipientId: activeChat,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    if (!stompService.isConnected) {
        alert("Koneksi belum terhubung ke server (CORS Error). Pesan tidak bisa dikirim.");
        return;
    }

    // Optimistic update: Langsung munculkan di layar pengirim
    setMessages((prev) => [...prev, chatMessage]);
    
    stompService.sendMessage(chatMessage);
    setInputText("");
  };

  const logout = () => {
    stompService.disconnect();
    localStorage.removeItem("chat_username");
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 flex-col md:flex-row">
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

          {activeChat && (
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

            <ScrollArea className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50" ref={scrollRef}>
              <div className="space-y-4 pb-4">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser;
                  return (
                    <div key={m.id || Math.random().toString()} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                          <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                            <AvatarFallback className="bg-purple-600 text-white text-xs">
                              {m.senderId.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                      )}
                      
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                          : 'bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-[15px] leading-relaxed">{m.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                           {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 mt-20">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                            <svg xmlns="http://www.w3.org/lucide" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        </div>
                        <p>Belum ada pesan. Sapa {activeChat} sekarang!</p>
                    </div>
                )}
              </div>
            </ScrollArea>

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
