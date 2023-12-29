import { IGenData } from "../models/IGenData";

export const role = [
  { id: "", name: "Please select the role" },
  { id: "admin", name: "Admin" },
  { id: "collaborator", name: "Collaborator" },
  { id: "viewer", name: "Viewer" },
];
export const roleData = [
  { id: "admin", name: "Admin" },
  { id: "collaborator", name: "Collaborator" },
  { id: "viewer", name: "Viewer" },
];
export const userNotificationTypes = [
  { id: "All", name: "All" },
  { id: "Project", name: "Project" },
  { id: "Issue", name: "Issue" },
  { id: "Task", name: "Task" },
  { id: "Snapshot", name: "Capture" },
  // { id: "Tag", name: "Tag" },
];
export const userNotificationData = [
  { id: 1, name: 'Unread' },
  { id: 2, name: 'All' },
];
