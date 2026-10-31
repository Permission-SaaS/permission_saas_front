import { HttpError } from "./HttpError";

interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp: string;
}

interface RequestOptions {
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

type MethodOptions = "GET" | "POST" | "PUT" | "DELETE";

const API_PATH = "/api";

const TIMEOUT_MS = 5000;

export const httpClient = {
  get: <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    return request<T>("GET", path, options);
  },
  post: <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    return request<T>("POST", path, options);
  },
  put: <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    return request<T>("PUT", path, options);
  },
  delete: <T>(path: string, options: RequestOptions = {}): Promise<T> => {
    return request<T>("DELETE", path, options);
  },
};

const request = async <T>(
  method: MethodOptions,
  path: string,
  options: RequestOptions,
): Promise<T> => {
  const requestPath = formatRequestPath(path);
  const requestHeaders = formatRequestHeaders();
  const requestBody = formatRequestBody(method, options.body);

  const internalController = new AbortController();

  const signals = [internalController.signal];

  if (options.signal) {
    signals.push(options.signal);
  }

  const abortSignals = AbortSignal.any(signals);

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal: abortSignals,
  };

  let requestTimeoutId;

  const requestTimeout = new Promise<never>((_, reject) => {
    requestTimeoutId = setTimeout(() => {
      reject(new HttpError("timeout", "Request timed out"));
      internalController.abort();
    }, options.timeoutMs ?? TIMEOUT_MS);
  });

  try {
    const response = await Promise.race<Response>([
      fetch(requestPath, requestInit),
      requestTimeout,
    ]);

    if (!response.ok) {
      const message = await readErrorMessage(response);
      throw new HttpError("http", message, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const responseBody: T = await response.json();

    return responseBody;
  } catch (error: unknown) {
    throw toHttpError(error, internalController.signal, options.signal);
  } finally {
    clearTimeout(requestTimeoutId);
  }
};

const formatRequestPath = (requestPath: string): string => {
  return `${API_PATH}${requestPath}`;
};

const formatRequestHeaders = (): Headers => {
  const headers: HeadersInit = new Headers();
  headers.set("Content-Type", "application/json");

  return headers;
};

const formatRequestBody = (
  method: MethodOptions,
  body?: unknown,
): string | undefined => {
  if (isValidMethodToPutBody(method) && body !== undefined) {
    return JSON.stringify(body);
  }

  return undefined;
};

const isValidMethodToPutBody = (method: MethodOptions): boolean => {
  return ["POST", "PUT"].includes(method.toUpperCase());
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const errorResponse: Partial<ErrorResponse> = await response.json();
    return errorResponse.message ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

const toHttpError = (
  error: unknown,
  internalSignal?: AbortSignal,
  remoteSignal?: AbortSignal,
): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }

  if (internalSignal?.aborted) {
    return new HttpError("timeout", "Request timed out");
  }

  if (remoteSignal?.aborted) {
    return new HttpError("abort", "Request aborted");
  }

  return new HttpError("network", "Network error");
};
