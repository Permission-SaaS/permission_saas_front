import { NotificationProvider } from "@/shared";
import type { ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

export function Providers({ children }: Props) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
