<template>
  <header
    class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-10"
  >
    <!-- Left section with toggle button for mobile -->
    <div class="flex items-center">
      <button
        @click="toggleMobileSidebar"
        class="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
      >
        <MenuIcon class="h-6 w-6" />
      </button>
      <div class="flex items-center">
        <h1 class="text-xl font-semibold text-gray-800">Golf 18</h1>
        <!-- <span
          v-if="showLocationBadge"
          class="ml-3 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
        >
          {{ currentLocation }}
        </span> -->
      </div>
    </div>

    <!-- Right section with search, notifications and user menu -->
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="text-gray-500 hover:text-gray-700 focus:outline-none relative"
        >
          <BellIcon class="h-6 w-6" />
          <span
            class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs"
          >
            3
          </span>
        </button>

        <!-- Dropdown notifications -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
        >
          <div
            class="px-4 py-2 border-b border-gray-100 flex justify-between items-center"
          >
            <h3 class="font-medium text-gray-800">Thông báo</h3>
            <button class="text-xs text-green-600 hover:text-green-700">
              Đánh dấu đã đọc
            </button>
          </div>

          <div class="max-h-80 overflow-y-auto">
            <div
              v-for="(notification, index) in notifications"
              :key="index"
              class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div class="flex">
                <div class="flex-shrink-0 mr-3">
                  <div
                    :class="`h-8 w-8 rounded-full flex items-center justify-center ${notification.iconBg}`"
                  >
                    <component
                      :is="notification.icon"
                      class="h-4 w-4 text-white"
                    />
                  </div>
                </div>
                <div>
                  <p class="text-sm text-gray-800">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ notification.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="px-4 py-2 border-t border-gray-100 text-center">
            <button class="text-sm text-green-600 hover:text-green-700">
              Xem tất cả thông báo
            </button>
          </div>
        </div>
      </div>

      <!-- User dropdown -->
      <div class="relative">
        <button
          @click="toggleUserMenu"
          class="flex items-center space-x-2 focus:outline-none"
        >
          <img
            src="https://randomuser.me/api/portraits/men/1.jpg"
            alt="User avatar"
            class="h-8 w-8 rounded-full border-2 border-green-500"
          />
          <span class="hidden md:block text-sm font-medium text-gray-700"
            >Nguyễn Văn A</span
          >
          <ChevronDownIcon class="h-4 w-4 text-gray-500" />
        </button>

        <!-- Dropdown menu -->
        <div
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
        >
          <!-- <div class="px-4 py-2 border-b border-gray-100">
            <p class="text-sm font-medium text-gray-800">Nguyễn Văn A</p>
            <p class="text-xs text-green-600">VIP Member</p>
          </div>
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
            >Thông tin cá nhân</a
          >
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
            >Lịch đặt sân</a
          > -->
          <a
            href="#"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
            >Cài đặt</a
          >
          <div class="border-t border-gray-200 my-1"></div>
          <a
            href="/login"
            class="block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >Đăng xuất</a
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
  Menu as MenuIcon,
  Bell as BellIcon,
  // Search as SearchIcon,
  ChevronDown as ChevronDownIcon,
  CloudSun,
  Calendar,
  Trophy,
  AlertCircle,
} from "lucide-vue-next";

const route = useRoute();
const isUserMenuOpen = ref(false);
const showNotifications = ref(false);

// Emit event for mobile sidebar toggle
const emit = defineEmits(["toggle-mobile-sidebar"]);

const toggleMobileSidebar = () => {
  emit("toggle-mobile-sidebar");
};

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value;
  if (isUserMenuOpen.value) showNotifications.value = false;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) isUserMenuOpen.value = false;
};

// Close menus when clicking outside
const closeMenus = (event) => {
  if (isUserMenuOpen.value && !event.target.closest(".relative")) {
    isUserMenuOpen.value = false;
  }
  if (showNotifications.value && !event.target.closest(".relative")) {
    showNotifications.value = false;
  }
};

// Add event listener for clicks outside
onMounted(() => {
  window.addEventListener("click", closeMenus);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeMenus);
});

// Page title based on current route
const pageTitle = computed(() => {
  const path = route.path;
  if (path.includes("/booking")) return "Đặt sân Golf";
  if (path.includes("/events")) return "Sự kiện Golf";
  if (path.includes("/history")) return "Lịch sử chơi";
  if (path.includes("/profile")) return "Thông tin cá nhân";
  return "Golf thủ";
});

// Show location badge on booking page
const showLocationBadge = computed(() => {
  return route.path.includes("/booking");
});

// Current location
const currentLocation = "Hà Nội";

// Sample notifications
const notifications = [
  {
    icon: Calendar,
    iconBg: "bg-green-500",
    message:
      "Đặt sân thành công tại Kings Island Golf Resort vào ngày 20/05/2025",
    time: "10 phút trước",
  },
  {
    icon: Trophy,
    iconBg: "bg-yellow-500",
    message:
      "Bạn đã được mời tham gia giải đấu Golf Charity tại Vinpearl Golf Nam Hội An",
    time: "2 giờ trước",
  },
  {
    icon: AlertCircle,
    iconBg: "bg-red-500",
    message:
      "Lịch đặt sân của bạn tại Long Thanh Golf Club đã bị hủy do thời tiết xấu",
    time: "1 ngày trước",
  },
];
</script>

<style scoped>
/* Tùy chỉnh scrollbar cho dropdown notifications */
.max-h-80::-webkit-scrollbar {
  width: 4px;
}

.max-h-80::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-80::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.max-h-80::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
