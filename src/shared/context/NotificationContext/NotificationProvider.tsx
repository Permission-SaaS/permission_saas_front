import { NotificationContext } from "./NotificationContext";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Toast } from "./Toast";
import type {
  Notification,
  NotificationContextValue,
  NotificationWithId,
} from "./types";

interface Props {
  children?: ReactNode;
}

export function NotificationProvider({ children }: Props) {
  const [notifications, setNotifications] = useState<NotificationWithId[]>([]);

  const notify = useCallback(
    (notification: Notification | Notification[]): void => {
      const newNotifications = Array.isArray(notification)
        ? notification.map((notification) => ({
            ...notification,
            id: crypto.randomUUID(),
          }))
        : [{ ...notification, id: crypto.randomUUID() }];

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...newNotifications,
      ]);
    },
    [],
  );

  const dismiss = useCallback((id: string): void => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id),
    );
  }, []);

  const contextValue = useMemo(
    (): NotificationContextValue => ({ notify, dismiss }),
    [notify, dismiss],
  );

  return (
    <NotificationContext value={contextValue}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 p-4 sm:left-auto sm:w-104">
        {notifications.map((notification) => {
          return (
            <Toast
              key={notification.id}
              notification={notification}
              onDismiss={dismiss}
            />
          );
        })}
      </div>
    </NotificationContext>
  );
}
