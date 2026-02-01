const API_BASE = "http://localhost:8090";

/* =======================
   CSRF helpers (Sanctum)
   ======================= */

function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

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
