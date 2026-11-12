import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { LoginForm } from "../components/LoginForm";
import { selectIsLoggedIn } from "../store/authSlice";

const DEFAULT_PAGE = "/projects";

export function LoginPage() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const requestedPage: unknown = useLocation().state;

  if (isLoggedIn) {
    const redirectTo =
      typeof requestedPage === "string" ? requestedPage : DEFAULT_PAGE;

    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-xl font-semibold text-gray-900">
          Permission SaaS
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
