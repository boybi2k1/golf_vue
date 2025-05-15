// stores/bookingStore.js
import { defineStore } from "pinia";
import api from "../api";

export const useBookingStore = defineStore("booking", {
  state: () => ({
    bookings: [],
    bookingDetail: null,
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  }),

  actions: {
    async createBooking(payload) {
      try {
        this.loading = true;
        const res = await api.post("/booking/create", payload);
        this.bookings.push(res.data.data);
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateBooking(bookingId, payload) {
      try {
        this.loading = true;
        const res = await api.put(`/booking/${bookingId}`, payload);
        const updated = res.data.data;
        const index = this.bookings.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          this.bookings[index] = updated;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async searchBooking(payload) {
      try {
        this.loading = true;
        const res = await api.post("/booking/search", payload);
        this.bookings = res.data.data.data;
        this.pagination = res.data.data.pagination;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async changeStatus(payload) {
      try {
        this.loading = true;
        const res = await api.post("/booking/change-status", payload);
        const updated = res.data.data;
        const index = this.bookings.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          this.bookings[index] = updated;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async checkOut(payload) {
      try {
        this.loading = true;
        const res = await api.post("/booking/check-out", payload);
        const updated = res.data.data;
        const index = this.bookings.findIndex((b) => b.id === updated.id);
        if (index !== -1) {
          this.bookings[index] = updated;
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
