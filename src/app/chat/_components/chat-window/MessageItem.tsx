import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageItemProps } from "../../_types/chat";
import { isImageUrl, isAudioUrl } from "../../_utils/chatUtils";

export function MessageItem({ message, isMe, onDelete }: MessageItemProps) {
  const displayTime = message.timestamp 
    ? new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true}) 
    : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});

  const isImage = isImageUrl(message.content);
  const isAudio = isAudioUrl(message.content);

  return (
    <div className={`flex items-start group ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {!isMe && (
        <Avatar className="h-8 w-8 mr-2 mt-0.5 flex-shrink-0 ring-1 ring-slate-200 dark:ring-slate-700">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-[10px] font-bold">
            {message.senderId.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] px-1`}>
        <div className="flex items-center space-x-2 w-full">
          {isMe && message.id && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(message.id!)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm cursor-pointer shrink-0"
              title="Hapus Pesan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            </Button>
          )}

          <div className={`rounded-2xl transition-shadow group-hover:shadow-sm w-full ${
            isMe 
              ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200 dark:shadow-none' 
              : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-slate-200/50 dark:shadow-none border dark:border-slate-700/50'
          } ${isImage ? 'p-1.5' : (isAudio ? 'p-2 min-w-[240px]' : 'px-4 py-2')}`}>
            {isImage ? (
              <div className="overflow-hidden rounded-xl bg-black/5 dark:bg-black/20">
                <img 
                  src={message.content} 
                  alt="Shared Image" 
                  className="max-w-full sm:max-w-xs h-auto block object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => window.open(message.content, '_blank')}
                />
              </div>
            ) : isAudio ? (
              <div className="flex flex-col space-y-1">
                 <audio 
                    src={message.content} 
                    controls 
                    className={`h-10 w-full max-w-[280px] ${isMe ? 'invert filter brightness-150' : 'dark:invert dark:filter dark:brightness-125'}`}
                 />
              </div>
            ) : (
              <p className="text-[15px] leading-relaxed break-words font-medium">{message.content}</p>
            )}
            <p className={`text-[9px] mt-1 text-right flex items-center justify-end leading-none font-medium ${isMe ? 'text-indigo-200' : 'text-slate-400'} ${isImage || isAudio ? 'px-1 pb-1' : ''}`}>
              {displayTime}
              {isMe && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 opacity-70"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
