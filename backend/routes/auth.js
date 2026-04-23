import express from "express";
import User from "../models/User.js";

const router = express.Router();

// cadastro
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// listar usuários (teste)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export default router;