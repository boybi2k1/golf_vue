<template>
  <header class="bg-emerald-700 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex justify-between items-center">
      <div class="flex items-center space-x-2">
        <Flag class="w-6 h-6" />
        <h1 class="text-xl font-bold">Golf Course Manager</h1>
      </div>
      <div class="flex items-center space-x-4">
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-1 rounded-full hover:bg-emerald-600 focus:outline-none"
          >
            <Bell class="w-6 h-6" />
          </button>
          <div
            v-if="showNotifications"
            class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <div class="px-4 py-2 text-sm text-gray-700 border-b">
              <p class="font-semibold text-gray-900">Notifications</p>
            </div>
          s</div>
        </div>
        <div class="relative">
          <button
            @click="toggleUserMenu"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src="https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/user.png"
              alt="User"
              class="w-8 h-8 rounded-full border-2 border-emerald-300"
            />
            <span class="hidden md:inline">Admin</span>
          </button>
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Your Profile</a
            >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Settings</a
            >
            <a
              @click="logout($event)"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >Sign out</a
            >
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { Flag, Bell } from "lucide-vue-next";
import { useAuthStore } from "../stores/auth";

const showNotifications = ref(false);
const showUserMenu = ref(false);
const authStore = useAuthStore();
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    showUserMenu.value = false;
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) {
    showNotifications.value = false;
  }
};

const logout = (e) => {
  e.preventDefault();
  authStore.logout();
  window.location.href = "/login";
};
</script>
