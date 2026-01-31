import { http } from "./http";

export const csrf = () => http.get("/sanctum/csrf-cookie");

export const signIn = async (email: string, password: string) => {
  await csrf();
  return http.post("/api/auth/login", { email, password });
};

export const signUp = async (email: string, password: string) => {
  await csrf();
  return http.post("/api/auth/register", {
    name: email,
    email,
    password,
  });
};

export const logout = async () => {
  await csrf();
  return http.post("/api/auth/logout");
};
