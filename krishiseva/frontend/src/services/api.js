import axios from "axios";

// Read API URL from environment variables, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Flag to track token refreshing process to prevent infinite loops
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. Request Interceptor: Attach Access Token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("krishiseva_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Centralized error handling & token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (session expired/invalid)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("krishiseva_refresh_token");
      if (!refreshToken) {
        // No refresh token available, logout user
        isRefreshing = false;
        handleAuthExpiry();
        return Promise.reject(error);
      }

      try {
        // Call the refresh endpoint directly using plain axios to avoid interceptor hooks
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        if (refreshResponse.data && refreshResponse.data.success) {
          const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
          
          localStorage.setItem("krishiseva_token", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("krishiseva_refresh_token", newRefreshToken);
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        handleAuthExpiry();
        return Promise.reject(refreshError);
      }
    }

    // Global Error mapping for debugging and warning alerts
    const message = error.response?.data?.message || "A network or server error occurred. Please try again.";
    error.userFriendlyMessage = message;

    return Promise.reject(error);
  }
);

const handleAuthExpiry = () => {
  localStorage.removeItem("krishiseva_token");
  localStorage.removeItem("krishiseva_refresh_token");
  // Only redirect if we are not already on the login or landing page
  if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
    window.location.href = "/login?expired=true";
  }
};

export default api;
