import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React from "react";
import { ChatInputProps } from "../../_types/chat";

export function ChatInput({
  inputText,
  setInputText,
  handleSendMessage,
  handleEmojiClick,
  handlePaste,
  fileInputRef,
  handleFileUpload,
  isUploading,
  previewUrl,
  previewFile,
  sendPreview,
  inputRef,
    EmojiPicker,
    isRecording,
    startRecording,
    stopRecording
}: ChatInputProps) {
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
      return;
    }
    if (previewFile) {
      sendPreview();
    } else {
      handleSendMessage(e);
    }
  };

  const showSend = inputText.trim() || previewUrl;

  return (
    <div className="h-[88px] p-4 bg-slate-50 dark:bg-slate-900 overflow-visible z-20 relative border-t dark:border-slate-800 shrink-0">
      <form onSubmit={onFormSubmit} className="flex items-center space-x-3 w-full h-full">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm px-2 h-14 ring-1 ring-slate-200 dark:ring-slate-700/50 focus-within:ring-indigo-500/30 transition-all relative">
          {isRecording && (
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center px-4 animate-pulse z-10">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-ping"></span>
              <span className="text-sm font-bold text-red-500">Merekam suara...</span>
            </div>
          )}
          
          <Popover>
            <PopoverTrigger className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer bg-transparent border-none outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto p-0 border-none shadow-xl bg-transparent mb-4">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={undefined} lazyLoadEmojis={true} />
            </PopoverContent>
          </Popover>

          <Input
            ref={inputRef}
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
            onPaste={handlePaste}
            placeholder="Ketik pesan..."
            disabled={isRecording}
            className="flex-1 border-none focus-visible:ring-0 bg-transparent text-lg placeholder:text-slate-400"
          />

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            disabled={isUploading || isRecording}
            className="rounded-full w-10 h-10 p-0 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Pilih Gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </Button>
        </div>

        {showSend ? (
          <Button 
            type="submit" 
            disabled={isRecording}
            className="rounded-full w-14 h-14 p-0 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          >
            {isUploading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            )}
          </Button>
        ) : (
           <Button 
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full w-14 h-14 p-0 shadow-lg transition-all active:scale-95 flex-shrink-0 cursor-pointer ${
                isRecording 
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
            }`}
          >
            {isRecording ? (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="12" height="12" x="6" y="6" rx="1"/></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
