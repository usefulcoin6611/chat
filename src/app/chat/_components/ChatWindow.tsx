import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChatMessage } from "../_types/chat";
import { isImageUrl } from "../_utils/chatUtils";
import React from "react";

interface ChatWindowProps {
    activeChat: string;
    isDarkMode: boolean;
    toggleTheme: () => void;
    scrollRef: React.RefObject<HTMLDivElement | null>;
    messages: ChatMessage[];
    currentUser: string;
    handleDeleteMessage: (id: string) => void;
    inputText: string;
    setInputText: (val: string) => void;
    handleSendMessage: (e: React.FormEvent) => void;
    handleEmojiClick: (emojiData: any) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handlePaste: (e: React.ClipboardEvent) => void;
    previewFile: File | null;
    previewUrl: string | null;
    cancelPreview: () => void;
    sendPreview: () => void;
    isUploading: boolean;
    inputRef: React.RefObject<HTMLInputElement | null>;
    EmojiPicker: React.ComponentType<any>;
}

export function ChatWindow({
    activeChat,
    isDarkMode,
    toggleTheme,
    scrollRef,
    messages,
    currentUser,
    handleDeleteMessage,
    inputText,
    setInputText,
    handleSendMessage,
    handleEmojiClick,
    fileInputRef,
    handleFileUpload,
    handlePaste,
    previewFile,
    previewUrl,
    cancelPreview,
    sendPreview,
    isUploading,
    inputRef,
    EmojiPicker
}: ChatWindowProps) {
  const uploadFile = async (file: File) => {
    // This is a local copy for the paste logic if needed, but we used useChat
  };

  if (!activeChat) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-950">
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"/></svg>
            </div>
            <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300 mb-2">Spring Chat</h3>
            <p>Silakan mulai percakapan baru dari menu di samping.</p>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full relative">
        <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b dark:border-slate-800 z-10">
          <div className="flex items-center">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-purple-600 text-white">
                {activeChat.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
               <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{activeChat}</h3>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme} 
            className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
            title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </Button>
        </div>

        <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50 overflow-y-auto scroll-smooth" ref={scrollRef}>
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
                            className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-white dark:bg-slate-800"
                            title="Hapus Pesan"
                         >
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                         </Button>
                      )}

                      <div className={`rounded-2xl ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                      } ${isImageUrl(m.content) ? 'p-1.5' : 'px-4 py-2'}`}>
                        {isImageUrl(m.content) ? (
                          <div className="overflow-hidden rounded-xl bg-black/5 dark:bg-black/20">
                                <img 
                                  src={m.content} 
                                  alt="Shared Image" 
                                  className="max-w-full sm:max-w-xs h-auto block object-cover hover:opacity-90 transition-opacity cursor-pointer"
                                  onClick={() => window.open(m.content, '_blank')}
                                />
                              </div>
                        ) : (
                          <p className="text-[15px] leading-relaxed break-words">{m.content}</p>
                        )}
                        <p className={`text-[10px] mt-1 text-right leading-none ${isMe ? 'text-indigo-200' : 'text-slate-400'} ${isImageUrl(m.content) ? 'px-2 pb-1' : ''}`}>
                           {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
                        </p>
                      </div>
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
            <div className="h-4 w-full flex-shrink-0"></div>
          </div>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-slate-900 overflow-visible z-20 relative">
          {previewUrl && (
              <div className="absolute bottom-full left-4 mb-4 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-indigo-100 dark:border-indigo-900/30 animate-in slide-in-from-bottom-4 duration-300 z-50">
                  <div className="relative group overflow-hidden rounded-xl">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-48 w-auto rounded-xl object-contain bg-slate-50 dark:bg-slate-900" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={cancelPreview}
                            className="rounded-full px-4"
                          >
                             Batal
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            onClick={sendPreview}
                            className="rounded-full px-4 bg-indigo-600 hover:bg-indigo-700"
                          >
                             Kirim
                          </Button>
                      </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center px-2">
                       <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                           {previewFile?.name}
                       </p>
                       <div className="flex space-x-2">
                            <button onClick={cancelPreview} className="text-slate-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                            <button onClick={sendPreview} className="text-indigo-600 hover:text-indigo-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                            </button>
                       </div>
                  </div>
              </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <Popover>
                <PopoverTrigger 
                    className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer bg-transparent border-none outline-none"
                    title="Emoticon"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </PopoverTrigger>
                <PopoverContent side="top" align="start" className="w-auto p-0 border-none shadow-xl bg-transparent mb-2">
                    <EmojiPicker 
                      onEmojiClick={handleEmojiClick} 
                      theme={undefined} // Auto
                      lazyLoadEmojis={true}
                    />
                </PopoverContent>
            </Popover>

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />

            <Button
                type="button"
                variant="ghost" 
                size="sm"
                disabled={isUploading}
                className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 flex-shrink-0 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                title="Kirim Gambar"
            >
                {isUploading ? (
                    <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0 L6 21"/></svg>
                )}
            </Button>

            <Input
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onPaste={handlePaste}
              placeholder="Ketik pesan Anda..."
              className="flex-1 h-12 rounded-full px-5 bg-white dark:bg-slate-800 border-none focus-visible:ring-0"
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim()} 
              className="rounded-full w-12 h-12 p-0 bg-indigo-600 hover:bg-indigo-700 flex-shrink-0 flex items-center justify-center transition-transform active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 relative"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </Button>
          </form>
        </div>
    </div>
  );
}
