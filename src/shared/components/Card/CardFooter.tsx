import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function CardFooter({ children }: Props) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3">
      {children}
    </div>
  );
}
