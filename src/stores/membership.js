import { defineStore } from "pinia";
import api from "../api";

export const useMembershipStore = defineStore("membership", {
  state: () => ({
    memberships: [],
    membership: null,
    membershipCurrent: null,
    history: [],
    pagination: {
      page: 1,
      size: 10,
      totalPages: 1,
      totalElements: 0,
    },
    loading: false,
    error: null,
  }),
  actions: {
    async getMembership(id) {
      this.loading = true;
      try {
        const res = await api.get(`/membership/${id}`);
        this.membership = res.data.data;
        return this.membership;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async registerMembership(payload) {
      this.loading = true;
      try {
        const res = await api.post("/membership/register", payload);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async lockMembership(membershipId) {
      this.loading = true;
      try {
        const res = await api.post(`/membership/lock/${membershipId}`);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async confirmMembership(membershipId) {
      this.loading = true;
      try {
        const res = await api.post(`/membership/confirm/${membershipId}`);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async cancelMembership(membershipId) {
      this.loading = true;
      try {
        const res = await api.post(`/membership/cancel/${membershipId}`);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async renewMembership(membershipId) {
      this.loading = true;
      try {
        const res = await api.post(`/membership/renew/${membershipId}`);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async getMembershipHistory(userId) {
      this.loading = true;
      try {
        const res = await api.get(`/membership/history/${userId}`);
        this.history = res.data.data;
        return this.history;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async searchMembership(payload) {
      this.loading = true;
      try {
        const res = await api.post("/membership/search", payload);
        this.memberships = res.data.data.data;
        console.log(this.memberships);
        this.pagination = res.data.data.pagination;
        return this.memberships;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async softDeleteMembership(id) {
      this.loading = true;
      try {
        const res = await api.delete(`/membership/${id}`);
        return res.data.data;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // lấy membership hiện tại của người dùng
    async getCurrentMembership({ param }) {
      this.loading = true;
      try {
        const res = await api.get(`/membership/user-status`, {
          params: param,
        });
        this.membershipCurrent = res.data.data;
        return this.membershipCurrent;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
