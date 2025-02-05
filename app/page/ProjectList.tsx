"use client";
import { useEffect, useState, useCallback } from "react";
import "./projectList.css";
import SearchInput from "../components/SearchInput";
import FilterModal from "../components/FilterButton";
import { filterAndSortProjects } from "../utils/sortAndFilter";
import Pagination from "../components/Pagination";
import ProjectTable from "../components/ProjectTable";
import { Project } from "../types/projectTypes";

const ITEMS_PER_PAGE = 10;

const ProjectList = () => {
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

  const filteredProjects = filterAndSortProjects(
    projects,
    searchTerm,
    sortCriteria,
    currentPage,
    ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortByTitle = useCallback(() => {
    setSortCriteria("title");
    setIsModalOpen(false);
  }, []);

  const handleSortByIncidents = useCallback(() => {
    setSortCriteria("incidents");
    setIsModalOpen(false);
  }, []);

  const handleSortByRFI = useCallback(() => {
    setSortCriteria("RFI");
    setIsModalOpen(false);
  }, []);

  const handleSortByTasks = useCallback(() => {
    setSortCriteria("tasks");
    setIsModalOpen(false);
  }, []);

  return (
    <div className="project-container">
      <h2>Mis proyectos</h2>
      <div className="search-container">
        <button className="filter-button" onClick={() => setIsModalOpen(true)}>
          filter
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

      <ProjectTable projects={filteredProjects} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ProjectList;
