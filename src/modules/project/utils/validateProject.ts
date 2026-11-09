import type { Violation } from "@/shared";
import type { ProjectValues } from "../types";

const NAME_MAX_LENGTH = 120;

const DESCRIPTION_MAX_LENGTH = 500;

const MIN_ROLES = 1;

export const validateProject = (
  values: ProjectValues,
  initialValues: ProjectValues,
) => {
  const errors: Violation<ProjectValues> = {};

  const name = values.name.trim();
  if (name === "") {
    errors.name = "Informe o nome do projeto.";
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `O nome pode ter até ${NAME_MAX_LENGTH} caracteres.`;
  }

  const description = values.description.trim();
  const hadDescription = initialValues.description.trim() !== "";
  if (hadDescription && description === "") {
    errors.description =
      "A descrição não pode ser apagada. Escreva um novo texto.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `A descrição pode ter até ${DESCRIPTION_MAX_LENGTH} caracteres.`;
  }

  const maxRoles = values.maxRoles.trim();
  if (maxRoles === "") {
    errors.maxRoles = "Informe o máximo de cargos.";
  } else if (!Number.isInteger(Number(maxRoles))) {
    errors.maxRoles = "O máximo de cargos precisa ser um número inteiro.";
  } else if (Number(maxRoles) < MIN_ROLES) {
    errors.maxRoles = `O máximo de cargos precisa ser pelo menos ${MIN_ROLES}.`;
  }

  return errors;
};
