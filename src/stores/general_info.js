import { defineStore } from "pinia";
import api from "../api"; // Đường dẫn tới file axios instance

export const useGeneralInfo = defineStore("generalInfo", {
  state: () => ({
    generalInfo: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createInfo(request) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/general-info/create", request);
        this.generalInfo = res.data.data;
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateInfo(id, request) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/general-info/update/${id}`, request);
        this.generalInfo = res.data.data;
        return this.generalInfo;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getInfo() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/general-info");
        this.generalInfo = res.data.data;
        return this.generalInfo;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
