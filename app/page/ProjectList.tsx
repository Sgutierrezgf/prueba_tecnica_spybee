"use client";
import { useEffect, useState, useCallback } from "react";
import "./projectList.css";
import SearchInput from "../components/SearchInput";
import FilterModal from "../components/FilterButton";
import { filterAndSortProjects } from "../utils/sortAndFilter";
import Pagination from "../components/Pagination";
import ProjectTable from "../components/ProjectTable";
import { Project } from "../types/projectTypes";
import { FaFilter } from "react-icons/fa";
import { Map, Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

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

  // Cambiar la vista del mapa cuando se haga clic en una fila
  const handleRowClick = (position: { lat: number; lng: number }) => {
    if (position && position.lat && position.lng) {
      setViewState({
        latitude: position.lat,
        longitude: position.lng,
        zoom: 12, // Ajusta el zoom según lo necesites
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

  return (
    <>
      <header>
        <img className="image-header" src="/spybee_logo_black.png" alt="spybee logo" />
      </header>
      <div className="project-container">
        <div className="search-container">
          <h2>Mis proyectos</h2>
          <div className="filters">
            <button className="filter-button" onClick={() => setIsModalOpen(true)}>
              <FaFilter />
            </button>
            <SearchInput searchTerm={searchTerm} onSearchChange={handleSearchChange} />
          </div>
        </div>

        <FilterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSortByTitle={handleSortByTitle}
          onSortByIncidents={handleSortByIncidents}
          onSortByRFI={handleSortByRFI}
          onSortByTasks={handleSortByTasks}
        />

        <div>
          <Map
            mapboxAccessToken="pk.eyJ1Ijoic2d1dGllcnJlemdmIiwiYSI6ImNtNnV5c2l2eDAybzkycXB5emNvNnJzanoifQ.VGsbYrOQLPyqLU5adbraPQ"
            {...viewState} // Pasar directamente el estado actual del mapa
            onMove={(e) => setViewState(e.viewState)} // Actualizar el estado cuando el mapa se mueva
            style={{ width: 600, height: 400 }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
          >
            {projects.map((project) => {
              const position = project.position;
              return (
                position && position.lat && position.lng && (
                  <Marker key={project._id} latitude={position.lat} longitude={position.lng}>
                    <div style={{ color: "red" }}>📍</div>
                  </Marker>
                )
              );
            })}
          </Map>
        </div>

        <ProjectTable projects={filteredProjects} onRowClick={handleRowClick} />

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </>
  );
};

export default ProjectList;