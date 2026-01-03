import axios from "axios";

let isRefreshing = false;
let failedQueue: any[] = [];
let hasLoggedOut = false;

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (hasLoggedOut) {
      return Promise.reject(new Error("Session expired"));
    }

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url?.includes("login") &&
      !originalRequest.url?.includes("signup") &&
      !originalRequest.url?.includes("google")
    ) {
      if (originalRequest.url?.includes("/api/auth/refresh")) {
        hasLoggedOut = true;
        isRefreshing = false;
        processQueue(error);
        try {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch {}

        // Dispatch event
        window.dispatchEvent(new Event("logout"));

        // Navigate
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(error);
      }

      // Queue requests while refreshing
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh
        await api.post("/api/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        hasLoggedOut = true;
        isRefreshing = false;
        processQueue(refreshError);

        // Clear cookies on backend
        try {
          await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch {}

        // Dispatch event
        window.dispatchEvent(new Event("logout"));

        // Navigate
        if (window.location.pathname !== "/auth") {
          window.location.href = "/auth";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
