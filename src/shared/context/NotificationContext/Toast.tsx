import { useEffect, type ReactNode } from "react";
import type { NotificationType, NotificationWithId } from "./types";

const DISMISS_TIME = 5000;

const variants: Record<
  NotificationType,
  {
    borderClassName: string;
    iconClassName: string;
    icon: ReactNode;
    role: "alert" | "status";
  }
> = {
  error: {
    borderClassName: "border-red-200",
    iconClassName: "text-red-600",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </>
    ),
    role: "alert",
  },
  info: {
    borderClassName: "border-blue-200",
    iconClassName: "text-blue-600",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </>
    ),
    role: "status",
  },
  success: {
    borderClassName: "border-green-200",
    iconClassName: "text-green-600",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    role: "status",
  },
  warn: {
    borderClassName: "border-amber-200",
    iconClassName: "text-amber-600",
    icon: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
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
      <svg
        className={`mt-0.5 size-5 shrink-0 ${variant.iconClassName}`}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant.icon}
      </svg>

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
        <svg
          className="size-4"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}
