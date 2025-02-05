import { countItemType } from "../utils/sortAndFilter"; // Importamos la función que necesitamos para contar los incidentes

// Importamos las interfaces desde el archivo de tipos
import { Project } from "../types/projectTypes"; // Asegúrate de que la ruta sea correcta

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
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
        {projects.map((project) => (
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
  );
};

export default ProjectTable;
