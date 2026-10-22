export type NotificationType = "error" | "info" | "success" | "warn";

export interface Notification {
  title?: string;
  description: string;
  type: NotificationType;
}

export interface NotificationWithId extends Notification {
  id: string;
}

export interface NotificationContextValue {
  notify: (notifications: Notification | Notification[]) => void;
  dismiss: (id: string) => void;
}
