import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import ArchitectBio from "../components/ArchitectBio";
import ProfileHighlights from "../components/ProfileHighlights";
import useProjects from "../hooks/useProjects";

export default function Home() {
  const { projects, loading, error } = useProjects();

  return (
    <>
      <Navbar />
      <Hero />
      <ProfileHighlights />

      <main className="projects-section" id="projetos">
        <div className="section-heading">
          <span>Portfólio</span>
          <h2>Projetos</h2>
        </div>

        {loading && <p className="feedback-text">Carregando projetos...</p>}
        {error && <p className="feedback-text error">{error}</p>}

        {!loading && !error && projects.length === 0 && (
          <p className="feedback-text">Nenhum projeto publicado ainda.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </main>

      <ArchitectBio />
    </>
  );
}
