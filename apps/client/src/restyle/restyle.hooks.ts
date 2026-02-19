import { useMutation } from "@tanstack/react-query";
import { ApiError, RestyleInput, RestyleSchema, zodParseOrThrow } from "shared";
import { startRestyleApi } from "./restyle.api";

export function useStartRestyle() {
  return useMutation<string[], ApiError | Error, RestyleInput>({
    mutationFn: async (data) => {
      zodParseOrThrow(RestyleSchema, data);
      return startRestyleApi(data);
    },
  });
}
