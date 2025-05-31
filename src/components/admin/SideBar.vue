<template>
  <div class="w-64 bg-white h-screen border-r border-gray-200 overflow-y-auto">
    <!-- Sidebar navigation -->
    <nav class="p-2">
      <ul class="space-y-0.5">
        <li v-for="item in navItems" :key="item.id">
          <a
            href="#"
            @click.prevent="setActiveItem(item.id)"
            :class="{
              'flex items-center py-3 px-4 rounded-md transition-colors': true,
              'bg-emerald-50 text-emerald-700 font-medium':
                activeItem === item.id,
              'text-gray-700 hover:bg-gray-100': activeItem !== item.id,
            }"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{{ item.label }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  Map,
  Bell,
  Users,
  Settings,
  ShoppingBag,
  Hammer,
  CreditCard,
  BarChart2,
  Wrench,
} from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { checkAdminRole } from "../../utils/format";

const activeItem = ref("dashboard");
const emit = defineEmits(["update:activeItem"]);
const router = useRouter();
const route = useRoute();

const isAdmin = checkAdminRole();

const navItemsAdmin = [
  { id: "booking", label: "Đặt Lịch", icon: Calendar },
  { id: "course-management", label: "Quản Lý Sân", icon: Map },
  { id: "event-management", label: "Quản Lý Sự Kiện", icon: Bell },
  { id: "member-management", label: "Quản Lý Hội Viên", icon: Users },
  { id: "user", label: "Quản Lý Người Dùng", icon: Settings },
  { id: "services", label: "Quản Lý Dịch Vụ", icon: ShoppingBag },
  { id: "tools", label: "Quản Lý Trang Thiết Bị", icon: Hammer },
  { id: "payments", label: "Quản Lý Thanh Toán", icon: CreditCard },
  { id: "tee-time", label: "Quản Lý Thời Gian Đặt", icon: CalendarCheck },
  { id: "account", label: "Quản Lý Tài Khoản", icon: Users },
  { id: "reports", label: "Báo Cáo Thống Kê", icon: BarChart2 },
  { id: "system-settings", label: "Cài Đặt Hệ Thống", icon: Wrench },
];
const navItemsStaff = [
  { id: "booking", label: "Đặt Lịch", icon: Calendar },
  { id: "course-management", label: "Quản Lý Sân", icon: Map },
  { id: "event-management", label: "Quản Lý Sự Kiện", icon: Bell },
  { id: "member-management", label: "Quản Lý Hội Viên", icon: Users },
  { id: "user", label: "Quản Lý Người Dùng", icon: Settings },
  { id: "services", label: "Quản Lý Dịch Vụ", icon: ShoppingBag },
  { id: "tools", label: "Quản Lý Trang Thiết Bị", icon: Hammer },
  { id: "payments", label: "Quản Lý Thanh Toán", icon: CreditCard },
  { id: "tee-time", label: "Quản Lý Thời Gian Đặt", icon: CalendarCheck },
  { id: "system-settings", label: "Cài Đặt Hệ Thống", icon: Wrench },
];

const navItems = isAdmin ? navItemsAdmin : navItemsStaff;

function setActiveItem(itemId) {
  activeItem.value = itemId;
  emit("update:activeItem", itemId);
  router.push({ name: itemId }); // Navigate to the corresponding route
}

// Watch for route changes to update activeItem
watch(
  () => route.name,
  (newRouteName) => {
    activeItem.value = newRouteName; // Sync activeItem with the current route
  },
  { immediate: true } // Run immediately to set the initial active item
);
</script>
