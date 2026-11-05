import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Card } from "./Card/Card";
import { CardHeader } from "./Card/CardHeader";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className="m-auto w-full max-w-md bg-transparent p-4 backdrop:bg-black/50"
      onClose={onClose}
    >
      {open && (
        <Card>
          <CardHeader>{title}</CardHeader>
          {children}
        </Card>
      )}
    </dialog>
  );
}
