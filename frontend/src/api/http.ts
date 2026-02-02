import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8090",
  withCredentials: true, 
  headers: {
    Accept: "application/json",
  },
});
