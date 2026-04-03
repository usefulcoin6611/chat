import { Button } from "@/components/ui/button";
import { ImagePreviewOverlayProps } from "../../_types/chat";
import { isAudioUrl, isImageUrl } from "../../_utils/chatUtils";

export function ImagePreviewOverlay({ 
  previewUrl, 
  previewFile, 
  cancelPreview, 
  fileInputRef 
}: ImagePreviewOverlayProps) {
  if (!previewUrl) return null;

  // Check file type if available (more reliable for blob URLs), otherwise fallback to URL pattern
  const isAudio = previewFile?.type.startsWith('audio/') || isAudioUrl(previewUrl);

  return (
    <div className="absolute bottom-full left-0 w-full bg-slate-100/95 dark:bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50 h-[calc(100vh-180px)] animate-in fade-in zoom-in duration-300">
      <div className="relative group max-w-full max-h-full flex flex-col items-center">
        {isAudio ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl flex flex-col items-center space-y-6 min-w-[320px] max-w-[90%] border border-slate-200 dark:border-slate-800">
            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 animate-pulse ring-4 ring-indigo-500/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            </div>
            <div className="text-center">
               <h4 className="font-bold text-xl text-slate-800 dark:text-slate-100 mb-1">Voice Message Preview</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400">Listen back before sending.</p>
            </div>
            <div className="w-full bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border dark:border-slate-700">
                <audio src={previewUrl} controls className="w-full h-10 dark:invert dark:filter dark:brightness-125" />
            </div>
          </div>
        ) : (
          <img 
            src={previewUrl} 
            alt="Focus Preview" 
            className="max-h-[60vh] w-auto rounded-xl shadow-2xl object-contain border-4 border-white dark:border-slate-800" 
          />
        )}
        
        <button 
          onClick={cancelPreview}
          className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2.5 shadow-lg hover:bg-red-600 transition-all active:scale-90 cursor-pointer z-10 border-2 border-white dark:border-slate-900"
          title="Cancel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div className="mt-12 flex space-x-4 items-center">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-lg relative group/thumb ring-2 ring-green-500 flex items-center justify-center p-1">
          {isAudio ? (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 w-full h-full rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>
            </div>
          ) : (
            <img src={previewUrl} alt="Thumb" className="w-full h-full object-cover rounded-lg" />
          )}
          <div className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-end justify-center pb-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity font-bold">
            SELECTED
          </div>
        </div>
        {!isAudio && (
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-all bg-white dark:bg-slate-800 shadow-md hover:shadow-lg cursor-pointer border border-slate-100 dark:border-slate-700"
                title="Change Photo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </button>
        )}
      </div>
    </div>
  );
}
