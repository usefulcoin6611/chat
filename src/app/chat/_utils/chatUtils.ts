export const isImageUrl = (url: string) => {
  if (!url) return false;
  const isHttp = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:');
  const hasImageExt = /\.(jpg|jpeg|png|gif|webp|svg)/i.test(url);
  return isHttp && (hasImageExt || (url.includes('public.blob.vercel-storage.com') && !url.includes('audio')));
};

export const isAudioUrl = (url: string) => {
  if (!url) return false;
  const isHttp = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:');
  const hasAudioExt = /\.(mp3|wav|m4a|webm|ogg)/i.test(url);
  return isHttp && (hasAudioExt || url.includes('audio-recording') || url.includes('audio'));
};
