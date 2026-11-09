import { isUuid } from "@/shared";
import { Link, useParams } from "react-router";
import { ProjectCreate } from "../components/ProjectCreate";
import { ProjectEdit } from "../components/ProjectEdit";
import { ProjectNotFound } from "../components/ProjectNotFound";

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4 p-6">
      <Link
        className="inline-block text-sm font-medium text-blue-600 hover:underline"
        to="/projects"
      >
        ← Voltar para a lista
      </Link>

      {!id && <ProjectCreate />}
      {id && isUuid(id) && <ProjectEdit id={id} />}
      {id && !isUuid(id) && <ProjectNotFound />}
    </div>
  );
}
