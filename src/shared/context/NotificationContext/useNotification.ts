import { useContext } from "react";
import { NotificationContext } from "./NotificationContext";

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === null) {
    throw new Error(
      "useNotification precisa ser usado dentro de um NotificationProvider",
    );
  }

  return context;
};
