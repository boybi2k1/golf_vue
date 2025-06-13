import { defineStore } from "pinia";
import api from "../api";

export const useReportStore = defineStore("report", {
  state: () => ({
    totalBookings: 0,
    totalRevenue: 0,
    numberBookingByDate: [], 
    revenueByDate: [],       
    bookingCountAndRevenueByGolfCourse: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchTotalBookings({ startDate, endDate, golfCourseId }) {
      this.loading = true;
      try {
        const res = await api.get("/reports/total-bookings", {
          params: { startDate, endDate, golfCourseId },
        });
        this.totalBookings = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchTotalRevenue({ startDate, endDate, golfCourseId }) {
      this.loading = true;
      try {
        const res = await api.get("/reports/total-revenue", {
          params: { startDate, endDate, golfCourseId },
        });
        this.totalRevenue = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchNumberBookingByDate({ startDate, endDate, golfCourseId }) {
      this.loading = true;
      try {
        const res = await api.get("/reports/number-booking", {
          params: { startDate, endDate, golfCourseId },
        });
        this.numberBookingByDate = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchRevenueByDate({ startDate, endDate, golfCourseId }) {
      this.loading = true;
      try {
        const res = await api.get("/reports/revenue-by-date", {
          params: { startDate, endDate, golfCourseId },
        });
        this.revenueByDate = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchBookingCountAndRevenueByGolfCourse({ startDate, endDate }) {
      this.loading = true;
      try {
        const res = await api.get("/reports/booking-count-and-revenue-by-golf-course", {
          params: { startDate, endDate },
        });
        this.bookingCountAndRevenueByGolfCourse = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});