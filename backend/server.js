import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rotas
app.use("/api/auth", authRoutes);

// conexão Mongo
mongoose.connect("mongodb://127.0.0.1:27017/hefestto")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

// servidor
app.listen(5000, () => {
  console.log("Servidor rodando em http://localhost:5000");
});
import projectRoutes from "./routes/projects.js"; 

app.use("/api/projects", projectRoutes);
