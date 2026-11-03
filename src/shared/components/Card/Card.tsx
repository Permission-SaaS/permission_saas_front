import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function Card({ children }: Props) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      {children}
    </div>
  );
}
