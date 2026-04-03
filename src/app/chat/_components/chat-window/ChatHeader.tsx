import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatHeaderProps } from "../../_types/chat";

export function ChatHeader({ activeChat, isDarkMode, toggleTheme, onBack }: ChatHeaderProps) {
  return (
    <div className="h-[72px] p-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 shrink-0 transition-all">
      <div className="flex items-center">
        {onBack && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="md:hidden mr-2 p-0 h-8 w-8 text-slate-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
        )}
        <Avatar className="h-10 w-10 ring-2 ring-indigo-500/10">
          <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm">
            {activeChat.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">{activeChat}</h3>
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleTheme} 
        className="rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 hover:bg-neutral-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </Button>
    </div>
  );
}
