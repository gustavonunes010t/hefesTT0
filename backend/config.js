import "dotenv/config";

// 🔌 Porta (Render injeta automaticamente)
export const PORT = process.env.PORT || 5000;

// 🗄️ MongoDB (OBRIGATÓRIO em produção)
export const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI não definida no ambiente");
}

// 🔐 JWT (OBRIGATÓRIO)
export const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ JWT_SECRET não definida no ambiente");
}

// ⚙️ Flags
export const AUTO_CREATE_ADMIN = process.env.AUTO_CREATE_ADMIN !== "false";
export const RESET_ADMIN_PASSWORD = process.env.RESET_ADMIN_PASSWORD === "true";

// 👤 Admin padrão (seguro via ENV)
export const DEFAULT_ADMIN = {
  name: process.env.DEFAULT_ADMIN_NAME || "Administrador Hefestto",
  email: process.env.DEFAULT_ADMIN_EMAIL || "admin@hefestto.com.br",
  password: process.env.DEFAULT_ADMIN_PASSWORD
};

if (!DEFAULT_ADMIN.password) {
  console.warn("⚠️ DEFAULT_ADMIN_PASSWORD não definido. Admin não será criado automaticamente.");
}

// 🌐 CORS
export const CORS_ORIGINS = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);