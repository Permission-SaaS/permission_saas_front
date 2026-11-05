import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  formatDateTime,
} from "@/shared";
import { Link } from "react-router";
import type { Project } from "../types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="truncate">{project.name}</span>
          <ProjectStatusBadge active={project.active} />
        </div>
      </CardHeader>
      <CardBody>{project.description ?? "Sem descrição"}</CardBody>
      <CardFooter>
        <div className="mr-auto text-sm text-gray-600">
          <span>Criado em: {formatDateTime(project.createdAt)}</span>
          {project.updatedAt && (
            <>
              {" | "}
              <span>Atualizado em: {formatDateTime(project.updatedAt)}</span>
            </>
          )}
        </div>
        <Link
          className="text-sm font-medium text-blue-600 hover:underline"
          to={`/projects/${project.id}`}
        >
          Detalhes
        </Link>
      </CardFooter>
    </Card>
  );
}
