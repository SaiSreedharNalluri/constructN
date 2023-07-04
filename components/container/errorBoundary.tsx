import { ErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";
import ErrorFallback from "./errorFallback"; // You need to create this component

type ErrorBoundaryProps = {
  children: ReactNode;
};

function MyErrorBoundary({ children }: ErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    // You can log the error to an error reporting service here
    console.error(error, errorInfo);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

export default MyErrorBoundary;