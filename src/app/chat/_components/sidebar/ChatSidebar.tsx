import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatSidebarProps } from "../../_types/chat";

export function ChatSidebar({
  currentUser,
  recipientId,
  setRecipientId,
  activeChat,
  chatPartners,
  unreadCounts,
  isCollapsed,
  toggleSidebar,
  handleStartChat,
  handleSelectPartner,
  logout
}: ChatSidebarProps) {
  const sidebarWidthClass = isCollapsed 
    ? "w-20" 
    : "w-full md:w-[350px] lg:w-[400px]";

  return (
    <div className={`${sidebarWidthClass} transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 flex flex-col border-r dark:border-slate-800 relative z-40 h-full`}>
      <div className={`h-[72px] p-4 flex items-center bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 shrink-0 transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'hidden' : 'flex'}`}>
          <Avatar className="h-10 w-10 shrink-0 ring-2 ring-indigo-500/20">
            <AvatarFallback className="bg-indigo-600 text-white font-bold">
              {currentUser.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{currentUser}</span>
        </div>

        {isCollapsed && (
          <div className="flex flex-col items-center justify-center space-y-1">
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-10 w-10 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl"
                title="Expand Sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
          </div>
        )}
        
        {!isCollapsed && (
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-8 w-8 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-500 rounded-full"
                title="Collapse Sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
        )}
      </div>
      
      <div className={`p-4 flex-1 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
            <>
                <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">New Conversation</h2>
                <form onSubmit={handleStartChat} className="flex space-x-2 mb-8">
                <Input 
                    placeholder="Friend's username..."
                    value={recipientId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientId(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-indigo-500/30 h-10"
                />
                <Button type="submit" className="rounded-xl h-10 px-6 bg-indigo-600 text-white border-none hover:bg-indigo-700 shadow-md hover:shadow-indigo-500/30 active:scale-95 transition-all duration-200">Chat</Button>
                </form>
            </>
        )}

        {isCollapsed && (
             <div className="h-4"></div>
        )}

        {activeChat && !chatPartners.includes(activeChat) && (
          <div className="mb-8">
             {!isCollapsed && <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">Active Chat</h2>}
             <div 
                className={`flex items-center p-3 cursor-pointer rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.99] transition-all ${isCollapsed ? 'justify-center' : ''}`}
                title={activeChat}
             >
                  <Avatar className="h-10 w-10 shrink-0 border-2 border-white/20">
                      <AvatarFallback className="bg-white/20 text-white">
                          {activeChat.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                      <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-bold text-white truncate">{activeChat}</p>
                          <p className="text-[10px] text-white/70 flex items-center mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></span>
                              Active Now
                          </p>
                      </div>
                  )}
             </div>
          </div>
        )}

        <div className="mt-2">
          {!isCollapsed && <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">Recent Chats</h2>}
          <div className="space-y-2">
            {chatPartners.map((partner) => (
              <div 
                key={partner}
                onClick={() => handleSelectPartner(partner)}
                title={isCollapsed ? partner : ""}
                className={`flex items-center group p-3 cursor-pointer rounded-xl transition-all relative ${
                  activeChat === partner 
                    ? "bg-slate-100 dark:bg-slate-800 shadow-sm" 
                    : "hover:bg-indigo-50/80 dark:hover:bg-indigo-900/20 hover:translate-x-1"
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Avatar className={`h-10 w-10 shrink-0 transition-transform group-hover:scale-105 ${activeChat === partner ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : ''}`}>
                  <AvatarFallback className={activeChat === partner ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}>
                    {partner.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {!isCollapsed && (
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-bold truncate ${activeChat === partner ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"}`}>
                          {partner}
                        </p>
                        {unreadCounts[partner] > 0 && (
                          <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ml-2">
                            {unreadCounts[partner] > 99 ? '99+' : unreadCounts[partner]}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Tap to open</p>
                    </div>
                )}

                {isCollapsed && unreadCounts[partner] > 0 && (
                    <span className="absolute top-2 right-2 bg-indigo-600 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800"></span>
                )}
              </div>
            ))}
            {!isCollapsed && chatPartners.length === 0 && (
              <div className="text-center py-10">
                  <div className="bg-slate-50 dark:bg-slate-800/40 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <p className="text-xs text-slate-400">No conversations yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`h-[88px] p-4 border-t dark:border-slate-800 shrink-0 flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
           <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className={`w-full group/logout transition-all duration-200 ${
                    isCollapsed 
                        ? 'w-10 h-10 p-0' 
                        : 'justify-start px-3 h-11 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl'
                }`}
                title="Logout"
           >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className={`${isCollapsed ? 'text-red-500' : 'mr-3 group-hover/logout:-translate-x-1 transition-transform'}`}
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {!isCollapsed && <span className="font-semibold">Keluar Sesi</span>}
           </Button>
      </div>
    </div>
  );
}
