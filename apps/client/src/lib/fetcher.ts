import type { AxiosResponse } from "axios";
import axios from "axios";

export async function fetcher<T>(
  promise: Promise<AxiosResponse<T>>
): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const message = err.response.data.message ?? "Server error";

        // server error
        throw new Error(message);
      } else {
        // network error or timeout
        throw new Error(err.message);
      }
    }
    throw err; // unknown error
  }
}
