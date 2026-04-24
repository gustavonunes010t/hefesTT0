import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { AUTO_CREATE_ADMIN, CORS_ORIGINS, MONGO_URI, PORT } from "./config.js";
import { ensureDefaultAdmin } from "./services/ensureDefaultAdmin.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const databaseStates = ["disconnected", "connected", "connecting", "disconnecting"];

app.use(cors({
  origin: CORS_ORIGINS.length > 0 ? CORS_ORIGINS : true
}));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    database: databaseStates[mongoose.connection.readyState] || "unknown"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

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

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
