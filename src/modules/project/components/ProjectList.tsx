import type { Project } from "../types";
import { ProjectCard } from "./ProjectCard";

interface Props {
  projects: Project[];
}

export function ProjectList({ projects }: Props) {
  if (projects.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum projeto encontrado.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
