import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function CardBody({ children }: Props) {
  return (
    <div className="flex-1 space-y-1 px-4 py-3 text-sm text-gray-600">
      {children}
    </div>
  );
}
