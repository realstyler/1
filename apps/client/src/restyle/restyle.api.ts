import api from "@/lib/api";
import { fetcher } from "@/lib/fetcher";
import { Job, RestyleInput } from "shared";

export const startRestyleApi = async (input: RestyleInput) =>
  fetcher<string[]>(api.post("/api/restyle", input)); // returns jobs ids

export const getJobsResultsApi = async (
  ids: string[],
  createSignedUrls?: boolean,
) => {
  if (ids.length === 0) return [];
  return fetcher<(Job | null)[]>(
    api.get("/api/restyle/jobs", {
      params: { ids: ids.join(","), signed_urls: createSignedUrls },
    }),
  );
};
