import { defineStore } from 'pinia'
import axios from 'axios'

export const useMembershipTypeStore = defineStore('membershipType', {
  state: () => ({
    membershipTypes: [],
    selectedMembershipType: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getAllMembershipTypes() {
      this.loading = true
      try {
        const res = await axios.get('/api/v1/membership-type/all')
        this.membershipTypes = res.data.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async getMembershipTypeById(id) {
      this.loading = true
      try {
        const res = await axios.get(`/api/v1/membership-type/${id}`)
        this.selectedMembershipType = res.data.data
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    async createMembershipType(payload) {
      this.loading = true
      try {
        const res = await axios.post('/api/v1/membership-type/create', payload)
        this.membershipTypes.push(res.data.data) // hoặc refetch
        return res.data.data
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateMembershipType(id, payload) {
      this.loading = true
      try {
        const res = await axios.put(`/api/v1/membership-type/update/${id}`, payload)
        // Cập nhật lại danh sách nếu cần
        await this.getAllMembershipTypes()
        return res.data.data
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteMembershipType(id) {
      this.loading = true
      try {
        await axios.delete(`/api/v1/membership-type/delete/${id}`)
        this.membershipTypes = this.membershipTypes.filter(item => item.id !== id)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
