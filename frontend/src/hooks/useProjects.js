import { useState, useEffect } from "react";
import api from "../services/api";

// Hook personalizado para gerenciar projetos
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca projetos ao montar o componente
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects");
      // Ajusta conforme estrutura da resposta do backend
      setProjects(response.data.projects || response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar projetos: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Adiciona novo projeto
  const addProject = async (projectData) => {
    const response = await api.post("/projects", projectData);
    setProjects(prev => [response.data.project, ...prev]);
    return response.data;
  };

  // Remove projeto
  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, addProject, deleteProject };
}