<template>
  <div class="unauthorized">
    <h1>403 - Bạn không có quyền truy cập</h1>
    <router-link to="/">Quay về trang chủ</router-link>
  </div>
</template>

<script setup>
// Không cần gì đặc biệt
</script>

<style scoped>
.unauthorized {
  text-align: center;
  margin-top: 100px;
}
</style>
