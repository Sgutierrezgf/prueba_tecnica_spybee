export interface User {
  name: string;
  // lastName: string; // Si lo quieres opcional, lo puedes dejar aquí o agregarlo de nuevo si lo necesitas
}

export interface Incident {
  item: "incidents" | "RFI" | "task";
}

export interface Project {
  _id: string;
  title: string;
  lastVisit: string;
  projectPlanData: { plan: string };
  status: string;
  users: User[];
  incidents: Incident[];
}
