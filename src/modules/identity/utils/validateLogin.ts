import type { Violation } from "@/shared";
import type { LoginValues } from "../types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = (values: LoginValues) => {
  const errors: Violation<LoginValues> = {};

  const email = values.email.trim();
  if (email === "") {
    errors.email = "Informe o e-mail.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (values.password === "") {
    errors.password = "Informe a senha.";
  }

  return errors;
};
