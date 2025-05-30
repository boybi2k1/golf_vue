import { defineStore } from "pinia";
import api from "../api";

export const useTeeTimeStore = defineStore("teeTime", {
  state: () => ({
    teeTimeSearch: [],
    availableTeeTimes: [],
    teeTimesByDateAndCourse: [],
    pagination: { page: 0, size: 10, totalPages: 0, totalElements: 0 },
    loading: false,
    error: null,
  }),

  actions: {
    async getAvailableTeeTimes(golfCourseId, date) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/tee-time/available", {
          params: { golfCourseId, date },
        });
        this.availableTeeTimes = res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async getTeeTimeByDateAndGolfCourseId({ param }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get("/tee-time/by-date-and-golf-course", {
          params: param,
        });
        this.teeTimesByDateAndCourse = res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },

    async createTeeTime(request) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/tee-time/create", request);
        return res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTeeTime(id, request) {
      // this.loading = true;
      this.error = null;
      try {
        const res = await api.put(`/tee-time/update/${id}`, request);
        const updated = res.data.data;
        const index = this.teeTimeSearch.findIndex(
          (b) => b.id === updated.id
        );
        if (index !== -1) {
          this.teeTimeSearch[index] = updated;
        }
        return updated;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteTeeTime(id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.delete(`/tee-time/delete/${id}`);
        return res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async holdTeeTime({param}) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/tee-time/hold`, {
          params: param,
        });
        const holdTeeTime = res.data.data;
        const index = this.availableTeeTimes.findIndex((t) => t.id === holdTeeTime.id);
        if (index !== -1) {
          this.availableTeeTimes[index] = holdTeeTime;
        }
        return res.data.data;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // Search tee time
    async searchTeeTime(request) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.post("/tee-time/search", request);
        this.teeTimeSearch = res.data.data.data;
        this.pagination = res.data.data.pagination;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
