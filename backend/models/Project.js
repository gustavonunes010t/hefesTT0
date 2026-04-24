import mongoose from "mongoose";

const urlPathPattern = /^(https?:\/\/.+|\/uploads\/.+)$/;

const createSlug = (title) => {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return slug || `projeto-${Date.now()}`;
};

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
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: ""
  },
  description: {
    type: String,
    trim: true,
    default: "",
    maxlength: [1000, "Descrição não pode exceder 1000 caracteres"]
  },
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: (value) => urlPathPattern.test(value),
        message: "URL de imagem inválida"
      }
    },
    publicId: String,
    alt: String
  }],
  videoUrl: {
    type: String,
    default: "",
    validate: {
      validator: (value) => !value || urlPathPattern.test(value),
      message: "URL de vídeo inválida"
    }
  },
  featured: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

projectSchema.index({ createdAt: -1 });
projectSchema.index({ featured: -1, createdAt: -1 });

projectSchema.pre("save", function(next) {
  if (this.isModified("title") && this.title) {
    this.slug = createSlug(this.title);
  }

  next();
});

projectSchema.pre("findOneAndUpdate", function(next) {
  const update = this.getUpdate();
  const title = update?.title || update?.$set?.title;

  if (title) {
    if (update.$set) {
      update.$set.slug = createSlug(title);
    } else {
      update.slug = createSlug(title);
    }
  }

  next();
});

projectSchema.methods.hasMedia = function() {
  return this.images?.length > 0 || !!this.videoUrl;
};

projectSchema.methods.getThumbnail = function() {
  return this.images?.[0]?.url || null;
};

export default mongoose.model("Project", projectSchema);
