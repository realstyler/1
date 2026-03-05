import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      const ignore401 = error.config?.ignore401;

      if (
        error.response?.status === 401 && 
        typeof window !== "undefined" && 
        !ignore401
      ) {
        window.location.href = "/login";
      }
    } catch {}
    
    return Promise.reject(error);
  },
);

export default api;