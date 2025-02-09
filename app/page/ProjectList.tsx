"use client";
import { useEffect, useState, useCallback } from "react";
import "./projectList.css";
import SearchInput from "../components/filters-search/SearchInput";
import FilterModal from "../components/filters-search/FilterButton";
import { filterAndSortProjects } from "../utils/sortAndFilter";
import Pagination from "../components/pagination/Pagination";
import ProjectTable from "../components/table/ProjectTable";
import Map from "../components/Map/Map";
import { Project } from "../types/projectTypes";
import { FaFilter } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FaListUl } from "react-icons/fa";

const ITEMS_PER_PAGE = 10;

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState<"title" | "incidents" | "RFI" | "tasks">("title");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
  });
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [activeButton, setActiveButton] = useState<"map" | "list" | "filter" | null>(null);

  useEffect(() => {
    fetch("/data/mock_data.json")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error("Error al cargar JSON:", error));
  }, []);

  const filteredProjects = filterAndSortProjects(projects, searchTerm, sortCriteria, currentPage, ITEMS_PER_PAGE);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRowClick = (position: { lat: number; lng: number }) => {
    if (position && position.lat && position.lng) {
      setViewState({
        latitude: position.lat,
        longitude: position.lng,
        zoom: 12,
      });
    }
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

  const validProjects = projects.filter((project) => project.position && project.position.lat && project.position.lng);



  const toggleMapVisibility = () => {

    if (activeButton === "map") {
      setActiveButton(null);
      setIsMapVisible(false);
    } else {
      setActiveButton("map");
      setIsMapVisible(true);
    }
  };

  const handleListClick = () => {

    if (isMapVisible) {
      setIsMapVisible(false);
    }

    setActiveButton(activeButton === "list" ? null : "list");
  };


  const handleFilterClick = () => {
    
    if (activeButton === "filter") {
      setActiveButton(null); 
    } else {
      setActiveButton("filter"); 
    }
    setIsModalOpen(true); 
  };

  return (
    <>
      <header>
        <img className="image-header" src="/spybee_logo_black.png" alt="spybee logo" />
      </header>

      <main className="project-container">
        <section className="search-container">
          <h2>Mis proyectos</h2>
          <div className="filters">
            <button
              className={`filter-button ${activeButton === "filter" ? "active" : ""}`}
              onClick={handleFilterClick}
              aria-label="Filtrar proyectos"

            >
              <FaFilter />
            </button>
            <button
              className={`filter-button ${activeButton === "map" ? "active" : ""}`}
              onClick={toggleMapVisibility}
              aria-label="Mostrar mapa de proyectos"
            >
              <FiMapPin />
            </button>
            <button
              className={`filter-button ${activeButton === "list" ? "active" : ""}`}
              onClick={handleListClick}
              aria-label="Listar proyectos - esconder mapa"
            >
              <FaListUl />
            </button>
            <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>
        </section>

        <FilterModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);  
            setActiveButton(null); 
          }}
          onSortByTitle={handleSortByTitle}
          onSortByIncidents={handleSortByIncidents}
          onSortByRFI={handleSortByRFI}
          onSortByTasks={handleSortByTasks}
        />

        {isMapVisible && <section className="map-container">
          <Map viewState={viewState} setViewState={setViewState} projects={validProjects} />
        </section>}

        <section className="project-table-container">
          <ProjectTable projects={filteredProjects} onRowClick={handleRowClick} />
        </section>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </>
  );
};

export default ProjectList;
