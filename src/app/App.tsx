import { ErrorBoundary } from "@/shared";
import { BrowserRouter } from "react-router";
import { Providers } from "./providers";
import { AppRoutes } from "./router";

export function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  );
}
