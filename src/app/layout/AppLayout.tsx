import { loggedOut, selectCurrentUser } from "@/modules/identity";
import { Button, ErrorBoundary } from "@/shared";
import { SignOut } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useLocation } from "react-router";

const routes = [
  {
    key: "home",
    path: "/",
    name: "Início",
  },
  {
    key: "projects",
    path: "/projects",
    name: "Projetos",
  },
  {
    key: "new-project",
    path: "/projects/new",
    name: "Novo Projeto",
  },
];

export function AppLayout() {
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(loggedOut());
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-gray-900">
            Permission SaaS
          </h1>
          <nav className="flex gap-4 text-sm">
            {routes.map((route) => (
              <NavLink
                key={route.key}
                to={route.path}
                className={({ isActive }) => (isActive ? "font-bold" : "")}
              >
                {route.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-700">
          <span>Olá, {currentUser?.name}</span>
          <Button onClick={handleLogout}>
            <SignOut size={16} aria-hidden="true" />
            Sair
          </Button>
        </div>
      </header>

      <main>
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
}
