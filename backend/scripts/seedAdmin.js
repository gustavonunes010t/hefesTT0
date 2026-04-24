import mongoose from "mongoose";
import { MONGO_URI } from "../config.js";
import { ensureDefaultAdmin } from "../services/ensureDefaultAdmin.js";

try {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  await ensureDefaultAdmin();
  await mongoose.disconnect();
  process.exit(0);
} catch (error) {
  console.error("Erro ao criar admin padrao:", error.message);
  await mongoose.disconnect();
  process.exit(1);
}
