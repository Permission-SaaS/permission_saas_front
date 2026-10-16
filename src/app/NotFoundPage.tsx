import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div>
      Página não encontrada - 404
      <Link to="/">Voltar</Link>
    </div>
  );
}
