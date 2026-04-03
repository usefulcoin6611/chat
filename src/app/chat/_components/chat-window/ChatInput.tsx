import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import React, { useEffect, useRef } from "react";
import { ChatInputProps } from "../../_types/chat";

function AudioVisualizer({ stream }: { stream: MediaStream | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barPadding = 3;
      const barWidth = 4;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let amplitude = dataArray[i] / 255;
        if (amplitude < 0.05) amplitude = 0.02; // Minimal dot
        
        const barHeight = Math.max(4, amplitude * canvas.height * 0.7);
        
        ctx.fillStyle = '#b1b3b5'; // Gray/Silver like the image
        
        const radius = 2;
        const y = (canvas.height - barHeight) / 2;
        
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();

        x += barWidth + barPadding;
        if (x > canvas.width) break;
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      audioContext.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} width={300} height={40} className="w-full h-10" />;
}

export function ChatInput({
  inputText,
  setInputText,
  handleSendMessage,
  handleEmojiClick,
  handlePaste,
  fileInputRef,
  handleFileUpload,
  isUploading,
  previewUrl,
  previewFile,
  sendPreview,
  inputRef,
  EmojiPicker,
    isRecording,
    startRecording,
    stopRecording,
    cancelRecording,
    mediaStream,
    recordingTime,
    formatTime
}: ChatInputProps) {
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRecording();
      return;
    }
    if (previewFile) {
      sendPreview();
    } else {
      handleSendMessage(e);
    }
  };

  const showSend = inputText.trim() || previewUrl;

  return (
    <div className="h-[88px] p-4 bg-slate-50 dark:bg-slate-900 overflow-visible z-20 relative border-t dark:border-slate-800 shrink-0">
      <form onSubmit={onFormSubmit} className="flex items-center space-x-3 w-full h-full">
        <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-full shadow-sm px-4 h-14 ring-1 ring-slate-200 dark:ring-slate-700/50 focus-within:ring-indigo-500/30 transition-all relative overflow-hidden">
          {isRecording && (
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full flex items-center px-4 z-10">
              {/* Trash/Delete Icon (Left) */}
              <button 
                type="button" 
                onClick={cancelRecording}
                className="text-slate-500 hover:text-red-500 transition-colors p-2 cursor-pointer shrink-0"
                title="Batalkan Rekaman"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>

              <div className="flex-1 flex items-center justify-center space-x-4">
                 {/* Red Dot */}
                 <div className="w-[14px] h-[14px] rounded-full bg-[#c01048] shrink-0"></div>
                 
                 {/* Timer */}
                 <div className="text-[20px] font-medium text-slate-700 dark:text-slate-200 tracking-tight">
                    {formatTime(recordingTime)}
                 </div>
              </div>

              {/* Right Side UI */}
              <div className="flex items-center space-x-4">
                 {/* Waveform (Small/Compact) */}
                 <div className="w-32 h-6 opacity-40 grayscale overflow-hidden hidden md:block">
                    <AudioVisualizer stream={mediaStream} />
                 </div>

                 {/* Pause/Stop Icon (Red Bars) */}
                 <div className="text-[#c01048] shrink-0 cursor-pointer hover:scale-110 transition-transform" onClick={stopRecording}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect width="4" height="16" x="6" y="4" rx="1"/><rect width="4" height="16" x="14" y="4" rx="1"/></svg>
                 </div>
              </div>
            </div>
          )}
          
          <Popover>
            <PopoverTrigger className={`rounded-full w-10 h-10 p-0 text-slate-500 hover:text-indigo-600 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer bg-transparent border-none outline-none ${isRecording ? 'invisible' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-auto p-0 border-none shadow-xl bg-transparent mb-4">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme={undefined} lazyLoadEmojis={true} />
            </PopoverContent>
          </Popover>

          <Input
            ref={inputRef}
            value={inputText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputText(e.target.value)}
            onPaste={handlePaste}
            placeholder="Ketik pesan..."
            disabled={isRecording}
            className="flex-1 border-none focus-visible:ring-0 bg-transparent text-lg placeholder:text-slate-400"
          />

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            disabled={isUploading || isRecording}
            className="rounded-full w-10 h-10 p-0 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Pilih Gambar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.51a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </Button>
        </div>

        {showSend ? (
          <Button 
            type="submit" 
            disabled={isRecording}
            className="rounded-full w-14 h-14 p-0 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
          >
            {isUploading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            )}
          </Button>
        ) : (
           <Button 
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full w-14 h-14 p-0 shadow-lg transition-all active:scale-95 flex-shrink-0 cursor-pointer ring-4 ring-white dark:ring-slate-900 z-30 ${
                isRecording 
                    ? "bg-[#1f1f1f] hover:bg-black shadow-black/20" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
            }`}
          >
            {isRecording ? (
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            ) : (
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            )}
          </Button>
        )}
      </form>
    </div>
  );
}
