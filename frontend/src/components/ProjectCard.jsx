import { Link } from "react-router-dom";
import { formatImageUrl } from "../utils/formatImage";

export default function ProjectCard({ project }) {
  const coverImage = formatImageUrl(project.images?.[0]?.url);

  return (
    <Link className="project-card" to={`/projetos/${project.slug}`}>
      <img src={coverImage} alt={project.images?.[0]?.alt || project.title} loading="lazy" />

      <div className="project-overlay">
        <h3>{project.title}</h3>
        {project.location && <p>{project.location}</p>}
        <span>Ver detalhes</span>
      </div>
    </Link>
  );
}
