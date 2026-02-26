import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { ProjectDTO } from "@/types";

export const createProjectApi = async (data: { name: string; address?: string }) =>
  fetcher<ProjectDTO>(api.post("/api/projects", data));

export const getAllProjectsApi = async (params: { page: number; limit: number }) =>
  fetcher<{
    projects: ProjectDTO[];
    totalPages: number;
    totalCount: number;
  }>(api.get("/api/projects", { params }));

export const getProjectByIdApi = async (id: string) =>
  fetcher<ProjectDTO>(api.get(`/api/projects/${id}`));