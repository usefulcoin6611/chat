import React from "react";

export interface ChatMessage {
    id?: string;
    chatId?: string;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp?: string;
}

export interface ChatSidebarProps {
  currentUser: string;
  recipientId: string;
  setRecipientId: (val: string) => void;
  activeChat: string;
  chatPartners: string[];
  unreadCounts: Record<string, number>;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  handleStartChat: (e: React.FormEvent) => void;
  handleSelectPartner: (partner: string) => void;
  logout: () => void;
}

export interface ChatHeaderProps {
  activeChat: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onBack?: () => void;
}

export interface MessageItemProps {
  message: ChatMessage;
  isMe: boolean;
  onDelete: (id: string) => void;
}

export interface MessageListProps {
  messages: ChatMessage[];
  currentUser: string;
  activeChat: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  handleDeleteMessage: (id: string) => void;
}

export interface ImagePreviewOverlayProps {
  previewUrl: string | null;
  previewFile: File | null;
  cancelPreview: () => void;
  sendPreview: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface ChatInputProps {
  inputText: string;
  setInputText: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  handleEmojiClick: (emojiData: any) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  previewUrl: string | null;
  previewFile: File | null;
  sendPreview: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  EmojiPicker: React.ComponentType<any>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export interface ChatWindowProps extends ChatHeaderProps, MessageListProps, ImagePreviewOverlayProps, ChatInputProps {}
