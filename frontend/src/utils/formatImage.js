/**
 * Utilitário para otimizar/formatar imagens
 * (Pode ser expandido para compressão, redimensionamento, etc.)
 */

export const formatImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";
  return url;
};

export const getImageExtension = (url) => {
  if (!url) return "jpg";
  return url.split(".").pop().split("?")[0] || "jpg";
};

export const isVideo = (url) => {
  if (!url) return false;
  const videoExts = ["mp4", "webm", "ogg"];
  const ext = getImageExtension(url);
  return videoExts.includes(ext);
};