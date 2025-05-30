<template>
  <div id="app">
    <BaseNotification
      :show="showNotification"
      :message="notificationMessage"
      :status="notificationStatus"
    />
    <router-view />
    <!-- Đây là nơi hiển thị nội dung của các trang -->
  </div>
</template>

<script setup>
import { ref, provide } from "vue";
import BaseNotification from "./components/BaseNotification.vue";

// Notification state
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationStatus = ref("success"); // 'success' | 'error'

// Global notification function
function showToast(message, status = "success") {
  notificationMessage.value = message;
  notificationStatus.value = status;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

// Provide the notification function for all child components
provide("showToast", showToast);
</script>
