<template>
  <div
    class="sidebar-container h-screen bg-white border-r border-gray-200 w-64 flex flex-col transition-all duration-300"
    :class="{ 'w-20': collapsed }"
  >
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-1 px-2">
        <li v-for="(item, index) in menuItems" :key="index">
          <router-link
            :to="item.path"
            class="flex items-center px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
            :class="{
              'justify-center': collapsed,
              'bg-green-50 text-green-700': isActive(item.path),
            }"
          >
            <component :is="item.icon" class="h-5 w-5" />
            <span v-if="!collapsed" class="ml-3">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import {
  Calendar,
  CalendarClock,
  History,
  User,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronRight as GolfIcon,
} from "lucide-vue-next";

const collapsed = ref(false);
const route = useRoute();

const menuItems = [
  {
    title: "Đặt sân",
    path: "/booking",
    icon: Calendar,
  },
  {
    title: "Sự kiện",
    path: "/events",
    icon: CalendarClock,
  },
  {
    title: "Lịch sử chơi",
    path: "/history",
    icon: History,
  },
  {
    title: "Thông tin cá nhân",
    path: "/profile",
    icon: User,
  },
];

const isActive = (path) => {
  return route.path === path || (path !== "/" && route.path.startsWith(path));
};

const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};
</script>

<style scoped>
.sidebar-container {
  transition: width 0.3s ease;
}

/* Tùy chỉnh scrollbar */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
