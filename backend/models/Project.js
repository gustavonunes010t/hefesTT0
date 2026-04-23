import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  location: String
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);