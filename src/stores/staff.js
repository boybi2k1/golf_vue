import { defineStore } from 'pinia'
import api from "../api"

export const useStaffStore = defineStore('staff', {
  state: () => ({
    staffList: [],
    pagination: {
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    },
    loading: false,
    error: null
  }),

  actions: {
    // Tạo mới một staff
    async createStaff(payload) {
      try {
        this.loading = true
        const res = await api.post('/staff', payload)
        this.staffList.push(res.data.data)  // Thêm staff mới vào danh sách
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Cập nhật thông tin staff theo ID
    async updateStaff(id, payload) {
      try {
        this.loading = true
        const res = await api.put(`/staff/update/${id}`, payload)
        const updatedStaff = res.data.data
        const index = this.staffList.findIndex(s => s.id === updatedStaff.id)
        if (index !== -1) {
          this.staffList[index] = updatedStaff  // Cập nhật thông tin staff trong danh sách
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Xóa staff theo ID
    async deleteStaff(id) {
      try {
        this.loading = true
        await api.delete(`/staff/delete/${id}`)
        this.staffList = this.staffList.filter(s => s.id !== id)  // Xóa staff khỏi danh sách
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    // Lấy thông tin staff theo ID
    async getStaffById(id) {
      try {
        this.loading = true
        const res = await api.get(`/staff/${id}`)
        return res.data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    // Tìm kiếm staff
    async searchStaff(payload) {
      try {
        this.loading = true
        const res = await api.post('/staff/search', payload)
        this.staffList = res.data.data.data
        this.pagination = res.data.data.pagination  // Cập nhật phân trang
        // Cập nhật danh sách staff
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
