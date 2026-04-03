import { Button } from "@/components/ui/button";
import { ImagePreviewOverlayProps } from "../../_types/chat";

export function ImagePreviewOverlay({ 
  previewUrl, 
  previewFile, 
  cancelPreview, 
  fileInputRef 
}: ImagePreviewOverlayProps) {
  if (!previewUrl) return null;

  return (
    <div className="absolute bottom-full left-0 w-full bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50 h-[calc(100vh-180px)] animate-in fade-in zoom-in duration-300">
      <div className="relative group max-w-full max-h-full">
        <img 
          src={previewUrl} 
          alt="Focus Preview" 
          className="max-h-[60vh] w-auto rounded-xl shadow-2xl object-contain" 
        />
        <button 
          onClick={cancelPreview}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-all active:scale-90 cursor-pointer"
          title="Batalkan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div className="mt-12 flex space-x-3 items-center">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-white shadow-md relative group/thumb ring-2 ring-green-500">
          <img src={previewUrl} alt="Thumb" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 text-white text-[8px] flex items-end justify-center pb-0.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity">
            Aktif
          </div>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all bg-white dark:bg-slate-800 shadow-sm hover:shadow-md cursor-pointer"
          title="Tambah Foto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>
    </div>
  );
}
