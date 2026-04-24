import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Project from "../models/Project.js";
import { verifyToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// ============================================
// CONFIGURAÇÃO DO MULTER (UPLOAD DE ARQUIVOS)
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define pasta baseada no tipo de arquivo
    const uploadPath = file.mimetype.startsWith("video/") 
      ? "uploads/videos/" 
      : "uploads/images/";
    cb(null, path.join(__dirname, "..", uploadPath));
  },
  filename: (req, file, cb) => {
    // Nome único: timestamp + random + extensão
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite: 10MB
  fileFilter: (req, file, cb) => {
    // Aceita apenas imagens e vídeos
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens (JPEG, PNG, WebP) e vídeos (MP4, WebM) são permitidos"));
    }
  }
});

// ============================================
// GET - Listar todos os projetos
// ============================================
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); // Mais recentes primeiro
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// GET - Buscar projeto por slug
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: "Projeto não encontrado" 
      });
    }
    
    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// POST - Criar projeto com upload
// ============================================
router.post("/", verifyToken, upload.array("media", 10), async (req, res) => {
  try {
    const { title, location, description, featured } = req.body;
    
    // Processa arquivos uploadados
    const images = [];
    let videoUrl = "";
    
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fileUrl = `/uploads/${file.mimetype.startsWith("video/") ? "videos" : "images"}/${file.filename}`;
        
        if (file.mimetype.startsWith("video/")) {
          videoUrl = fileUrl;
        } else {
          images.push({
            url: fileUrl,
            publicId: file.filename,
            alt: title
          });
        }
      });
    }
    
    // Cria projeto
    const project = new Project({
      title,
      location,
      description,
      images,
      videoUrl,
      featured: featured === "true"
    });
    
    await project.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Projeto criado com sucesso",
      project 
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================
// PUT - Atualizar projeto
// ============================================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Retorna documento atualizado
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: "Projeto não encontrado" 
      });
    }
    
    res.json({ success: true, project });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ============================================
// DELETE - Remover projeto
// ============================================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        error: "Projeto não encontrado" 
      });
    }
    
    res.json({ success: true, message: "Projeto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;