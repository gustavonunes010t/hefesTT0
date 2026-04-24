import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

// ============================================
// REGISTRO (criar novo usuário)
// ============================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Verifica se usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: "Email já cadastrado" 
      });
    }
    
    // Cria novo usuário
    const user = new User({ name, email, password });
    await user.save();
    
    // Gera token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token válido por 7 dias
    );
    
    res.status(201).json({
      success: true,
      message: "Usuário criado com sucesso",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// LOGIN
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Busca usuário por email (inclui senha)
    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Email ou senha inválidos" 
      });
    }
    
    // Verifica senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        error: "Email ou senha inválidos" 
      });
    }
    
    // Gera token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      message: "Login realizado com sucesso",
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;