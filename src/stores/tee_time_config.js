import { defineStore } from 'pinia'
import api from '../api'

export const useTeeTimeConfigStore = defineStore('teeTimeConfig', {
  state: () => ({
    activeConfig: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchActiveConfig() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/tee-time-config/active')
        this.activeConfig = res.data.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async createConfig(requestData) {
      this.loading = true
      this.error = null
      try {
        const res = await api.post('/tee-time-config/create', requestData)
        return res.data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateConfig(id, requestData) {
      this.loading = true
      this.error = null
      try {
        const res = await api.put(`/tee-time-config/${id}`, requestData)
        return res.data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteConfig(id) {
      this.loading = true
      this.error = null
      try {
        const res = await api.delete(`/tee-time-config/${id}`)
        return res.data.data
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
