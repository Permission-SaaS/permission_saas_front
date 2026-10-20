import { BrowserRouter } from "react-router";
import { AppRoutes } from "./router";
import { ErrorBoundary } from "@/shared";

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
