import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export default function Admin() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ title: "", location: "", description: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  // Configuração do Drag & Drop
  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert("Adicione pelo menos uma imagem!");

    setLoading(true);
    setStatus({ type: "", msg: "" });

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("description", formData.description);
    
    // Envia todas as imagens selecionadas
    files.forEach((file) => {
      data.append("media", file);
    });

    try {
      await axios.post("http://localhost:5000/api/projects", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus({ type: "success", msg: "✅ Projeto publicado com sucesso!" });
      setFiles([]);
      setFormData({ title: "", location: "", description: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "❌ Erro ao publicar." });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "100px 80px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "30px" }}>Painel do Arquiteto</h2>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <input name="title" placeholder="Título do Projeto" value={formData.title} onChange={handleChange} required style={inputStyle} />
        <input name="location" placeholder="Localização" value={formData.location} onChange={handleChange} style={inputStyle} />
        <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} style={inputStyle} />

        {/* Área de Upload */}
        <div {...getRootProps()} style={{ ...dropzoneStyle, borderColor: isDragActive ? "#2C5F2D" : "#ccc" }}>
          <input {...getInputProps()} />
          <p>{isDragActive ? "Solte as imagens aqui..." : "Arraste imagens ou clique para selecionar"}</p>
        </div>

        {/* Preview das imagens */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {files.map((f, i) => (
            <img key={i} src={URL.createObjectURL(f)} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
          ))}
        </div>

        <button type="submit" disabled={loading} style={btnStyle}>
          {loading ? "Enviando..." : "Publicar Projeto"}
        </button>

        {status.msg && <p style={{ color: status.type === "success" ? "green" : "red" }}>{status.msg}</p>}
      </form>
    </div>
  );
}

// Estilos simples inline
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" };
const dropzoneStyle = { border: "2px dashed #ccc", padding: "40px", textAlign: "center", cursor: "pointer", borderRadius: "12px", transition: "0.3s" };
const btnStyle = { padding: "15px", background: "#2C5F2D", color: "#fff", border: "none", borderRadius: "8px", fontSize: "1rem", cursor: "pointer" };