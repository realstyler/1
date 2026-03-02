import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectApi, getProjectByIdApi, addProjectImagesApi, getAllProjectsApi } from "./projects.api";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useGetAllProjects(page: number, limit: number) {
  return useQuery({
    queryKey: ["projects", page, limit],
    queryFn: () => getAllProjectsApi({ page, limit }),
  });
}

export function useGetProject(projectId: string, loadSignedImages: boolean = false) {
  return useQuery({
    queryKey: ['project', projectId, loadSignedImages],
    queryFn: () => getProjectByIdApi(projectId, loadSignedImages),
    enabled: !!projectId,
  });
}

export function useAddProjectImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, paths }: { projectId: string; paths: string[] }) =>
      addProjectImagesApi(projectId, paths),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
    },
  });
}