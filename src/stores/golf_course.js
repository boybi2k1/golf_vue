import { defineStore } from "pinia";
import api from "../api"; // Đường dẫn tới file axios instance

export const useGolfCourseStore = defineStore("golfCourse", {
  state: () => ({
    golfCourses: [],
    golfCourseDetail: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createGolfCourse(formData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/golf-course", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.golfCourses.push(res.data.data); // Thêm sân golf mới vào danh sách
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateGolfCourse(id, formData) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/golf-course/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const updated = res.data.data;
        const index = this.golfCourses.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          this.golfCourses[index] = updated;
        }
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getAllGolfCourses() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/golf-course/all");
        console.log(res.data.data);
        this.golfCourses = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async getGolfCourseById(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/golf-course/${id}`);
        this.golfCourseDetail = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
