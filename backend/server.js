import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { AUTO_CREATE_ADMIN, MONGO_URI, PORT } from "./config.js";
import { ensureDefaultAdmin } from "./services/ensureDefaultAdmin.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

// 🔥 APP
const app = express();

// 🔥 MIDDLEWARES
app.use(cors());
app.use(express.json());

// 🔥 ROTAS
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

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

// 🔥 SERVIDOR (Render-ready)
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});