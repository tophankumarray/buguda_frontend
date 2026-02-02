// @ts-nocheck
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8003/api",
  timeout: 10000,
});

// ✅ Request interceptor (Auth)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: if FormData, don't force JSON
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response interceptor
// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "";

      // 🔑 Detect login APIs
      const isLoginRequest =
        url.includes("/admin/login") ||
        url.includes("/supervisors/loginsupervisor");

      // ❌ DO NOT redirect on login failure
      if (status === 401 && !isLoginRequest) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // Optional logs
      if (status === 403) console.error("Forbidden");
      if (status === 404) console.error("Not Found");
      if (status === 500) console.error("Server Error");
    } else {
      console.error("Network / Server unreachable");
    }

    return Promise.reject(error);
  },
);

export default api;
