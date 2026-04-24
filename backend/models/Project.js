import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Título é obrigatório"],
    trim: true,
    maxlength: [100, "Título não pode exceder 100 caracteres"]
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // Index inline (mais limpo)
  },
  location: {
    type: String,
    trim: true,
    default: ""
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, "Descrição não pode exceder 1000 caracteres"]
  },
  images: [{
    url: { 
      type: String, 
      required: true,
      // Validação básica de URL
      match: [/^https?:\/\/.+/, "URL de imagem inválida"]
    },
    publicId: String,
    alt: String
  }],
  videoUrl: {
    type: String,
    default: "",
    match: [/^https?:\/\/.+/, "URL de vídeo inválida"]
  },
  featured: {
    type: Boolean,
    default: false,
    index: true // Útil para filtrar destaques
  }
  // ✅ REMOVIDO: createdAt (timestamps: true já cuida disso)
}, {
  timestamps: true, // Cria createdAt e updatedAt automaticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// INDEXES PARA PERFORMANCE
// ============================================
projectSchema.index({ slug: 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ featured: -1, createdAt: -1 }); // Busca por destaques

// ============================================
// PRE-SAVE: GERA SLUG AUTOMÁTICO
// ============================================
projectSchema.pre("save", function(next) {
  try {
    if (this.isModified("title") && this.title) {
      let slug = this.title
        .toLowerCase()
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-") // Substitui não-alfanuméricos por -
        .replace(/(^-|-$)+/g, ""); // Remove - do início/fim
      
      // Garante que o slug não fique vazio
      this.slug = slug || `projeto-${Date.now()}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ============================================
// MÉTODO UTILITÁRIO: Verificar se tem mídia
// ============================================
projectSchema.methods.hasMedia = function() {
  return this.images?.length > 0 || !!this.videoUrl;
};

// ============================================
// MÉTODO UTILITÁRIO: Imagem de capa (thumbnail)
// ============================================
projectSchema.methods.getThumbnail = function() {
  return this.images?.[0]?.url || null;
};

export default mongoose.model("Project", projectSchema);