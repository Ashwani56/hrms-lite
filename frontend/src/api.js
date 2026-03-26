import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-lite-production-8b6c.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;