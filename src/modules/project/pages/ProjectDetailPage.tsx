import { useParams } from "react-router";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <div>Detalhes do Projeto: {id}</div>;
}
