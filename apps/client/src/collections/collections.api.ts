import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { CreateCollectionDTO, CollectionDTO, CollectionDetailsDTO } from "@/types";

export const createCollectionApi = async (projectId: string, data: CreateCollectionDTO) =>
  fetcher<CollectionDTO>(api.post(`/api/projects/${projectId}/collections`, data));

export const getProjectCollectionsApi = async (projectId: string) =>
  fetcher<(CollectionDTO & { itemsCount: number })[]>(api.get(`/api/projects/${projectId}/collections`));

export const getCollectionByIdApi = async (id: string) =>
  fetcher<CollectionDetailsDTO>(api.get(`/api/collections/${id}`));

export const deleteCollectionApi = async (id: string) =>
  fetcher<{ id: string }>(api.delete(`/api/collections/${id}`));

export const shareCollectionApi = async (id: string) =>
  fetcher<{ shareId: string }>(api.post(`/api/collections/${id}/share`));

export const getPublicCollectionApi = async (shareId: string) =>
  fetcher<CollectionDetailsDTO>(api.get(`/api/collections/public/${shareId}`));