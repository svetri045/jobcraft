import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request Interceptor: Every request-க்கும் டோக்கனை ஆட்டோமேட்டிக்கா அட்டாச் பண்ணும்
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;