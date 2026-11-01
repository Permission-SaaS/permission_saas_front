import type { HttpError } from "@/shared";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { listProjects } from "../api/projectApi";
import { projectKeys } from "../api/projectKeys";

const describeError = (error: HttpError) => {
  if (error.kind === "network" || error.kind === "timeout") {
    return "Não foi possível falar com o servidor. Tente de novo em instantes.";
  }

  return `O servidor respondeu com o erro ${error.status}.`;
};

export function ProjectListPage() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: projectKeys.list(),
    queryFn: ({ signal }) => listProjects({}, signal),
  });

  if (isPending) {
    return <div>Carregando...</div>;
  }

  if (isError && error.kind !== "abort") {
    return (
      <div>
        <div>Erro ao carregar a lista de projetos</div>
        <div>{describeError(error)}</div>
      </div>
    );
  }

  return (
    <div>
      <div>Título: Lista de Projetos</div>
      <div>
        <Link to="/projects/new">Novo Projeto</Link>
      </div>

      {data && data.length > 0 ? (
        data.map((project) => {
          return (
            <div className="project-card" key={project.id}>
              <div>Nome: {project.name}</div>
              <div>Descrição: {project.description}</div>
              <div>Qtd. Máx. de Cargos: {project.maxRoles}</div>
              <div>Ativo: {project.active ? "Sim" : "Não"}</div>
              <div>Criado em: {project.createdAt}</div>
              <div>Atualizado em: {project.updatedAt}</div>
              <div>
                <Link to={`/projects/${project.id}`}>Ver Detalhes</Link>
              </div>
            </div>
          );
        })
      ) : (
        <div>Nenhum projeto encontrado.</div>
      )}
    </div>
  );
}
