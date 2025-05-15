// stores/userStore.js
import { defineStore } from "pinia";
import api from "../api";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
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
    async createStaff(payload) {
      try {
        this.loading = true;
        const res = await api.post("/user/create-staff", payload); // Đổi endpoint nếu cần
        this.users.push(res.data.data); // Thêm người dùng mới vào danh sách
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId, payload) {
      try {
        this.loading = true;
        const res = await api.put(`/user/${userId}`, payload); // Endpoint sửa user theo ID
        const updated = res.data.data;
        const index = this.users.findIndex((u) => u.id === updated.id); // Tìm vị trí user cần cập nhật
        if (index !== -1) {
          this.users[index] = updated; // Cập nhật người dùng trong danh sách
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      try {
        this.loading = true;
        const res = await api.delete(`/user/${userId}`); // Gọi API để xóa người dùng
        const index = this.users.findIndex((u) => u.id === userId); // Tìm vị trí user cần xóa
        if (index !== -1) {
          this.users.splice(index, 1); // Xóa người dùng khỏi danh sách
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async searchUsers(payload) {
      try {
        this.loading = true;
        const res = await api.post("/user/search", payload); // Gọi API tìm kiếm người dùng
        this.users = res.data.data.data; // Cập nhật danh sách người dùng
        this.pagination = res.data.data.pagination; // Cập nhật phân trang
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    async getUserById(userId) {
      try {
        const res = await api.get(`/user/${userId}`); // Gọi API lấy thông tin người dùng theo ID
        return res.data.data;
      } catch (err) {
        this.error = err.message;
      }
    },

    async getUserByEmail(email) {
      try {
        const res = await api.get(`/user/email/${email}`); // Gọi API lấy người dùng theo email
        return res.data.data;
      } catch (err) {
        this.error = err.message;
      }
    },
  },
});
