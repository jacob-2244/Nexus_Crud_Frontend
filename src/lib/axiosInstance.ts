// src/lib/axiosInstance.ts
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const axiosInstance = axios.create({ baseURL });

// Attach JWT to every request automatically
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// If backend returns 401, clear session and redirect to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentMenu");
      localStorage.removeItem("authToken");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  },
);