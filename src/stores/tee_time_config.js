import { defineStore } from 'pinia'
import api from '../api'

export const useTeeTimeConfigStore = defineStore('teeTimeConfig', {
  state: () => ({
    teeTimeConfigs: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTeeTimeConfigActive() {
      this.loading = true
      this.error = null
      try {
        const res = await api.get('/tee-time-config/active')
        this.teeTimeConfigs = res.data.data
        console.log('Tee Time Configs:', this.teeTimeConfigs)
        return this.teeTimeConfigs
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
        this.teeTimeConfigs.push(res.data.data)
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
        const updatedConfig = res.data.data
        const index = this.teeTimeConfigs.findIndex(config => config.id === updatedConfig.id)
        if (index !== -1) {
          this.teeTimeConfigs[index] = updatedConfig
        }
        return updatedConfig
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
        const deletedConfig = res.data.data
        const index = this.teeTimeConfigs.findIndex(config => config.id === deletedConfig.id)
        if (index !== -1) {
          this.teeTimeConfigs.splice(index, 1)
        }
        return deletedConfig
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
