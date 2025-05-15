import { defineStore } from 'pinia'
import api from "../api"

export const useTeeTimeStore = defineStore('teeTime', {
  state: () => ({
    availableTeeTimes: [], // Danh sách giờ tee có sẵn
    loading: false,        // Trạng thái loading
    error: null            // Lỗi khi gọi API
  }),

  actions: {
    // Lấy giờ tee có sẵn
    async getAvailableTeeTimes(golfCourseId, date) {
      try {
        this.loading = true
        const res = await api.get('/tee-time/available', {
          params: {
            golfCourseId,
            date
          }
        })
        this.availableTeeTimes = res.data.data // Cập nhật danh sách giờ tee có sẵn
      } catch (err) {
        this.error = err.message // Lưu lỗi nếu có
      } finally {
        this.loading = false
      }
    }
  }
})
