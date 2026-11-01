import { httpClient } from "@/shared";
import type {
  CreateProjectRequest,
  Project,
  ProjectFilters,
  UpdateProjectRequest,
} from "../types";

export const listProjects = (
  filters: ProjectFilters = {},
  signal?: AbortSignal,
) => {
  const params = new URLSearchParams();

  if (filters.name) {
    params.set("name", filters.name);
  }

  if (filters.onlyActive !== undefined) {
    params.set("onlyActive", String(filters.onlyActive));
  }

  const query = params.toString();
  const path = query ? `/projects?${query}` : "/projects";

  return httpClient.get<Project[]>(path, { signal });
};

export const getProject = (id: string, signal?: AbortSignal) =>
  httpClient.get<Project>(`/projects/${id}`, { signal });

export const createProject = (request: CreateProjectRequest) =>
  httpClient.post<Project>("/projects", { body: request });

export const updateProject = (id: string, request: UpdateProjectRequest) =>
  httpClient.put<Project>(`/projects/${id}`, { body: request });

export const deleteProject = (id: string) =>
  httpClient.delete<void>(`/projects/${id}`);
