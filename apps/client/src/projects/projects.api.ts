import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { ProjectDTO, ProjectListItem, AddProjectImageInput } from "@/types";

export const createProjectApi = async (data: { name: string; address?: string }) =>
  fetcher<ProjectDTO>(api.post("/api/projects", data));

export const getAllProjectsApi = async (params: { page: number; limit: number }) =>
  fetcher<{
    projects: ProjectListItem[];
    totalPages: number;
    totalCount: number;
  }>(api.get("/api/projects", { params }));

export const getProjectByIdApi = async (id: string, loadSignedImages: boolean = false) => {
  const query = loadSignedImages ? '?loadSignedImages=true' : '';
  return fetcher<ProjectDTO>(api.get(`/api/projects/${id}${query}`));
}

export const addProjectImagesApi = async (projectId: string, imagesData: AddProjectImageInput[]) =>
  fetcher(api.post(`/api/projects/${projectId}/images`, { imagesData }));