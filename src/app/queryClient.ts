import type { HttpError } from "@/shared";
import { QueryClient } from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: HttpError;
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
