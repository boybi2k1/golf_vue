import { defineStore } from "pinia";
import api from "../api"; // Đường dẫn tới file axios instance

export const useToolStore = defineStore("tool", {
  state: () => ({
    toolDetail: null,
    toolList: [],
    toolSearch: [],
    golfClubs: [],
    loading: false,
    error: null,
  }),

  actions: {
    async createTool(formData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/tool", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.toolList.push(res.data.data);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTool(id, formData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/tool/upadate/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        // Cập nhật công cụ trong danh sách toolList
        const updatedTool = res.data.data;
        const index = this.toolList.findIndex((t) => t.id === updatedTool.id);
        if (index !== -1) {
          this.toolList[index] = updatedTool;
        }
        return updatedTool;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getToolById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/tool/detail/${id}`);
        this.toolDetail = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteTool(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.delete(`/tool/delete/${id}`);

        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async searchTools(request) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/tool/search", request);
        this.toolSearch = res.data.data?.content || [];
        return this.toolList;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // Lấy danh sách tất cả công cụ
    async getAllTools() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/tool/all");
        this.toolList = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // Lấy danh sách tất cả golf club
    async getAllGolfClub() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/tool/golf_club");
        console.log(res.data.data);
        this.golfClubs = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
