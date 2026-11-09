import { describeError, HttpStatus, useNotification } from "@/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getProject, updateProject } from "../api/projectApi";
import { projectKeys } from "../api/projectKeys";
import type { Project, ProjectValues, UpdateProjectRequest } from "../types";
import { ProjectForm } from "./ProjectForm";
import { ProjectNotFound } from "./ProjectNotFound";

interface Props {
  id: string;
}

const toProjectValues = (project: Project): ProjectValues => {
  return {
    name: project.name,
    description: project.description ?? "",
    maxRoles: project.maxRoles.toString(),
  };
};

const toUpdateProjectRequest = (
  project: ProjectValues,
): UpdateProjectRequest => {
  const description = project.description.trim();
  return {
    name: project.name.trim(),
    description: description === "" ? undefined : description,
    maxRoles: Number(project.maxRoles),
  };
};

export function ProjectEdit({ id }: Props) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { notify } = useNotification();

  const {
    data: project,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => getProject(id, signal),
  });

  const { mutate: editProject, isPending: isEditing } = useMutation({
    mutationFn: (values: ProjectValues) =>
      updateProject(id, toUpdateProjectRequest(values)),
    onSuccess: (updatedProject: Project) => {
      queryClient.setQueryData(projectKeys.detail(id), updatedProject);

      navigate(`/projects/${id}`);

      queryClient.invalidateQueries({ queryKey: projectKeys.all });

      notify({
        type: "success",
        title: "Sucesso!",
        description: "Projeto editado com sucesso!",
      });
    },
    onError: (error) => {
      switch (error.status) {
        case HttpStatus.NOT_FOUND:
          navigate("/projects");

          queryClient.invalidateQueries({ queryKey: projectKeys.all });

          notify({
            type: "error",
            title: "Ops!! Houve um erro ao editar o projeto...",
            description: "O projeto que você tentou editar não foi encontrado.",
          });
          break;

        case HttpStatus.CONFLICT:
          notify({
            type: "error",
            title: "Ops!! Houve um erro ao editar o projeto...",
            description:
              "O máximo de cargos é menor que a quantidade de cargos que o projeto já tem. Informe um valor maior.",
          });
          break;

        default:
          notify({
            type: "error",
            title: "Ops!! Houve um erro ao editar o projeto...",
            description:
              "Ocorreu um erro ao editar o projeto. Tente novamente mais tarde.",
          });
      }
    },
  });

  if (isPending) {
    return (
      <p className="text-sm text-gray-500">Carregando dados do projeto...</p>
    );
  }

  if (isError) {
    if (error.status === HttpStatus.NOT_FOUND) {
      return <ProjectNotFound />;
    }

    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-4"
        role="alert"
      >
        <p className="font-semibold text-red-800">Erro ao carregar o projeto</p>
        <p className="mt-1 text-sm text-red-700">{describeError(error)}</p>
      </div>
    );
  }

  const projectValues = toProjectValues(project);

  return (
    <ProjectForm
      title={`Editando Projeto: ${project.name}`}
      initialValues={projectValues}
      submitLabel={isEditing ? "Salvando..." : "Salvar"}
      isSubmitting={isEditing}
      onSubmit={editProject}
      cancelTo={`/projects/${id}`}
    />
  );
}
