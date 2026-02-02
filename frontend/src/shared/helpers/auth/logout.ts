import { API_BASE } from "shared/config/api";
import { ensureCsrfCookie } from "./sanctum";
import { getCookie } from "./cookies";

export async function logout(): Promise<void> {
  await ensureCsrfCookie();

  const xsrfToken = getCookie("XSRF-TOKEN");
  if (!xsrfToken) {
    throw new Error("XSRF-TOKEN cookie not found");
  }

  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": xsrfToken,
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  if (!res.ok) {
    throw new Error(`Logout failed: ${res.status}`);
  }
}
