import axios from "axios";
import { API_BASE } from "shared/config/api";

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});
