export const countItemType = (
  incidents: { item: "incidents" | "RFI" | "task" }[],
  type: "incidents" | "RFI" | "task"
) => {
  return incidents.filter((incident) => incident.item === type).length;
};

export const filterAndSortProjects = (
  projects: {
    _id: string;
    title: string;
    lastVisit: string;
    projectPlanData: { plan: string };
    status: string;
    users: { name: string }[];
    incidents: { item: "incidents" | "RFI" | "task" }[];
  }[],
  searchTerm: string,
  sortCriteria: "title" | "incidents" | "RFI" | "tasks",
  currentPage: number,
  itemsPerPage: number
) => {
  return projects
    .filter((project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortCriteria === "title") {
        return a.title.localeCompare(b.title); 
      }
      if (sortCriteria === "incidents") {
        return (
          countItemType(b.incidents, "incidents") -
          countItemType(a.incidents, "incidents")
        ); 
      }
      if (sortCriteria === "RFI") {
        return (
          countItemType(b.incidents, "RFI") - countItemType(a.incidents, "RFI")
        ); 
      }
      if (sortCriteria === "tasks") {
        return (
          countItemType(b.incidents, "task") -
          countItemType(a.incidents, "task")
        ); 
      }
      return 0;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
};
