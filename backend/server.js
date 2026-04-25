import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { AUTO_CREATE_ADMIN, MONGO_URI, PORT } from "./config.js";
import { ensureDefaultAdmin } from "./services/ensureDefaultAdmin.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();

/* =========================
   🔥 CORS (produção)
========================= */
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

/* =========================
   🔥 MIDDLEWARES
========================= */
app.use(express.json());

/* =========================
   🔥 ROTA DE TESTE (CRÍTICA)
========================= */
app.get("/api/teste", (req, res) => {
  res.json({ funcionando: true });
});

/* =========================
   🔥 ROTAS
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

/* =========================
   🔥 BANCO
========================= */
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  })
  .then(async () => {
    console.log("✅ MongoDB conectado");

    if (AUTO_CREATE_ADMIN) {
      await ensureDefaultAdmin();
    }
  })
  .catch((error) => {
    console.error("❌ Erro MongoDB:", error.message);
  });

/* =========================
   🔥 HEALTH CHECK (Render usa)
========================= */
app.get("/", (req, res) => {
  res.send("API online");
});

/* =========================
   🔥 SERVIDOR
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});