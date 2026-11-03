import { useDebounce, type HttpError } from "@/shared";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { listProjects } from "../api/projectApi";
import { projectKeys } from "../api/projectKeys";
import { ProjectList } from "../components/ProjectList";

type Status = "all" | "active" | "inactive";

const STATUS_TO_PARAM: Record<Status, boolean | undefined> = {
  all: undefined,
  active: true,
  inactive: false,
};

const describeError = (error: HttpError) => {
  if (error.kind === "network" || error.kind === "timeout") {
    return "Não foi possível falar com o servidor. Tente de novo em instantes.";
  }

  return `O servidor respondeu com o erro ${error.status}.`;
};

const handleSubmitForm = (event: React.SubmitEvent<HTMLFormElement>) => {
  event.preventDefault();
};

export function ProjectListPage() {
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<Status>("all");

  const debouncedProjectNameFilter = useDebounce(projectNameFilter);

  const filters = {
    name: debouncedProjectNameFilter,
    onlyActive: STATUS_TO_PARAM[projectStatusFilter],
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: ({ signal }) => listProjects(filters, signal),
  });

  const handleProjectNameFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setProjectNameFilter(event.target.value);
  };

  const handleStatusFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setProjectStatusFilter(event.target.value as Status);
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xl font-semibold text-gray-900">
          Lista de Projetos
        </div>
        <div>
          <Link
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            to="/projects/new"
          >
            Novo Projeto
          </Link>
        </div>
      </div>
      <form
        className="flex flex-col items-start gap-3"
        onSubmit={handleSubmitForm}
      >
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="search-name"
          >
            Buscar por nome:
          </label>
          <input
            className="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            id="search-name"
            type="text"
            name="name"
            placeholder="Buscar projetos..."
            value={projectNameFilter}
            onChange={handleProjectNameFilterChange}
            maxLength={120}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="status">
            Status:
          </label>
          <select
            value={projectStatusFilter}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            name="status"
            id="status"
            onChange={handleStatusFilterChange}
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
      </form>
      {isPending && <div className="text-sm text-gray-500">Carregando...</div>}

      {isError && (
        <div className="text-sm text-red-600">Erro: {describeError(error)}</div>
      )}

      {data && <ProjectList projects={data} />}
    </div>
  );
}
