// src/api/errors.ts
import axios from "axios";

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    const data = err.response?.data;

    if (data?.errors) {
      return Object.values(data.errors)[0]?.[0] ?? data.message;
    }

    return data?.message ?? "Ошибка запроса";
  }

  if (err instanceof Error) {
    return err.message;
  }

  return "Неизвестная ошибка";
}
