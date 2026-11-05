import { ErrorBoundary } from "@/shared";
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

  return (
    <>
      <header>
        <h1>Bem vindo(a) ao App</h1>
        <nav>
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
      </header>

      <main>
        <ErrorBoundary key={location.pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  );
}
