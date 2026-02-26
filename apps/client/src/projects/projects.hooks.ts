import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectApi } from "./projects.api";

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}