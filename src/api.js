// src/utils/api.js
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const URL_IMAGE = "http://192.130.38.101:8080/uploads/";

const checkExpiredToken = (token) => {
  if (!token) return false;
  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

const instance = axios.create({
  baseURL: "http://192.130.38.101:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    if (url.includes("check")) {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return Promise.reject(new Error("No token available"));
      }

      if (checkExpiredToken(token)) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
