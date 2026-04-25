import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { AUTO_CREATE_ADMIN, MONGO_URI, PORT } from "./config.js";
import { ensureDefaultAdmin } from "./services/ensureDefaultAdmin.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();

/* =========================
   🔥 CORS CORRETO (ESSENCIAL)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://hefes-tt-0.vercel.app" // SEU FRONTEND
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* =========================
   🔥 MIDDLEWARES
========================= */
app.use(express.json());

/* =========================
   🔥 TESTE
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
   🔥 HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API online");
});

/* =========================
   🔥 BANCO
========================= */
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("MongoDB conectado");

    if (AUTO_CREATE_ADMIN) {
      await ensureDefaultAdmin();
    }
  })
  .catch((err) => {
    console.error("Erro Mongo:", err.message);
  });

/* =========================
   🔥 SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});