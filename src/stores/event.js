// src/stores/event.js
import { defineStore } from "pinia";
import api from "../api";

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
    courses: [],
    pagination: { page: 1, size: 10, totalPages: 1, totalElements: 0 },
    loading: false,
    error: null,
  }),
  actions: {
    async searchEvent(filters) {
      this.loading = true;
      try {
        const res = await api.post("/event/search", filters);
        this.events = res.data.data.data;
        this.pagination = res.data.data.pagination;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async createEvent(payload) {
      this.loading = true;
      try {
        await api.post("/event", payload);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateEvent(id, payload) {
      this.loading = true;
      try {
        await api.put(`/event/${id}`, payload);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteEvent(id) {
      this.loading = true;
      try {
        await api.delete(`/event/${id}`);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
});