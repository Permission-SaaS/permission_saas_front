import { NotificationProvider } from "@/shared";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "./queryClient";

interface Props {
  children?: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NotificationProvider>
  );
}
