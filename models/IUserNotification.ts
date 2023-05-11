export interface IUserNotification {
  map(arg0: (obj: any) => JSX.Element): import("react").ReactNode;
  id: string;
  message: string;
  notificationType: string;
  subject: string;
  createdAt: string;
  readAt?: string | null;
}
