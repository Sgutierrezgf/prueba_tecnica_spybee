import React from "react";
import { Map, Marker } from "react-map-gl/mapbox";
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
    return (
      <div className="map-container">
        <Map
          mapboxAccessToken="your-mapbox-access-token"
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          style={{ width: '100%', height: '100%', borderRadius: '15px 15px 0 0' }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        >
          {projects.map((project) => {
          if (project.position) {  // Verificamos que `position` esté definido
            const { lat, lng } = project.position; // Desestructuramos `position`
            return (
              <Marker key={project._id} latitude={lat} longitude={lng}>
                <div style={{ color: 'red' }}>📍</div>
              </Marker>
            );
          }
          return null;
        })}
        </Map>
      </div>
    );
  };
export default MapComponent;
