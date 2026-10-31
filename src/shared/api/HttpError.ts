export type HttpErrorKind = "http" | "network" | "timeout" | "abort";

export class HttpError extends Error {
  public readonly kind: HttpErrorKind;
  public readonly status: number | undefined;

  public constructor(kind: HttpErrorKind, message: string, status?: number) {
    super(message);
    this.name = "HttpError";
    this.kind = kind;
    this.status = status;
  }
}
