"use client";
import { useEffect, useState } from "react";
import "./projectList.css";
import SearchInput from "../components/SearchInput";
import FilterModal from "../components/FilterButton";

interface User {
  name: string;
  lastName: string;
}

interface Incident {
  item: "incidents" | "RFI" | "task";
}

interface Project {
  _id: string;
  title: string;
  lastVisit: string;
  projectPlanData: { plan: string };
  status: string;
  users: User[];
  incidents: Incident[];
}

const ITEMS_PER_PAGE = 10;

const ProjectList = () => {
  // Definir countItemType antes de su uso
  const countItemType = (
    incidents: Incident[],
    type: "incidents" | "RFI" | "task"
  ) => {
    return incidents.filter((incident) => incident.item === type).length;
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState<
    "title" | "incidents" | "RFI" | "tasks"
  >("title");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/data/mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error("Error al cargar JSON:", error));
  }, []);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const filteredProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) // Filtrar por nombre
    .sort((a, b) => {
      if (sortCriteria === "title") {
        return a.title.localeCompare(b.title); // Ordenar alfabéticamente
      }
      if (sortCriteria === "incidents") {
        return (
          countItemType(b.incidents, "incidents") -
          countItemType(a.incidents, "incidents")
        ); // Ordenar por cantidad de incidencias
      }
      if (sortCriteria === "RFI") {
        return (
          countItemType(b.incidents, "RFI") - countItemType(a.incidents, "RFI")
        ); // Ordenar por RFI
      }
      if (sortCriteria === "tasks") {
        return (
          countItemType(b.incidents, "task") -
          countItemType(a.incidents, "task")
        ); // Ordenar por tareas
      }
      return 0;
    })
    .slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByTitle = () => {
    setSortCriteria("title");
    setIsModalOpen(false);
  };

  const handleSortByIncidents = () => {
    setSortCriteria("incidents");
    setIsModalOpen(false);
  };

  const handleSortByRFI = () => {
    setSortCriteria("RFI");
    setIsModalOpen(false);
  };

  const handleSortByTasks = () => {
    setSortCriteria("tasks");
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="project-container">
      <h2>Mis proyectos</h2>
      <div className="search-container">
        <button className="filter-button" onClick={() => setIsModalOpen(true)}>
          Filtrar
        </button>
        <SearchInput
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />
      </div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSortByTitle={handleSortByTitle}
        onSortByIncidents={handleSortByIncidents}
        onSortByRFI={handleSortByRFI}
        onSortByTasks={handleSortByTasks}
      />

      <table>
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Plan</th>
            <th>Estado</th>
            <th>Equipo</th>
            <th className="items-column">Items por vencer</th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => (
            <tr key={project._id}>
              <td className="project-info">
                <strong>{project.title}</strong>
                <p className="last-visit">{formatDate(project.lastVisit)}</p>
              </td>

              <td>
                <span data-plan={project.projectPlanData.plan}>
                  {project.projectPlanData.plan}
                </span>
              </td>
              <td>
                <span data-status={project.status}>{project.status}</span>
              </td>
              <td
                title={
                  project.users.length > 3
                    ? project.users.map((user) => user.name).join(", ")
                    : ""
                }
              >
                {project.users
                  .slice(0, 3)
                  .map((user) => user.name)
                  .join(", ") + (project.users.length > 3 ? "..." : "")}
              </td>
              <td>
                <div className="item-container">
                  <div className="item">
                    <span>{countItemType(project.incidents, "incidents")}</span>
                    <p>Incidentes</p>
                  </div>
                  <div className="item">
                    <span>{countItemType(project.incidents, "RFI")}</span>
                    <p>RFI</p>
                  </div>
                  <div className="item">
                    <span>{countItemType(project.incidents, "task")}</span>
                    <p>Tareas</p>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
