import type { ComponentProps } from "react";
import type { ButtonVariant } from "./buttonClasses";
import { buttonClasses } from "./buttonClasses";

const DISABLED_CLASSES =
  "disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400";

interface Props extends Omit<ComponentProps<"button">, "className"> {
  variant?: ButtonVariant;
}

export function Button({
  variant = "default",
  type = "button",
  ...props
}: Props) {
  return (
    <button
      {...props}
      type={type}
      className={`${buttonClasses(variant)} ${DISABLED_CLASSES}`}
    />
  );
}
