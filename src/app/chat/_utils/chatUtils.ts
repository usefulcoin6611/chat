export const isImageUrl = (url: string) => {
  return url.startsWith('http') && (
    url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
    url.includes('public.blob.vercel-storage.com')
  );
};
