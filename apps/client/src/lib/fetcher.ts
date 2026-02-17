import type { AxiosResponse } from "axios";
import axios from "axios";
import { ApiError } from "shared";

export async function fetcher<T>(
  promise: Promise<AxiosResponse<T>>,
): Promise<T> {
  try {
    const response = await promise;
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.message ?? "Server error";
        const code = err.response.data.code;

        // server error
        throw new ApiError(message, status, code);
      } else {
        // network error or timeout
        throw new Error(err.message);
      }
    }
    throw err; // unknown error
  }
}
