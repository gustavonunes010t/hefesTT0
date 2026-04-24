const whatsappNumber = import.meta.env.VITE_CONTACT_WHATSAPP || "+5562992597569";
const instagramHandle = import.meta.env.VITE_CONTACT_INSTAGRAM || "@arquitetokevynsousa";
const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "";

const onlyDigits = whatsappNumber.replace(/\D/g, "");
const normalizedInstagram = instagramHandle.replace(/^@/, "");

export const contactInfo = {
  architectName: import.meta.env.VITE_ARCHITECT_NAME || "Kevyn Sousa",
  email: contactEmail,
  whatsapp: whatsappNumber,
  whatsappUrl: `https://wa.me/${onlyDigits}?text=${encodeURIComponent("Olá, Kevyn! Quero arquitetar meus sonhos.")}`,
  instagram: normalizedInstagram,
  instagramUrl: `https://instagram.com/${normalizedInstagram}`
};
