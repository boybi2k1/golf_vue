import { defineStore } from "pinia";
import api from "../api";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    paymentSearch: [],
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
    async searchPayment(payload) {
      try {
        this.loading = true;
        const res = await api.post("/payment/search", payload);
        this.paymentSearch = res.data.data.data;
        this.pagination = res.data.data.pagination;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // create payment
    async createPaymentVnpay(payload) {
      try {
        this.loading = true;
        const res = await api.post("/payment/vn-pay", payload);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw new Error("Tạo thanh toán thất bại");
      } finally {
        this.loading = false;
      }
    },
   async createPayment(payload) {
      try {
        this.loading = true;
        const res = await api.post("/payment/create", payload);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw new Error("Tạo thanh toán thất bại");
      } finally {
        this.loading = false;
      }
    },
  },
});
