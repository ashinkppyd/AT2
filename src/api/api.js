import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;


    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url;

    
    if (
      url.includes("account/login") ||
      url.includes("account/register") ||
      url.includes("account/refresh") ||
      url.includes("account/me")
    ) {
      return Promise.reject(error);
    }

    
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("account/refresh/");
        return api(originalRequest);
      } catch (refreshError) {
        
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
