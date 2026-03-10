import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollectionApi,
  getProjectCollectionsApi,
  getCollectionByIdApi,
  deleteCollectionApi,
  shareCollectionApi,
  getPublicCollectionApi
} from "./collections.api";
import { CreateCollectionDTO } from "@/types";

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: CreateCollectionDTO }) =>
      createCollectionApi(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projectCollections", variables.projectId] });
    },
  });
}

export function useGetProjectCollections(projectId: string) {
  return useQuery({
    queryKey: ["projectCollections", projectId],
    queryFn: () => getProjectCollectionsApi(projectId),
    enabled: !!projectId,
  });
}

export function useGetCollection(collectionId: string) {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => getCollectionByIdApi(collectionId),
    enabled: !!collectionId,
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollectionApi(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectCollections"] });
    },
  });
}

export function useShareCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => shareCollectionApi(collectionId),
    onSuccess: (_, collectionId) => {
      queryClient.invalidateQueries({ queryKey: ["collection", collectionId] });
      queryClient.invalidateQueries({ queryKey: ["projectCollections"] });
    },
  });
}

export function useGetPublicCollection(shareId: string) {
  return useQuery({
    queryKey: ["publicCollection", shareId],
    queryFn: () => getPublicCollectionApi(shareId),
    enabled: !!shareId,
  });
}