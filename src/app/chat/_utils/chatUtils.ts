export const isImageUrl = (url: string) => {
  return (
    (url.startsWith('http') || url.startsWith('https')) && 
    (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i) || url.includes('public.blob.vercel-storage.com'))
  );
};

export const isAudioUrl = (url: string) => {
  return (
    (url.startsWith('http') || url.startsWith('https')) && 
    (url.match(/\.(mp3|wav|m4a|webm|ogg)/i) || url.includes('audio-recording'))
  );
};
