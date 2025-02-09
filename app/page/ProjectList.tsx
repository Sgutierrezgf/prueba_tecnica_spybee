"use client";
import { useEffect } from "react";
import { loadProjects, useProjectStore } from "../store/store";
import "./projectList.css";
import SearchInput from "../components/filters-search/SearchInput";
import FilterModal from "../components/filters-search/FilterButton";
import Pagination from "../components/pagination/Pagination";
import ProjectTable from "../components/table/ProjectTable";
import Map from "../components/Map/Map";
import { FaFilter } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FaListUl } from "react-icons/fa";
import Image from "next/image";

const ProjectList = () => {
  const {
    projects,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    setSortCriteria,
    setViewState,
    isMapVisible,
    toggleMapVisibility,
    activeButton,
    setActiveButton,
    filteredProjects, 
  } = useProjectStore();

  useEffect(() => {
    loadProjects(); 
  }, []);

  const projectsToDisplay = filteredProjects(); 

  const totalPages = Math.ceil(projects.length / 10);

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

  const handleSort = (criteria: "title" | "incidents" | "RFI" | "tasks") => {
    setSortCriteria(criteria);
  };

  const handleFilterClick = () => {
    setActiveButton(activeButton === "filter" ? null : "filter");
  };

  const handleMapButtonClick = () => {
    toggleMapVisibility();
    setActiveButton(isMapVisible ? null : "map");
  };

  const handleListButtonClick = () => {
    if (isMapVisible) {
      toggleMapVisibility();
    }
    setActiveButton(activeButton === "list" ? null : "list");
  };

  return (
    <>
      <header>
        <Image loading="lazy" className="image-header" src="/spybee_logo_black.png" alt="spybee logo" width={100} height={50} />
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
              className={`filter-button ${isMapVisible ? "active" : ""}`}
              onClick={handleMapButtonClick}
              aria-label="Mostrar mapa de proyectos"
            >
              <FiMapPin />
            </button>
            <button
              className={`filter-button ${activeButton === "list" ? "active" : ""}`}
              onClick={handleListButtonClick}
              aria-label="Listar proyectos - esconder mapa"
            >
              <FaListUl />
            </button>
            <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>
        </section>

        <FilterModal
          isOpen={activeButton === "filter"}
          onClose={() => setActiveButton(null)}
          onSort={handleSort}
        />

        {isMapVisible && (
          <section className="map-container">
            <Map projects={projectsToDisplay} />
          </section>
        )}

        <section className="project-table-container">
          <ProjectTable projects={projectsToDisplay} onRowClick={handleRowClick} />
        </section>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </main>
    </>
  );
};

export default ProjectList;
