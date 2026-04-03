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
  handleStartChat,
  handleSelectPartner,
  logout
}: ChatSidebarProps) {
  return (
    <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-slate-900 flex flex-col border-r dark:border-slate-800">
      <div className="p-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-indigo-600 text-white font-bold">
              {currentUser.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-slate-800 dark:text-slate-100">{currentUser}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-slate-800">
          Logout
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto bg-white dark:bg-slate-900">
        <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Mulai Percakapan Baru</h2>
        <form onSubmit={handleStartChat} className="flex space-x-2">
           <Input 
              placeholder="Username teman..."
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="flex-1 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus-visible:ring-0"
           />
           <Button type="submit" variant="secondary" className="rounded-lg">Chat</Button>
        </form>

        {activeChat && !chatPartners.includes(activeChat) && (
          <div className="mt-8">
             <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Chat Aktif</h2>
             <div className="flex items-center p-3 cursor-pointer rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                  <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-600 text-white">
                          {activeChat.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{activeChat}</p>
                      <p className="text-xs text-indigo-500 mt-1 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
                          Online
                      </p>
                  </div>
             </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Riwayat Chat</h2>
          <div className="space-y-1">
            {chatPartners.map((partner) => (
              <div 
                key={partner}
                onClick={() => handleSelectPartner(partner)}
                className={`flex items-center p-3 cursor-pointer rounded-lg transition-all ${
                  activeChat === partner 
                    ? "bg-slate-100 dark:bg-slate-800" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={activeChat === partner ? "bg-indigo-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"}>
                    {partner.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium truncate ${activeChat === partner ? "text-indigo-900 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300"}`}>
                      {partner}
                    </p>
                    {unreadCounts[partner] > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCounts[partner] > 99 ? '99+' : unreadCounts[partner]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {chatPartners.length === 0 && (
              <p className="text-xs text-slate-400 italic">Belum ada riwayat chat.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
