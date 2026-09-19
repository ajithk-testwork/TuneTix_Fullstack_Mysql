import axios from "axios";

const userAPI = axios.create({
  baseURL: "https://tunetix-fullstack-postgres.onrender.com/api",
});

userAPI.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");

  if (userToken) {
    config.headers.Authorization = `Bearer ${userToken}`;
  }

  return config;
});

export default userAPI;