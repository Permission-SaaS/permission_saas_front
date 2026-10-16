import { useParams } from "react-router";

export function ProjectFormPage() {
  const { id } = useParams<{ id: string }>();
  return <div>{id ? `Editar Projeto: ${id}` : "Novo Projeto"}</div>;
}
