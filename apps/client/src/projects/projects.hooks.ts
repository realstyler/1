import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProjectApi, getProjectByIdApi } from "./projects.api";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useGetProject(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectByIdApi(projectId),
    enabled: !!projectId,
  });
}