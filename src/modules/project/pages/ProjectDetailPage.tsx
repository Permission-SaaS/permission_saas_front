import { isUuid } from "@/shared";
import { Link, useParams } from "react-router";
import { ProjectDetail } from "../components/ProjectDetail";
import { ProjectNotFound } from "../components/ProjectNotFound";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-4 p-6">
      <Link
        className="inline-block text-sm font-medium text-blue-600 hover:underline"
        to="/projects"
      >
        ← Voltar para a lista
      </Link>
      {id && isUuid(id) ? <ProjectDetail id={id} /> : <ProjectNotFound />}
    </div>
  );
}
