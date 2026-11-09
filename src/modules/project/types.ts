export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string | null;
  maxRoles: number;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ProjectFilters {
  name?: string;
  onlyActive?: boolean;
}

export interface ProjectValues {
  name: string;
  description: string;
  maxRoles: string;
}

export interface CreateProjectRequest {
  clientId: string;
  name: string;
  description?: string;
  maxRoles: number;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  maxRoles?: number;
}
