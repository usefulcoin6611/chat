import React from "react";
import { ChatWindowProps } from "../../_types/chat";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ImagePreviewOverlay } from "./ImagePreviewOverlay";
import { ChatInput } from "./ChatInput";

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
    EmojiPicker,
    onBack,
    isRecording,
    startRecording,
    stopRecording,
    cancelRecording,
    mediaStream,
    recordingTime,
    formatTime
}: ChatWindowProps) {

  if (!activeChat) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-500 p-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-full mb-6 shadow-sm ring-1 ring-slate-100 dark:ring-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0 0 12 22z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-100 mb-2 mt-2 text-center">Spring Chat Pro</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-center font-medium">Buka salah satu riwayat chat Anda atau mulai percakapan baru untuk menikmati fitur modern.</p>
        </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full relative overflow-hidden">
        <ChatHeader 
          activeChat={activeChat} 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onBack={onBack}
        />

        <MessageList 
          messages={messages} 
          currentUser={currentUser} 
          activeChat={activeChat} 
          scrollRef={scrollRef} 
          handleDeleteMessage={handleDeleteMessage} 
        />

        <div className="relative">
            <ImagePreviewOverlay 
               previewUrl={previewUrl} 
               previewFile={previewFile} 
               cancelPreview={cancelPreview} 
               sendPreview={sendPreview} 
               fileInputRef={fileInputRef} 
            />

            <ChatInput 
              inputText={inputText} 
              setInputText={setInputText} 
              handleSendMessage={handleSendMessage} 
              handleEmojiClick={handleEmojiClick} 
              handlePaste={handlePaste} 
              fileInputRef={fileInputRef} 
              handleFileUpload={handleFileUpload} 
              isUploading={isUploading} 
              previewUrl={previewUrl} 
              previewFile={previewFile} 
              sendPreview={sendPreview} 
              inputRef={inputRef} 
              EmojiPicker={EmojiPicker} 
              isRecording={isRecording}
              startRecording={startRecording}
              stopRecording={stopRecording}
              cancelRecording={cancelRecording}
              mediaStream={mediaStream}
              recordingTime={recordingTime}
              formatTime={formatTime}
            />
        </div>
    </div>
  );
}
