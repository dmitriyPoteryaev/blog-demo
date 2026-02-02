import { http } from "./http";
import { ensureCsrfCookie } from "shared/helpers/auth/sanctum";

export const signIn = async (email: string, password: string) => {
  await ensureCsrfCookie();
  return http.post("/api/auth/login", { email, password });
};

export const signUp = async (email: string, password: string) => {
  await ensureCsrfCookie();
  return http.post("/api/auth/register", {
    name: email,
    email,
    password,
  });
};

export const logout = async () => {
  await ensureCsrfCookie();
  return http.post("/api/auth/logout");
};
