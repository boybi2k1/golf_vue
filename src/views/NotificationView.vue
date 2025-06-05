<template>
  <div class="container mx-auto p-4 max-w-xl">
    <h1 class="text-2xl font-bold mb-4">Thông báo của bạn</h1>

    <div class="mb-4 flex space-x-2">
      <button
        @click="filter = 'all'"
        :class="btnClass(filter === 'all')"
      >
        Tất cả
      </button>
      <button
        @click="filter = 'unread'"
        :class="btnClass(filter === 'unread')"
      >
        Chưa đọc
      </button>
    </div>

    <ul>
      <li
        v-for="(noti, index) in filteredNotifications"
        :key="index"
        @click="markAsRead(noti)"
        :class="[
          'p-4 mb-2 rounded shadow cursor-pointer',
          noti.read ? 'bg-gray-100' : 'bg-white font-semibold'
        ]"
      >
        <div class="flex justify-between">
          <div>
            <span class="text-sm text-gray-500 mr-2">
              {{ formatDate(noti.createdAt) }}
            </span>
            <span
              class="inline-block px-2 py-0.5 rounded text-xs font-medium"
              :class="notiTypeClass(noti.type)"
            >
              {{ notiTypeLabel(noti.type) }}
            </span>
          </div>
          <div>
            <span
              v-if="!noti.read"
              class="inline-block w-3 h-3 bg-red-500 rounded-full"
              title="Chưa đọc"
            ></span>
          </div>
        </div>
        <h3 class="mt-1">{{ noti.title }}</h3>
        <p class="text-gray-700 mt-1">{{ noti.content }}</p>
      </li>
    </ul>

    <div v-if="filteredNotifications.length === 0" class="text-center text-gray-500 mt-8">
      Không có thông báo nào.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Mẫu dữ liệu thông báo demo
const notifications = ref([
  {
    id: 1,
    title: "Thông báo hết hạn thành viên",
    content: "Thành viên của bạn sẽ hết hạn vào ngày 2025-06-15. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.",
    type: "MEMBERSHIP", // Golfer
    read: false,
    createdAt: "2025-06-01T10:30:00Z"
  },
  {
    id: 2,
    title: "Xác nhận đặt sân",
    content: "Bạn đã đặt sân thành công cho ngày 2025-06-05 lúc 8:00 sáng.",
    type: "BOOKING", // Golfer
    read: true,
    createdAt: "2025-05-30T08:00:00Z"
  },
  {
    id: 3,
    title: "Báo cáo doanh thu ngày 2025-05-31",
    content: "Doanh thu hôm qua tăng 15% so với bình thường.",
    type: "ADMIN_REPORT", // Admin/Staff
    read: false,
    createdAt: "2025-06-01T09:00:00Z"
  }
]);

const filter = ref("all");

const filteredNotifications = computed(() => {
  if (filter.value === "unread") {
    return notifications.value.filter(noti => !noti.read);
  }
  return notifications.value;
});

function markAsRead(noti) {
  if (!noti.read) {
    noti.read = true;
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function notiTypeLabel(type) {
  switch(type) {
    case "MEMBERSHIP": return "Thành viên";
    case "BOOKING": return "Đặt sân";
    case "ADMIN_REPORT": return "Quản trị";
    default: return "Khác";
  }
}

function notiTypeClass(type) {
  switch(type) {
    case "MEMBERSHIP": return "bg-green-200 text-green-800";
    case "BOOKING": return "bg-blue-200 text-blue-800";
    case "ADMIN_REPORT": return "bg-yellow-200 text-yellow-800";
    default: return "bg-gray-200 text-gray-800";
  }
}

function btnClass(active) {
  return [
    "px-3 py-1 rounded border",
    active ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-700 border-gray-300"
  ];
}
</script>

<style scoped>
li:hover {
  background-color: #d1fae5; /* Tailwind emerald-200 */
}
</style>
