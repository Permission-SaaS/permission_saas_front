import { NotificationProvider } from "@/shared";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { queryClient } from "./queryClient";
import { store } from "./store";

interface Props {
  children?: ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ReduxProvider store={store}>
      <NotificationProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NotificationProvider>
    </ReduxProvider>
  );
}
