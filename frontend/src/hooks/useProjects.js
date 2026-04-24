import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const requestProjects = async () => {
  const response = await api.get("/projects");
  return response.data.projects || response.data || [];
};

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setProjects(await requestProjects());
      setError(null);
    } catch (err) {
      setError("Erro ao carregar projetos: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadProjects = async () => {
      try {
        const projectList = await requestProjects();

        if (active) {
          setProjects(projectList);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError("Erro ao carregar projetos: " + err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      active = false;
    };
  }, []);

  const addProject = async (projectData) => {
    const response = await api.post("/projects", projectData);
    setProjects((prev) => [response.data.project, ...prev]);
    return response.data;
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((project) => project._id !== id));
  };

  return { projects, loading, error, fetchProjects, addProject, deleteProject };
}
