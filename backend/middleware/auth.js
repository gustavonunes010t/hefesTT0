import jwt from "jsonwebtoken";

// Middleware para verificar token JWT
export const verifyToken = (req, res, next) => {
  // Pega token do header Authorization: Bearer <token>
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: "Acesso negado. Token não fornecido." 
    });
  }
  
  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adiciona dados do usuário à requisição
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: "Token inválido ou expirado." 
    });
  }
};

// Middleware para verificar se é admin
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ 
      success: false, 
      error: "Acesso restrito a administradores." 
    });
  }
  next();
};