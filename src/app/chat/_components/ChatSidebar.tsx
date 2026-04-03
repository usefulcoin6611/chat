import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatSidebarProps {
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
      <div className={`p-4 flex ${isCollapsed ? 'flex-col items-center space-y-4' : 'justify-between items-center'} bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col' : 'space-x-3'}`}>
          <Avatar className="h-10 w-10 ring-2 ring-indigo-500/20">
            <AvatarFallback className="bg-indigo-600 text-white font-bold">
              {currentUser.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">{currentUser}</span>}
        </div>
        
        <div className={`flex items-center ${isCollapsed ? 'flex-col space-y-4' : 'space-x-1'}`}>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-8 w-8 p-0 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-500 rounded-full"
                title={isCollapsed ? "Maximize Sidebar" : "Minimize Sidebar"}
            >
                {isCollapsed ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                )}
            </Button>
            {!isCollapsed && (
                <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-slate-800 h-8 px-2">
                    Logout
                </Button>
            )}
        </div>
      </div>
      
      <div className={`p-4 flex-1 overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar ${isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
            <>
                <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">Mulai Percakapan Baru</h2>
                <form onSubmit={handleStartChat} className="flex space-x-2 mb-8">
                <Input 
                    placeholder="Username teman..."
                    value={recipientId}
                    onChange={(e) => setRecipientId(e.target.value)}
                    className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-indigo-500/30 h-10"
                />
                <Button type="submit" variant="secondary" className="rounded-xl h-10 px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 hover:bg-indigo-100 transition-all">Chat</Button>
                </form>
            </>
        )}

        {isCollapsed && (
             <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout} 
                className="w-10 h-10 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mb-6 mx-auto flex"
                title="Logout"
             >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             </Button>
        )}

        {activeChat && !chatPartners.includes(activeChat) && (
          <div className="mb-8">
             {!isCollapsed && <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">Chat Aktif</h2>}
             <div 
                className={`flex items-center p-3 cursor-pointer rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-none ${isCollapsed ? 'justify-center' : ''}`}
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
          {!isCollapsed && <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-[0.1em]">Riwayat Chat</h2>}
          <div className="space-y-2">
            {chatPartners.map((partner) => (
              <div 
                key={partner}
                onClick={() => handleSelectPartner(partner)}
                title={isCollapsed ? partner : ""}
                className={`flex items-center group p-3 cursor-pointer rounded-xl transition-all relative ${
                  activeChat === partner 
                    ? "bg-slate-100 dark:bg-slate-800 shadow-sm" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
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
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Klik untuk melihat pesan</p>
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
                  <p className="text-xs text-slate-400">Belum ada riwayat chat.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
