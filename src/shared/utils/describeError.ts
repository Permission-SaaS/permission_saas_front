import type { HttpError } from "../api/HttpError";

export const describeError = (error: HttpError) => {
  if (error.kind === "network" || error.kind === "timeout") {
    return "Não foi possível falar com o servidor. Tente de novo em instantes.";
  }

  return `O servidor respondeu com o erro ${error.status}.`;
};
