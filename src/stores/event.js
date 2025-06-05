// src/stores/event.js
import { defineStore } from "pinia";
import api from "../api";

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
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
    async createEvent(formData) {
      this.loading = true;
      try {
        const res = await api.post("/event/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.events.push(res.data.data);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async updateEvent(id, payload) {
      this.loading = true;
      try {
        await api.put(`/event/update/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteEvent(id) {
      this.loading = true;
      try {
        await api.delete(`/event/delete/${id}`);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // get event for user
    async getEventForUser(request) {
      this.loading = true;
      try {
        const res = await api.post("/event/for-user", request);
        this.eventForUser = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
