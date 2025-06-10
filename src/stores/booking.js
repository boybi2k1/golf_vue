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
        const booking = res.data.data;
        this.bookings.push(booking);
        return booking;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async getBookingById(payload) {
      try {
        this.loading = true;
        const res = await api.get(`/booking/${payload}`);
        this.bookingDetail = res.data.data;
        return this.bookingDetail;
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
    // CHECK IN
    async checkIn({ param }) {
      try {
        console.log("checkIn param", param);
        this.loading = true;
        const res = await api.get("/booking/check-in", {
          params: param,
        });
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
    async checkOut({ param }) {
      try {
        this.loading = true;
        const res = await api.get("/booking/check-out", {
          params: param,
        });
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
    // add bookingdetail to booking
    async addBookingDetailToBooking(bookingId, data) {
      try {
        this.loading = true;
        const res = await api.post(
          `/booking-detail/booking/${bookingId}`,
          data
        );
        return res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    //get booking detail by booking id
    async getBookingDetailByBookingId(bookingId) {
      try {
        this.loading = true;
        const res = await api.get(`/booking-detail/booking/${bookingId}`);
        const bookingDetails = res.data.data;
        return bookingDetails;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
