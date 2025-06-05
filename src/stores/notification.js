import { defineStore } from "pinia";
import api from "../api"; // Đường dẫn tới file axios instance

export const useGolfCourseStore = defineStore("notifications", {
  state: () => ({
    notifiByUser: [],
    loading: false,
    error: null,
  }),
  actions: {
    async getNotifications() {
      this.loading = true;
      try {
        const res = await api.get("/notification/user");
        this.notifiByUser = res.data.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async markAsRead(notificationId) {
      this.loading = true;
      try {
        const res = await api.post(
          `/notification/mark-as-read/${notificationId}`
        );
        const index = this.notifiByUser.findIndex(
          (n) => n.id === notificationId
        );
        if (index !== -1) {
          this.notifiByUser[index].isRead = true; // Cập nhật trạng thái đã đọc
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async markAllAsRead() {
      this.loading = true;
      try {
        await api.post("/notification/mark-all-as-read");
        this.notifiByUser.forEach((n) => {
          n.isRead = true; // Cập nhật tất cả thông báo thành đã đọc
        });
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteNotification(notificationId) {
      this.loading = true;
      try {
        await api.delete(`/notification/${notificationId}`);
        this.notifiByUser = this.notifiByUser.filter(
          (n) => n.id !== notificationId
        ); // Xóa thông báo khỏi danh sách
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
