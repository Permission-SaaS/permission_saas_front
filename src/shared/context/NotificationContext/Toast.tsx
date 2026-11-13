import {
  CheckCircle,
  Info,
  Warning,
  X,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import type { NotificationType, NotificationWithId } from "./types";

const DISMISS_TIME = 5000;

const variants: Record<
  NotificationType,
  {
    borderClassName: string;
    iconClassName: string;
    Icon: Icon;
    role: "alert" | "status";
  }
> = {
  error: {
    borderClassName: "border-red-200",
    iconClassName: "text-red-600",
    Icon: XCircle,
    role: "alert",
  },
  info: {
    borderClassName: "border-blue-200",
    iconClassName: "text-blue-600",
    Icon: Info,
    role: "status",
  },
  success: {
    borderClassName: "border-green-200",
    iconClassName: "text-green-600",
    Icon: CheckCircle,
    role: "status",
  },
  warning: {
    borderClassName: "border-amber-200",
    iconClassName: "text-amber-600",
    Icon: Warning,
    role: "alert",
  },
};

interface Props {
  notification: NotificationWithId;
  onDismiss: (id: string) => void;
}

export function Toast({ notification, onDismiss }: Props) {
  const variant = variants[notification.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, DISMISS_TIME);

    return () => clearTimeout(timer);
  }, [onDismiss, notification.id]);

  return (
    <div
      className={`pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border bg-white p-4 pr-10 shadow-lg transition duration-200 ease-out motion-reduce:transition-none starting:translate-y-2 starting:opacity-0 ${variant.borderClassName}`}
      role={variant.role}
    >
      <variant.Icon
        className={`mt-0.5 size-5 shrink-0 ${variant.iconClassName}`}
        weight="bold"
        aria-hidden="true"
      />

      <div className="flex-1 space-y-1">
        {notification.title && (
          <h3 className="text-sm font-semibold text-gray-900">
            {notification.title}
          </h3>
        )}
        <p className="text-sm text-gray-600">{notification.description}</p>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(notification.id)}
        className="absolute top-2 right-2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:outline-none"
        aria-label="Fechar aviso"
      >
        <X className="size-4" weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}
