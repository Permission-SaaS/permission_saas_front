import { useNotification } from "@/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createProject } from "../api/projectApi";
import { projectKeys } from "../api/projectKeys";
import type { CreateProjectRequest, ProjectValues } from "../types";
import { ProjectForm } from "./ProjectForm";

const CLIENT_ID = import.meta.env.VITE_DEV_CLIENT_ID?.trim() ?? "";

const EMPTY_VALUES: ProjectValues = {
  name: "",
  description: "",
  maxRoles: "",
};

const toCreateProjectRequest = (
  values: ProjectValues,
): CreateProjectRequest => {
  const description = values.description.trim();

  return {
    clientId: CLIENT_ID,
    name: values.name.trim(),
    description: description === "" ? undefined : description,
    maxRoles: Number(values.maxRoles),
  };
};

export function ProjectCreate() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { notify } = useNotification();

  const { mutate: createNewProject, isPending: isCreating } = useMutation({
    mutationFn: (values: ProjectValues) =>
      createProject(toCreateProjectRequest(values)),
    onSuccess: (project) => {
      navigate(`/projects/${project.id}`);

      queryClient.invalidateQueries({ queryKey: projectKeys.all });

      notify({
        type: "success",
        title: "Sucesso!",
        description: "Projeto criado com sucesso!",
      });
    },
    onError: () => {
      notify({
        type: "error",
        title: "Ops!! Houve um erro ao criar o projeto...",
        description:
          "Ocorreu um erro ao criar o projeto. Tente novamente mais tarde.",
      });
    },
  });

  if (CLIENT_ID === "") {
    return (
      <div
        className="rounded-lg border border-red-200 bg-red-50 p-4"
        role="alert"
      >
        <p className="font-semibold text-red-800">
          Não é possível criar projetos
        </p>
        <p className="mt-1 text-sm text-red-700">
          Falta a variável VITE_DEV_CLIENT_ID com o id do cliente. Crie o
          arquivo .env.local a partir do .env.example.
        </p>
      </div>
    );
  }

  return (
    <ProjectForm
      title="Novo Projeto"
      initialValues={EMPTY_VALUES}
      submitLabel={isCreating ? "Criando..." : "Criar"}
      isSubmitting={isCreating}
      onSubmit={createNewProject}
      cancelTo="/projects"
    />
  );
}
