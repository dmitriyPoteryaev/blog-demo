import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8090",
  withCredentials: true, // ОБЯЗАТЕЛЬНО, иначе cookies не поедут
  headers: {
    Accept: "application/json",
  },
});
