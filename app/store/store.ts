import { create } from "zustand";
import { Project } from "../types/projectTypes";
import { fetchProjects } from "../services/fetchProducts"; // Importar el servicio

interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface ProjectStore {
  originalProjects: Project[];
  projects: Project[];
  currentPage: number;
  searchTerm: string;
  sortCriteria: "title" | "incidents" | "RFI" | "tasks";
  viewState: ViewState;
  isMapVisible: boolean;
  activeButton: "map" | "list" | "filter" | null;

  setProjects: (projects: Project[]) => void;
  setCurrentPage: (page: number) => void;
  setSearchTerm: (term: string) => void;
  setSortCriteria: (criteria: "title" | "incidents" | "RFI" | "tasks") => void;
  setViewState: (viewState: ViewState) => void;
  toggleMapVisibility: () => void;
  setActiveButton: (button: "map" | "list" | "filter" | null) => void;

  filteredProjects: () => Project[];
}

const extractNumberFromTitle = (title: string): number => {
  const match = title.match(/(\d+)/);
  return match ? parseInt(match[0], 10) : 0;
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  originalProjects: [],
  projects: [],
  currentPage: 1,
  searchTerm: "",
  sortCriteria: "title",
  viewState: { latitude: 40, longitude: -100, zoom: 3.5 },
  isMapVisible: false,
  activeButton: null,

  setProjects: (projects) => {
    set({
      originalProjects: projects,
      projects: projects,
    });
  },
  setCurrentPage: (page) => set({ currentPage: page }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortCriteria: (criteria) => set({ sortCriteria: criteria }),
  setViewState: (viewState) => set({ viewState }),
  toggleMapVisibility: () => set((state) => ({ isMapVisible: !state.isMapVisible })),
  setActiveButton: (button) => set({ activeButton: button }),

  filteredProjects: () => {
    const { originalProjects, searchTerm, sortCriteria, currentPage } = get();

    let filtered = originalProjects;
    if (searchTerm) {
      filtered = originalProjects.filter((project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortCriteria) {
      filtered = filtered.sort((a, b) => {
        switch (sortCriteria) {
          case "title":
            return extractNumberFromTitle(a.title) - extractNumberFromTitle(b.title);
          case "incidents":
            return b.incidents.filter(incident => incident.item === "incidents").length -  
                   a.incidents.filter(incident => incident.item === "incidents").length;
          case "RFI":
            return b.incidents.filter(incident => incident.item === "RFI").length - 
                   a.incidents.filter(incident => incident.item === "RFI").length;
          case "tasks":
            return b.incidents.filter(incident => incident.item === "task").length - 
                   a.incidents.filter(incident => incident.item === "task").length;
          default:
            return 0;
        }
      });
    }

    return filtered.slice((currentPage - 1) * 10, currentPage * 10);
  },
}));

export const loadProjects = async () => {
  const projects = await fetchProjects();
  useProjectStore.getState().setProjects(projects);
};
