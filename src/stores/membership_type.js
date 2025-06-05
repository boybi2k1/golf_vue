import { defineStore } from 'pinia'
import api from '../api'

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
        const res = await api.get('/membership-type/all')
        console.log('Membership Types:', res.data.data)
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
        const res = await api.get(`/membership-type/${id}`)
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
        const res = await api.post('/membership-type/create', payload)
        this.membershipTypes.push(res.data.data) 
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
        const res = await api.put(`/membership-type/update/${id}`, payload)
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
        await api.delete(`/membership-type/delete/${id}`)
        this.membershipTypes = this.membershipTypes.filter(type => type.id !== id)
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
