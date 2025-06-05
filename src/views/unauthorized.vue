
<template>
  <div class="unauthorized">
    <h1 class="unauth-title">403</h1>
    <p class="unauth-message">Bạn không có quyền truy cập vào trang này.</p>
    <button class="unauth-btn" @click="goToLogin">Quay về trang đăng nhập</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
.unauthorized {
  text-align: center;
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.unauth-title {
  font-size: 5rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 10px;
}
.unauth-message {
  font-size: 1.5rem;
  margin-bottom: 32px;
  color: #555;
}
.unauth-btn {
  padding: 12px 32px;
  font-size: 1.1rem;
  background: #3498db;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.unauth-btn:hover {
  background: #217dbb;
}
</style>
