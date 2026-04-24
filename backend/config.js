import "dotenv/config";

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hefestto";
export const JWT_SECRET = process.env.JWT_SECRET || "hefestto-dev-secret";
export const AUTO_CREATE_ADMIN = process.env.AUTO_CREATE_ADMIN !== "false";
export const RESET_ADMIN_PASSWORD = process.env.RESET_ADMIN_PASSWORD === "true";

export const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || "Administrador Hefestto",
  email: process.env.DEFAULT_ADMIN_EMAIL || "admin@hefestto.com.br",
  password: process.env.DEFAULT_ADMIN_PASSWORD || "Hefestto@2026"
};

export const CORS_ORIGINS = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET nao definido. Usando segredo local apenas para desenvolvimento.");
}
