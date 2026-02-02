import axios from "axios";
import type { ApiErrorResponse } from "shared/types/types";

export function getErrorMessage(err: unknown): string {

  if (axios.isAxiosError(err)) {
    const response = err.response;
    const data = response?.data as ApiErrorResponse | undefined;

    if (data) {
      if (data.errors && typeof data.errors === "object") {
        const firstError = Object.values(data.errors)[0];
        if (Array.isArray(firstError) && typeof firstError[0] === "string") {
          return firstError[0];
        }
      }

      if (typeof data.message === "string" && data.message) {
        return data.message;
      }
    }

    if (err.message) {
      return err.message;
    }

    return "Ошибка запроса";
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return "Неизвестная ошибка";
}
