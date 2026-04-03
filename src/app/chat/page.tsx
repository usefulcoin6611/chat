"use client";

import dynamic from "next/dynamic";
import { useChat } from "./_hooks/useChat";
import { ChatSidebar } from "./_components/ChatSidebar";
import { ChatWindow } from "./_components/ChatWindow";
import { DeleteConfirmDialog } from "./_components/DeleteConfirmDialog";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatPage() {
  const chat = useChat();

  return (
    <div className="flex bg-slate-100 dark:bg-slate-950 flex-col md:flex-row h-screen overflow-hidden">
      <ChatSidebar 
        currentUser={chat.currentUser}
        recipientId={chat.recipientId}
        setRecipientId={chat.setRecipientId}
        activeChat={chat.activeChat}
        chatPartners={chat.chatPartners}
        unreadCounts={chat.unreadCounts}
        isCollapsed={chat.isSidebarCollapsed}
        toggleSidebar={chat.toggleSidebar}
        handleStartChat={chat.handleStartChat}
        handleSelectPartner={chat.handleSelectPartner}
        logout={chat.logout}
      />

      <ChatWindow 
        activeChat={chat.activeChat}
        isDarkMode={chat.isDarkMode}
        toggleTheme={chat.toggleTheme}
        scrollRef={chat.scrollRef}
        messages={chat.messages}
        currentUser={chat.currentUser}
        handleDeleteMessage={chat.handleDeleteMessage}
        inputText={chat.inputText}
        setInputText={chat.setInputText}
        handleSendMessage={chat.handleSendMessage}
        handleEmojiClick={chat.handleEmojiClick}
        fileInputRef={chat.fileInputRef}
        handleFileUpload={chat.handleFileUpload}
        handlePaste={chat.handlePaste}
        previewFile={chat.previewFile}
        previewUrl={chat.previewUrl}
        cancelPreview={chat.cancelPreview}
        sendPreview={chat.sendPreview}
        isUploading={chat.isUploading}
        inputRef={chat.inputRef}
        EmojiPicker={EmojiPicker}
      />

      <DeleteConfirmDialog 
        isOpen={chat.isDeleteDialogOpen}
        onOpenChange={chat.setIsDeleteDialogOpen}
        onConfirm={chat.confirmDelete}
      />
    </div>
  );
}
