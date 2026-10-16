import { NavLink, Outlet } from "react-router";

export function AppLayout() {
  return (
    <>
      <header>
        <h1>Bem vindo(a) ao App</h1>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Início
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
            end
          >
            Projetos
          </NavLink>

          <NavLink
            to="/projects/new"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Novo Projeto
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Registre-se
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}
