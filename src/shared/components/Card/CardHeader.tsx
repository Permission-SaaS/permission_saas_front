import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function CardHeader({ children }: Props) {
  return (
    <div className="border-b border-gray-200 px-4 py-3 font-semibold text-gray-900">
      {children}
    </div>
  );
}
