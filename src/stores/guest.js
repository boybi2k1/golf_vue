import { defineStore } from "pinia";
import api from "../api";

export const useGuestStore = defineStore("guest", {
  state: () => ({
    guests: [],
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
    // Lấy thông tin guest theo ID
    async getGuestById(id) {
      try {
        this.loading = true;
        const res = await api.get(`/guest/${id}`);
        return res.data.data; // Trả về dữ liệu của guest
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    //upadae guest
    async updateGuest(id, payload) {
      try {
        this.loading = true;
        const res = await api.put(`/guest/update/${id}`, payload);
        const updatedGuest = res.data.data;
        const index = this.guests.findIndex((guest) => guest.id === updatedGuest.id);
        if (index !== -1) {
          this.guests[index] = updatedGuest; // Cập nhật thông tin guest trong danh sách
        }
        return updatedGuest; // Trả về guest đã cập nhật
      }
      catch (err) {
        this.error = err.message;
      }
      finally {
        this.loading = false;
      }
    },

    // Tìm kiếm guest
    async searchGuest(payload) {
      try {
        this.loading = true;
        const res = await api.post("/guest/search", payload);
        this.guests = res.data.data.data;
        this.pagination = res.data.data.pagination; // Cập nhật phân trang
        // Cập nhật danh sách khách hàng
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Xóa guest theo ID
    async deleteGuest(id) {
      try {
        this.loading = true;
        await api.delete(`/guest/${id}`);
        this.guests = this.guests.filter((guest) => guest.id !== id); // Loại bỏ guest khỏi danh sách
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    //get by userId
    async getGuestByUserId(userId) {
      try {
        this.loading = true;
        const res = await api.get(`/guest/get-by-user/${userId}`);
        return res.data.data; // Trả về dữ liệu của guest
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
