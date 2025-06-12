import { defineStore } from "pinia";
import api from "../api";


export const useServicesStore = defineStore("services", {
  state: () => ({
    services: [],
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    },
    allServices: [],
    servicesForBooking: [],
    loading: false,
    error: null,
  }),

  actions: {
    // Tạo dịch vụ mới
    async createService(form) {
      try {
        this.loading = true;
        const res = await api.post("/services", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.services.push(res.data.data); // Thêm dịch vụ mới vào danh sách
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Cập nhật dịch vụ theo ID
    async updateService(id, payload) {
      try {
        this.loading = true;
        const res = await api.put(`/services/${id}`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const updatedService = res.data.data;
        const index = this.services.findIndex(
          (s) => s.id === updatedService.id
        );
        if (index !== -1) {
          this.services[index] = updatedService; // Cập nhật dịch vụ trong danh sách
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Tìm kiếm dịch vụ
    async searchServices(payload) {
      try {
        this.loading = true;
        const res = await api.post("/services/search", payload);
        this.services = res.data.data.data; // Cập nhật danh sách dịch vụ
        this.pagination = res.data.data.pagination; // Cập nhật phân trang
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Xóa dịch vụ
    async deleteService(id) {
      try {
        this.loading = true;
        const res = await api.delete(`/services/${id}`);
        this.services = this.services.filter((s) => s.id !== id); // Loại bỏ dịch vụ khỏi danh sách
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    // Lấy tất cả dịch vụ
    async getAllServices() {
      try {
        this.loading = true;
        const res = await api.get("/services/all");
        this.allServices = res.data.data; // Cập nhật danh sách tất cả dịch vụ
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // service for booking
    async getServiceForBooking(type) {
      try {
        this.loading = true;
        const res = await api.get(`/services/not-type?type=${type}`);
        this.servicesForBooking = res.data.data; // Cập nhật danh sách dịch vụ cho booking
        return this.servicesForBooking;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  },
});
