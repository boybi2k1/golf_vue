<template>
  <header class="bg-emerald-700 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <Flag class="w-6 h-6" />
        <h1 class="text-xl font-bold">Golf Course Manager</h1>
      </div>

      <!-- Notification + User -->
      <div class="flex items-center space-x-4">
        <!-- Notifications -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-1 rounded-full hover:bg-emerald-600 focus:outline-none relative"
          >
            <Bell class="w-6 h-6" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            >
              {{ unreadCount }}
            </span>
          </button>
          <!-- Notification Dropdown -->
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-white rounded-md shadow-lg py-1 z-10"
          >
            <div class="px-4 py-2 text-sm text-gray-700 border-b">
              <p class="font-semibold text-gray-900">Thông báo</p>
            </div>
            <div
              v-if="notifications.length === 0"
              class="px-4 py-2 text-sm text-gray-500"
            >
              Không có thông báo.
            </div>
            <ul>
              <li
                v-for="(notif, index) in notifications"
                :key="index"
                class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b"
              >
                <p class="font-semibold">{{ notif.title }}</p>
                <p class="text-sm text-gray-600">{{ notif.content }}</p>
              </li>
            </ul>
          </div>
        </div>

        <!-- User Menu -->
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <img
              :src="URL_IMAGE + user?.avatar"
              alt="User"
              class="w-8 h-8 rounded-full border-2 border-emerald-300"
            />
            <span class="hidden md:inline">{{ user?.fullName }}</span>
          </button>
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <a
              @click="handleProfile"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Hồ sơ</a
            >
            <a
              @click="logout($event)"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Đăng xuất</a
            >
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Flag, Bell } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";
import router from "../router";
import { BASE_URL, URL_IMAGE } from "../api";
import { on } from "process";
import { storeToRefs } from "pinia";

// UI state
const showNotifications = ref(false);
const showUserMenu = ref(false);

// Notification state
const notifications = ref([]);
const unreadCount = ref(0);

// Auth
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// Toggle
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    showUserMenu.value = false;
    unreadCount.value = 0; // reset đếm khi mở
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showNotifications.value = false;
  }
};

// SSE
let eventSource = null;

onMounted(() => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  eventSource = new EventSource(
    `${BASE_URL}/notifications/subscribe/${userId}`
  );
  console.log("Connecting to SSE for notifications...");

  eventSource.onopen = () => {
    console.log("Connection to SSE opened.");
  };

  eventSource.onmessage = (event) => {
    console.log("Notification received:", event.data);
    const notification = JSON.parse(event.data);
    notifications.value.unshift(notification);
    if (notifications.value.length > 10) {
      notifications.value.pop(); // giới hạn 10 thông báo gần nhất
    }
    unreadCount.value += 1;
  };

  eventSource.onerror = (error) => {
    console.error("EventSource error:", error);
    // Optional: tự động reconnect nếu muốn
    if (eventSource.readyState === EventSource.CLOSED) {
      console.log("Reconnecting to SSE...");
      eventSource = new EventSource(
        `${BASE_URL}/notifications/subscribe/${userId}`
      );
    }
  };
});

onBeforeUnmount(() => {
  if (eventSource) {
    eventSource.close();
  }
});

onMounted(() => {
  authStore.fetchUser();
});

// Logout
const logout = (e) => {
  e.preventDefault();
  authStore.logout();
  window.location.href = "/login";
};

// Profile
const handleProfile = (e) => {
  if (e && typeof e.preventDefault === "function") e.preventDefault();
  const user = authStore.user;
  if (user && user.role && user.role.toLowerCase() === "member") {
    router.push("/profile");
  } else {
    router.push("/admin/profile");
  }
};
</script>

<style scoped>
/* Optional: bạn có thể thêm hiệu ứng dropdown hoặc scrollbar tùy ý */
</style>
