import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ApiError,
  Job,
  RestyleInput,
  RestyleSchema,
  zodParseOrThrow,
} from "shared";
import { getJobsResultsApi, startRestyleApi } from "./restyle.api";

export function useStartRestyle() {
  return useMutation<string[], ApiError | Error, RestyleInput>({
    mutationFn: async (data) => {
      zodParseOrThrow(RestyleSchema, data);
      return startRestyleApi(data);
    },
  });
}

export function useGetJobsResultsApi(ids: string[], createSignedUrls = true) {
  return useQuery<
    (Job | null)[],
    Error,
    (Job | null)[],
    ["jobs", string[], boolean]
  >({
    queryKey: ["jobs", ids, createSignedUrls],
    enabled: ids.length > 0,
    queryFn: ({ queryKey }) => {
      const [, jobIds, signed] = queryKey;
      return getJobsResultsApi(jobIds, signed);
    },
  });
}
