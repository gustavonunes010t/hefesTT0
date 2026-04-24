import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { contactInfo } from "../config/contact";
import { formatImageUrl } from "../utils/formatImage";

export default function ProjectDetails() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProject = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects/${slug}`);

        if (active) {
          setProject(response.data.project);
          setActiveIndex(0);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.error || "Projeto não encontrado.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      active = false;
    };
  }, [slug]);

  const gallery = useMemo(() => project?.images || [], [project]);
  const activeImage = gallery[activeIndex];

  return (
    <>
      <Navbar />

      <main className="project-detail-page">
        <Link to="/" className="back-link">
          Voltar aos projetos
        </Link>

        {loading && <p className="feedback-text">Carregando projeto...</p>}
        {error && <p className="feedback-text error">{error}</p>}

        {!loading && !error && project && (
          <>
            <section className="project-detail-hero">
              <div>
                <span>{project.location || "Projeto Hefestto"}</span>
                <h1>{project.title}</h1>
                {project.featured && <p className="detail-pill">Projeto em destaque</p>}
              </div>

              <img
                src={formatImageUrl(activeImage?.url)}
                alt={activeImage?.alt || project.title}
              />
            </section>

            <section className="project-detail-content">
              <div className="project-narrative">
                <span>Conceito</span>
                <p>{project.description || "Este projeto ainda não recebeu uma descrição detalhada."}</p>
              </div>

              <aside className="project-facts">
                <div>
                  <span>Localização</span>
                  <strong>{project.location || "Não informada"}</strong>
                </div>
                <div>
                  <span>Publicado em</span>
                  <strong>{new Date(project.createdAt).toLocaleDateString("pt-BR")}</strong>
                </div>
                <div>
                  <span>Atualizado em</span>
                  <strong>{new Date(project.updatedAt).toLocaleDateString("pt-BR")}</strong>
                </div>
              </aside>
            </section>

            {project.videoUrl && (
              <section className="project-video">
                <video src={formatImageUrl(project.videoUrl)} controls />
              </section>
            )}

            {gallery.length > 1 && (
              <section className="detail-gallery">
                {gallery.map((image, index) => (
                  <button
                    type="button"
                    key={`${image.url}-${index}`}
                    className={index === activeIndex ? "active" : ""}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Ver imagem ${index + 1}`}
                  >
                    <img src={formatImageUrl(image.url)} alt={image.alt || project.title} />
                  </button>
                ))}
              </section>
            )}

            <section className="detail-contact">
              <div>
                <span>Gostou desse caminho?</span>
                <h2>Vamos conversar sobre o seu espaço.</h2>
              </div>
              <a className="primary-button" href={contactInfo.whatsappUrl} target="_blank" rel="noreferrer">
                Quero um projeto assim
              </a>
            </section>
          </>
        )}
      </main>
    </>
  );
}
