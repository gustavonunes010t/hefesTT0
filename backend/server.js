import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { AUTO_CREATE_ADMIN, MONGO_URI, PORT } from "./config.js";
import { ensureDefaultAdmin } from "./services/ensureDefaultAdmin.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

// 🔥 PRIMEIRO: criar o app
const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 ROTAS DA API
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// 🔥 FRONTEND (produção - Vite build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 🔥 BANCO
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log("MongoDB conectado");

    if (AUTO_CREATE_ADMIN) {
      await ensureDefaultAdmin();
    }
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error.message);
  });

// 🔥 SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});