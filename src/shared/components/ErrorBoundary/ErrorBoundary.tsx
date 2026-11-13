import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorBoundaryFallback } from "./ErrorBoundaryFallback";

interface Props {
  fallback?: ReactNode;
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Componente de classe porque, no React 19, error boundary ainda só existe como classe:
// o getDerivedStateFromError e o componentDidCatch não têm equivalente em hook.
export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Erro capturado pelo Boundary:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorBoundaryFallback onRetry={this.handleRetry} />
        )
      );
    }

    return this.props.children;
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };
}
