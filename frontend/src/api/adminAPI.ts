import axios from "axios";

const adminAPI = axios.create({
  baseURL: "https://tunetix-fullstack-postgres.onrender.com/api",
});

adminAPI.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  return config;
});

export default adminAPI;