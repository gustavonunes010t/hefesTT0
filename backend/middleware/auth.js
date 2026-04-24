import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
  const [type, token] = req.headers.authorization?.split(" ") || [];

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      error: "Acesso negado. Token não fornecido."
    });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Token inválido ou expirado."
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Acesso restrito a administradores."
    });
  }

  next();
};
