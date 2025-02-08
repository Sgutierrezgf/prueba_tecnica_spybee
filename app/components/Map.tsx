import React, {useState} from "react";
import { Map, Marker, Popup  } from "react-map-gl/mapbox";
import { Project } from "../types/projectTypes";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapComponentProps {
  viewState: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  setViewState: React.Dispatch<React.SetStateAction<any>>;
  projects: Project[];
}

const MapComponent: React.FC<MapComponentProps> = ({ viewState, setViewState, projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="map-container">
      <Map
        mapboxAccessToken="your-mapbox-access-token"
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        style={{ width: "100%", height: "100%", borderRadius: "15px 15px 0 0" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        {projects.map((project) => {
          if (project.position) {
            const { lat, lng } = project.position;
            return (
              <div key={project._id}>
                <Marker latitude={lat} longitude={lng}>
                  <div
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => setSelectedProject(project)}
                  >
                    📍
                  </div>
                </Marker>

                {selectedProject && selectedProject._id === project._id && (
                  <Popup
                    latitude={lat}
                    longitude={lng}
                    onClose={() => setSelectedProject(null)}
                  >
                    <div>{project.title}</div>
                  </Popup>
                )}
              </div>
            );
          }
          return null;
        })}
      </Map>
    </div>
  );
};

export default MapComponent;