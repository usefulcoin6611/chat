import { MessageListProps } from "../../_types/chat";
import { MessageItem } from "./MessageItem";

export function MessageList({ messages, currentUser, activeChat, scrollRef, handleDeleteMessage }: MessageListProps) {
  return (
    <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950/50 overflow-y-auto scroll-smooth custom-scrollbar" ref={scrollRef}>
      <div className="flex flex-col space-y-5 pb-6">
        {messages.map((m) => (
          <MessageItem 
            key={m.id || Math.random().toString()} 
            message={m} 
            isMe={m.senderId === currentUser} 
            onDelete={handleDeleteMessage} 
          />
        ))}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 group/empty">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-full shadow-sm mb-4 transition-transform group-hover/empty:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400 opacity-60"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/><path d="M12 12h.01"/></svg>
            </div>
            <p className="font-medium text-lg text-slate-500 dark:text-slate-400">No messages yet.</p>
            <p className="text-sm text-slate-400 mt-1">Say hi to {activeChat}!</p>
          </div>
        )}
        <div className="h-4 w-full flex-shrink-0"></div>
      </div>
    </div>
  );
}
