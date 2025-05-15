import { defineStore } from 'pinia'
import api from '../api'  // Đường dẫn tới file axios instance

export const useGolfCourseStore = defineStore('golfCourse', {
  state: () => ({
    golfCourses: [],
    golfCourseDetail: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createGolfCourse(request) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/golf-course', request)
        this.golfCourses.push(res.data.data) // Thêm golf course mới vào danh sách
        return res.data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateGolfCourse(id, request) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/golf-course/${id}`, request)
        const updated = res.data.data
        const index = this.golfCourses.findIndex(b => b.id === updated.id)
        if (index !== -1) {
          this.golfCourses[index] = updated
        }
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async getAllGolfCourses() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/golf-course/all')
        console.log(res.data.data)
        this.golfCourses = res.data.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async getGolfCourseById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await api.get(`/golf-course/${id}`)
        this.golfCourseDetail = res.data.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
