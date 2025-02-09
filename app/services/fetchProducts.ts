import { Project } from "../types/projectTypes";

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch("/data/mock_data.json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar los proyectos:", error);
    return [];
  }
};
