import { API_ORIGIN } from "../services/api";

export const PLACEHOLDER_IMAGE = "/images/projeto1.png";

export const formatImageUrl = (url) => {
  if (!url) return PLACEHOLDER_IMAGE;
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_ORIGIN}${url}`;

  return url;
};

export const getImageExtension = (url) => {
  if (!url) return "jpg";
  return url.split(".").pop().split("?")[0] || "jpg";
};

export const isVideo = (url) => {
  if (!url) return false;

  const videoExts = ["mp4", "webm", "ogg"];
  return videoExts.includes(getImageExtension(url).toLowerCase());
};
