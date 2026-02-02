
import { http } from "api/http";

export async function ensureCsrfCookie(): Promise<void> {
  await http.get("/sanctum/csrf-cookie");
}
