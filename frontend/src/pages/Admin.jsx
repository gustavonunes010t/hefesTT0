import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import useProjects from "../hooks/useProjects";
import api from "../services/api";
import { formatImageUrl } from "../utils/formatImage";

const initialProjectData = {
  title: "",
  location: "",
  description: "",
  featured: false
};

const initialAuthData = {
  email: "",
  password: ""
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [authData, setAuthData] = useState(initialAuthData);
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideoUrl, setExistingVideoUrl] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(initialProjectData);
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { projects, loading: projectsLoading, error: projectsError, fetchProjects, deleteProject } = useProjects();

  const previews = useMemo(() => files.map((file) => ({
    id: `${file.name}-${file.lastModified}-${file.size}`,
    file,
    url: URL.createObjectURL(file)
  })), [files]);

  useEffect(() => () => {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const handleAuthChange = (event) => {
    setAuthData({ ...authData, [event.target.name]: event.target.value });
  };

  const handleProjectChange = (event) => {
    const { name, type, checked, value } = event.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const addFiles = (fileList) => {
    const selectedFiles = Array.from(fileList || []).filter((file) => (
      file.type.startsWith("image/") || ["video/mp4", "video/webm"].includes(file.type)
    ));

    if (selectedFiles.length === 0) {
      setStatus({ type: "error", msg: "Selecione imagens ou vídeos em formatos aceitos." });
      return;
    }

    setFiles((currentFiles) => [...currentFiles, ...selectedFiles].slice(0, 10));
    setStatus({ type: "", msg: "" });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeFile = (fileId) => {
    setFiles((currentFiles) => currentFiles.filter((file) => (
      `${file.name}-${file.lastModified}-${file.size}` !== fileId
    )));
  };

  const resetProjectForm = () => {
    setEditingProject(null);
    setExistingImages([]);
    setExistingVideoUrl("");
    setFiles([]);
    setFormData(initialProjectData);
  };

  const startEditing = (project) => {
    setEditingProject(project);
    setExistingImages(project.images || []);
    setExistingVideoUrl(project.videoUrl || "");
    setFiles([]);
    setFormData({
      title: project.title || "",
      location: project.location || "",
      description: project.description || "",
      featured: Boolean(project.featured)
    });
    setStatus({ type: "", msg: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: "", msg: "" });

    try {
      const response = await api.post("/auth/login", {
        email: authData.email,
        password: authData.password
      });

      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setAuthData(initialAuthData);
      setStatus({ type: "success", msg: "Acesso liberado." });
    } catch (error) {
      setStatus({
        type: "error",
        msg: error.response?.data?.error || "Não foi possível autenticar."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    resetProjectForm();
    setStatus({ type: "", msg: "" });
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(`Excluir o projeto "${project.title}"?`);

    if (!confirmed) return;

    try {
      await deleteProject(project._id);
      if (editingProject?._id === project._id) {
        resetProjectForm();
      }
      setStatus({ type: "success", msg: "Projeto excluído." });
    } catch (error) {
      setStatus({
        type: "error",
        msg: error.response?.data?.error || "Erro ao excluir projeto."
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      setStatus({ type: "error", msg: "Entre no painel antes de publicar." });
      return;
    }

    if (!editingProject && files.length === 0) {
      setStatus({ type: "error", msg: "Adicione pelo menos uma imagem ou vídeo." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", msg: "" });

    const data = new FormData();
    data.append("title", formData.title);
    data.append("location", formData.location);
    data.append("description", formData.description);
    data.append("featured", String(formData.featured));
    data.append("existingImages", JSON.stringify(existingImages));
    data.append("videoUrl", existingVideoUrl);
    files.forEach((file) => data.append("media", file));

    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data);
        setStatus({ type: "success", msg: "Projeto atualizado com sucesso." });
      } else {
        await api.post("/projects", data);
        setStatus({ type: "success", msg: "Projeto publicado com sucesso." });
      }

      resetProjectForm();
      await fetchProjects();
    } catch (error) {
      if (error.response?.status === 401) {
        setToken("");
      }

      setStatus({
        type: "error",
        msg: error.response?.data?.error || "Erro ao salvar projeto."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-header">
          <div>
            <span>Painel</span>
            <h2>{editingProject ? "Editar projeto" : "Gerenciar projetos"}</h2>
          </div>

          {token && (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Sair
            </button>
          )}
        </div>

        {!token && (
          <form className="admin-form" onSubmit={handleAuthSubmit}>
            <div className="login-intro">
              <span>Acesso restrito</span>
              <h3>Entrar no painel</h3>
              <p>Use o usuário administrador padrão configurado no servidor.</p>
            </div>

            <label>
              Email
              <input name="email" type="email" value={authData.email} onChange={handleAuthChange} required />
            </label>

            <label>
              Senha
              <input name="password" type="password" value={authData.password} onChange={handleAuthChange} required minLength={6} />
            </label>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        )}

        {token && (
          <div className="admin-workspace">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="form-title-row">
                <h3>{editingProject ? "Atualizar publicação" : "Novo projeto"}</h3>
                {editingProject && (
                  <button type="button" className="ghost-button compact" onClick={resetProjectForm}>
                    Cancelar edição
                  </button>
                )}
              </div>

              <label>
                Título do projeto
                <input name="title" value={formData.title} onChange={handleProjectChange} required />
              </label>

              <label>
                Localização
                <input name="location" value={formData.location} onChange={handleProjectChange} />
              </label>

              <label>
                Descrição
                <textarea name="description" value={formData.description} onChange={handleProjectChange} rows={5} />
              </label>

              <label className="checkbox-row">
                <input name="featured" type="checkbox" checked={formData.featured} onChange={handleProjectChange} />
                Destacar projeto
              </label>

              {editingProject && existingImages.length > 0 && (
                <div className="existing-media">
                  <span>Imagens publicadas</span>
                  <div className="media-preview-grid">
                    {existingImages.map((image) => (
                      <div className="media-preview" key={image.url}>
                        <img src={formatImageUrl(image.url)} alt={image.alt || formData.title} />
                        <button
                          type="button"
                          onClick={() => setExistingImages((current) => current.filter((item) => item.url !== image.url))}
                          aria-label="Remover imagem publicada"
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingProject && existingVideoUrl && (
                <div className="existing-media">
                  <span>Vídeo publicado</span>
                  <div className="published-video-row">
                    <video src={formatImageUrl(existingVideoUrl)} controls />
                    <button type="button" className="ghost-button compact" onClick={() => setExistingVideoUrl("")}>
                      Remover vídeo
                    </button>
                  </div>
                </div>
              )}

              <div
                className={`upload-zone ${dragging ? "active" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  id="media"
                  type="file"
                  accept="image/*,video/mp4,video/webm"
                  multiple
                  onChange={(event) => addFiles(event.target.files)}
                />
                <label htmlFor="media">
                  {editingProject ? "Adicionar novas mídias" : "Arraste arquivos ou clique para selecionar"}
                </label>
                <span>{files.length}/10 novos arquivos selecionados</span>
              </div>

              {previews.length > 0 && (
                <div className="media-preview-grid">
                  {previews.map((preview) => (
                    <div className="media-preview" key={preview.id}>
                      {preview.file.type.startsWith("video/") ? (
                        <video src={preview.url} muted controls />
                      ) : (
                        <img src={preview.url} alt={preview.file.name} />
                      )}
                      <button type="button" onClick={() => removeFile(preview.id)} aria-label="Remover arquivo">
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? "Salvando..." : editingProject ? "Salvar alterações" : "Publicar projeto"}
              </button>
            </form>

            <section className="project-manager">
              <div className="manager-heading">
                <span>Publicados</span>
                <button type="button" className="ghost-button compact" onClick={fetchProjects}>
                  Atualizar lista
                </button>
              </div>

              {projectsLoading && <p className="feedback-text">Carregando projetos...</p>}
              {projectsError && <p className="feedback-text error">{projectsError}</p>}

              {!projectsLoading && projects.length === 0 && (
                <p className="feedback-text">Nenhum projeto publicado ainda.</p>
              )}

              {!projectsLoading && projects.length > 0 && (
                <div className="manager-list">
                  {projects.map((project) => (
                    <article className="manager-item" key={project._id}>
                      <img src={formatImageUrl(project.images?.[0]?.url)} alt={project.title} />
                      <div>
                        <strong>{project.title}</strong>
                        <span>{project.location || "Sem localização"}</span>
                      </div>
                      <div className="manager-actions">
                        <button type="button" className="secondary-button" onClick={() => startEditing(project)}>
                          Editar
                        </button>
                        <button type="button" className="danger-button" onClick={() => handleDelete(project)}>
                          Excluir
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {status.msg && <p className={`status-message ${status.type}`}>{status.msg}</p>}
      </main>
    </>
  );
}
