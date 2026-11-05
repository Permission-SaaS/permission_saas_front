import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  describeError,
  formatDateTime,
  HttpStatus,
  Modal,
  useNotification,
} from "@/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { deleteProject, getProject } from "../api/projectApi";
import { projectKeys } from "../api/projectKeys";
import { ProjectNotFound } from "./ProjectNotFound";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

interface Props {
  id: string;
}

const DISABLED_BUTTON_CLASSNAMES =
  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400";

const DELETE_BUTTON_CLASSNAMES =
  "rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100";

const DEFAULT_BUTTON_CLASSNAMES =
  "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";

export function ProjectDetail({ id }: Props) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { notify } = useNotification();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmProjectName, setConfirmProjectName] = useState("");

  const handleConfirmProjectNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmProjectName(event.target.value);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setConfirmProjectName("");
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const {
    data: project,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: ({ signal }) => getProject(id, signal),
  });

  const { mutate: deleteProjectDetail, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      navigate("/projects");

      queryClient.invalidateQueries({ queryKey: projectKeys.all });

      notify({
        type: "success",
        title: "Sucesso!",
        description: "Projeto excluído com sucesso!",
      });
    },
    onError: (error) => {
      if (error.status === HttpStatus.NOT_FOUND) {
        navigate("/projects");

        queryClient.invalidateQueries({ queryKey: projectKeys.all });

        notify({
          type: "error",
          title: "Ops!! Houve um erro ao excluir o projeto...",
          description: "O projeto que você tentou excluir não foi encontrado.",
        });
      } else {
        notify({
          type: "error",
          title: "Ops!! Houve um erro ao excluir o projeto...",
          description:
            "Ocorreu um erro ao excluir o projeto. Tente novamente mais tarde.",
        });
      }
    },
    onSettled: () => {
      handleDeleteModalClose();
    },
  });

  if (isPending) {
    return <p className="text-sm text-gray-500">Carregando projeto...</p>;
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

  const isProjectNameConfirmed = confirmProjectName === project.name;
  const hasError = confirmProjectName !== "" && !isProjectNameConfirmed;

  const handleDeleteProject = () => {
    if (isProjectNameConfirmed) {
      deleteProjectDetail(project.id);
    }
  };

  return (
    <>
      <Modal
        open={isDeleteModalOpen}
        title="Confirmação de exclusão"
        onClose={handleDeleteModalClose}
      >
        <CardBody>
          <p className="mb-1">{`Tem certeza que deseja excluir o projeto: "${project.name}" ?`}</p>
          <label htmlFor="project-name" className="mb-1">
            Para confirmar, preencha abaixo o nome do projeto e clique em
            "Excluir":
          </label>
          <div className="flex flex-col gap-1">
            <input
              className={`rounded-md border px-3 py-1.5 text-sm focus:ring-1 focus:outline-none ${hasError ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"}`}
              id="project-name"
              type="text"
              name="name"
              value={confirmProjectName}
              onChange={handleConfirmProjectNameChange}
              maxLength={120}
            />
            {hasError && (
              <span className="text-sm text-red-700">
                Preencha o nome do projeto corretamente.
              </span>
            )}
          </div>
        </CardBody>

        <CardFooter>
          <button
            className={`${DEFAULT_BUTTON_CLASSNAMES} ${DISABLED_BUTTON_CLASSNAMES}`}
            onClick={handleDeleteModalClose}
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            className={`${DELETE_BUTTON_CLASSNAMES} ${DISABLED_BUTTON_CLASSNAMES}`}
            disabled={!isProjectNameConfirmed || isDeleting}
            onClick={handleDeleteProject}
          >
            {isDeleting ? "Deletando..." : "Excluir"}
          </button>
        </CardFooter>
      </Modal>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate">{project.name}</span>
            <ProjectStatusBadge active={project.active} />
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p>{project.description ?? "Sem descrição"}</p>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div>
                <dt className="font-medium text-gray-900">Máximo de cargos</dt>
                <dd>{project.maxRoles}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Criado em</dt>
                <dd>{formatDateTime(project.createdAt)}</dd>
              </div>
              {project.updatedAt && (
                <div>
                  <dt className="font-medium text-gray-900">Atualizado em</dt>
                  <dd>{formatDateTime(project.updatedAt)}</dd>
                </div>
              )}
            </dl>
          </div>
        </CardBody>
        <CardFooter>
          <Link
            className={DEFAULT_BUTTON_CLASSNAMES}
            to={`/projects/${id}/edit`}
          >
            Editar
          </Link>
          <button
            className={`${DELETE_BUTTON_CLASSNAMES} ${DISABLED_BUTTON_CLASSNAMES}`}
            disabled={isDeleting}
            onClick={handleDeleteModalOpen}
          >
            Excluir
          </button>
        </CardFooter>
      </Card>
    </>
  );
}
