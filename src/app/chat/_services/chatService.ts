import { ChatMessage } from "../_types/chat";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function getChatMessages(sender: string, recipient: string): Promise<ChatMessage[]> {
  const res = await fetch(`${BASE_URL}/api/chat/messages/${sender}/${recipient}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
      'Cache-Control': 'no-cache'
    },
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessage(message: ChatMessage): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error("Failed to send message");
}

export async function deleteMessage(messageId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/chat/messages/${messageId}`, {
    method: "DELETE",
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  if (!res.ok) throw new Error("Failed to delete message");
}

export async function getChatPartners(userId: string): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/api/chat/users/${userId}`, {
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
  if (!res.ok) throw new Error("Failed to fetch chat partners");
  return res.json();
}

export async function uploadToBlob(file: File): Promise<{ url: string }> {
  const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
    method: 'POST',
    body: file,
  });
  if (!response.ok) throw new Error("Failed to upload file");
  return response.json();
}

export async function markMessagesAsRead(recipientId: string, senderId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/chat/messages/read/${recipientId}/${senderId}`, {
    method: "PUT",
    headers: { 'ngrok-skip-browser-warning': 'true' },
  });
}

