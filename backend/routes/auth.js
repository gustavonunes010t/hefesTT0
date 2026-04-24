import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config.js";

const router = Router();

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const signToken = (user) => jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  JWT_SECRET,
  { expiresIn: "7d" }
);

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios."
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha inválidos."
      });
    }

    res.json({
      success: true,
      message: "Login realizado com sucesso.",
      token: signToken(user),
      user: buildUserPayload(user)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
