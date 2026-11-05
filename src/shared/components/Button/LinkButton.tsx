import type { ComponentProps } from "react";
import { Link } from "react-router";
import type { ButtonVariant } from "./buttonClasses";
import { buttonClasses } from "./buttonClasses";

interface Props extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: ButtonVariant;
}

export function LinkButton({ variant = "default", ...props }: Props) {
  return <Link {...props} className={buttonClasses(variant)} />;
}
