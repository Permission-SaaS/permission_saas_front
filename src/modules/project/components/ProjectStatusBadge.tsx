interface Props {
  active: boolean;
}

export function ProjectStatusBadge({ active }: Props) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
    >
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}
