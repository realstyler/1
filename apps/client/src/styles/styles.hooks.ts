import { useQuery } from "@tanstack/react-query";
import { getStylesApi } from "./styles.api";

export function useGetStyles() {
  return useQuery({
    queryKey: ["styles"],
    queryFn: getStylesApi,
  });
}