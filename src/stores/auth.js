import { defineStore } from "pinia";
import api from "@/api"; // dùng axios instance đã config

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    role: localStorage.getItem("role") || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.role === "ADMIN",
    isStaff: (state) => state.role === "STAFF",
    isMember: (state) => state.role === "MEMBER",
  },

  actions: {
    async login(email, password) {
      try {
        const res = await api.post("/auth/login", { email, password });
        this.token = res.data.token;
        localStorage.setItem("token", this.token);
        await this.fetchUser();
      } catch (err) {
        this.logout();
        throw new Error("Đăng nhập thất bại");
      }
    },
    async loginWithGoogle() {
      try {
        const res = await api.get("/auth/google-url");
        window.location.href = res.data; // <-- redirect đến Google login
      } catch (err) {
        throw new Error("Không thể chuyển hướng đến Google");
      }
    },
    async fetchUser() {
      try {
        const res = await api.get("/user/me");
        this.user = res.data.data;
        this.role = res.data.data.role;
        localStorage.setItem("role", this.role);
      } catch (err) {
        this.logout();
      }
    },
    // register
    async register(data) {
      try {
        const res = await api.post("/auth/register", data);
      } catch (err) {
        this.logout();
        throw new Error("Đăng ký thất bại");
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.role = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});
