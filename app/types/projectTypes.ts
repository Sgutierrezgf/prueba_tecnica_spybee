export interface User {
  name: string;
  // lastName: string;
}
export interface Position {
  _id: string;
  lat: number;
  lng: number;
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
  position?:Position;
}
