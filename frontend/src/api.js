import axios from "axios";

export const api = axios.create({
  baseURL: "https://photoshare-six.vercel.app/api",
});

// Attach Firebase token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("firebaseToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
