import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ MOVA PARA CÁ:
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// ✅ ROTAS ANTES DO LISTEN
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// conexão Mongo
mongoose.connect("mongodb://127.0.0.1:27017/hefestto")
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log(err));

// servidor
app.listen(5000, () => {
  console.log("Servidor rodando em http://localhost:5000");
});

// ❌ APAGUE essas duas linhas de baixo (já foram movidas)