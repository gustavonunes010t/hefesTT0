import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Project from "../models/Project.js";
import { verifyToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const uploadDirectories = {
  images: path.join(__dirname, "..", "uploads", "images"),
  videos: path.join(__dirname, "..", "uploads", "videos")
};

Object.values(uploadDirectories).forEach((directory) => {
  fs.mkdirSync(directory, { recursive: true });
});

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm"
]);
const allowedExtensions = new Set([".jpeg", ".jpg", ".png", ".gif", ".webp", ".mp4", ".webm"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, file.mimetype.startsWith("video/") ? uploadDirectories.videos : uploadDirectories.images);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(extension)) {
      cb(null, true);
      return;
    }

    cb(new Error("Apenas imagens (JPEG, PNG, GIF, WebP) e vídeos (MP4, WebM) são permitidos."));
  }
});

const uploadMedia = (req, res, next) => {
  upload.array("media", 10)(req, res, (error) => {
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    next();
  });
};

const buildMediaFromFiles = (files = [], title = "") => {
  const images = [];
  let videoUrl = "";

  files.forEach((file) => {
    const type = file.mimetype.startsWith("video/") ? "videos" : "images";
    const fileUrl = `/uploads/${type}/${file.filename}`;

    if (type === "videos") {
      videoUrl = fileUrl;
      return;
    }

    images.push({
      url: fileUrl,
      publicId: file.filename,
      alt: title.trim()
    });
  });

  return { images, videoUrl };
};

const parseExistingImages = (value) => {
  if (!value) return [];

  try {
    const images = JSON.parse(value);
    return Array.isArray(images)
      ? images.filter((image) => image?.url).map((image) => ({
        url: image.url,
        publicId: image.publicId || "",
        alt: image.alt || ""
      }))
      : [];
  } catch {
    return [];
  }
};

router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Projeto não encontrado."
      });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/", verifyToken, uploadMedia, async (req, res) => {
  try {
    const { title, location, description, featured } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: "Título é obrigatório." });
    }

    const { images, videoUrl } = buildMediaFromFiles(req.files, title);

    const project = new Project({
      title: title.trim(),
      location,
      description,
      images,
      videoUrl,
      featured: featured === true || featured === "true"
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Projeto criado com sucesso.",
      project
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.put("/:id", verifyToken, uploadMedia, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Projeto não encontrado."
      });
    }

    const { title, location, description, featured, existingImages, videoUrl } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, error: "Título é obrigatório." });
    }

    const uploadedMedia = buildMediaFromFiles(req.files, title);

    project.title = title.trim();
    project.location = location || "";
    project.description = description || "";
    project.featured = featured === true || featured === "true";
    project.images = [
      ...parseExistingImages(existingImages),
      ...uploadedMedia.images
    ];
    project.videoUrl = uploadedMedia.videoUrl || videoUrl || "";

    await project.save();

    res.json({
      success: true,
      message: "Projeto atualizado com sucesso.",
      project
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Projeto não encontrado."
      });
    }

    res.json({ success: true, message: "Projeto deletado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
