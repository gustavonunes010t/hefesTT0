import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// criar projeto
router.post("/", async (req, res) => {
  const project = new Project(req.body);
  const saved = await project.save();
  res.json(saved);
});

// listar projetos
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

export default router;