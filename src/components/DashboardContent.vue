<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Bảng Điều Khiển</h1>
      <div class="flex gap-2">
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
        <select
          v-model="dateRange"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          @change="updateDashboard"
        >
          <option value="today">Hôm nay</option>
          <option value="yesterday">Hôm qua</option>
          <option value="week">7 ngày qua</option>
          <option value="month">30 ngày qua</option>
          <option value="year">Năm nay</option>
        </select>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500">Tổng doanh thu</p>
            <h3 class="text-2xl font-bold text-green-700">
              {{ formatCurrency(stats.totalRevenue) }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              <span
                :class="
                  stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ stats.revenueChange >= 0 ? "+" : ""
                }}{{ stats.revenueChange }}%
              </span>
              so với kỳ trước
            </p>
          </div>
          <div class="p-2 bg-green-100 rounded-lg">
            <DollarSignIcon class="w-6 h-6 text-green-700" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500">Lượt đặt sân</p>
            <h3 class="text-2xl font-bold text-blue-700">
              {{ stats.totalBookings }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              <span
                :class="
                  stats.bookingsChange >= 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ stats.bookingsChange >= 0 ? "+" : ""
                }}{{ stats.bookingsChange }}%
              </span>
              so với kỳ trước
            </p>
          </div>
          <div class="p-2 bg-blue-100 rounded-lg">
            <CalendarIcon class="w-6 h-6 text-blue-700" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500">Hội viên mới</p>
            <h3 class="text-2xl font-bold text-purple-700">
              {{ stats.newMembers }}
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              <span
                :class="
                  stats.membersChange >= 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ stats.membersChange >= 0 ? "+" : ""
                }}{{ stats.membersChange }}%
              </span>
              so với kỳ trước
            </p>
          </div>
          <div class="p-2 bg-purple-100 rounded-lg">
            <UsersIcon class="w-6 h-6 text-purple-700" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-500">Tỷ lệ lấp đầy</p>
            <h3 class="text-2xl font-bold text-orange-700">
              {{ stats.occupancyRate }}%
            </h3>
            <p class="text-xs text-gray-500 mt-1">
              <span
                :class="
                  stats.occupancyChange >= 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ stats.occupancyChange >= 0 ? "+" : ""
                }}{{ stats.occupancyChange }}%
              </span>
              so với kỳ trước
            </p>
          </div>
          <div class="p-2 bg-orange-100 rounded-lg">
            <PercentIcon class="w-6 h-6 text-orange-700" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <!-- Revenue Chart -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            Doanh thu theo thời gian
          </h2>
          <select
            v-model="revenueChartType"
            class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="daily">Theo ngày</option>
            <option value="weekly">Theo tuần</option>
            <option value="monthly">Theo tháng</option>
          </select>
        </div>
        <div class="h-64">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>

      <!-- Bookings Chart -->
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">
            Lượt đặt sân theo thời gian
          </h2>
          <select
            v-model="bookingsChartType"
            class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="daily">Theo ngày</option>
            <option value="weekly">Theo tuần</option>
            <option value="monthly">Theo tháng</option>
          </select>
        </div>
        <div class="h-64">
          <canvas ref="bookingsChart"></canvas>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <!-- Member Distribution -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Phân bố hội viên</h2>
        <div class="h-64">
          <canvas ref="memberChart"></canvas>
        </div>
      </div>

      <!-- Weather Widget -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Thời tiết sân golf
        </h2>
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="flex justify-center mb-2">
              <CloudSunIcon
                v-if="weather.condition === 'partly_cloudy'"
                class="w-16 h-16 text-yellow-500"
              />
              <SunIcon
                v-else-if="weather.condition === 'sunny'"
                class="w-16 h-16 text-yellow-500"
              />
              <CloudRainIcon
                v-else-if="weather.condition === 'rainy'"
                class="w-16 h-16 text-blue-500"
              />
              <CloudIcon v-else class="w-16 h-16 text-gray-500" />
            </div>
            <h3 class="text-3xl font-bold text-gray-900">
              {{ weather.temperature }}°C
            </h3>
            <p class="text-gray-600 mb-2">{{ weather.description }}</p>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-500">Độ ẩm</p>
                <p class="font-medium">{{ weather.humidity }}%</p>
              </div>
              <div>
                <p class="text-gray-500">Gió</p>
                <p class="font-medium">{{ weather.wind }} km/h</p>
              </div>
              <div>
                <p class="text-gray-500">Tầm nhìn</p>
                <p class="font-medium">{{ weather.visibility }} km</p>
              </div>
              <div>
                <p class="text-gray-500">Chỉ số UV</p>
                <p class="font-medium">{{ weather.uvIndex }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Status -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Tình trạng sân</h2>
        <div class="space-y-4">
          <div
            v-for="course in courses"
            :key="course.id"
            class="flex justify-between items-center"
          >
            <div>
              <h3 class="font-medium text-gray-900">{{ course.name }}</h3>
              <p class="text-sm text-gray-500">{{ course.holes }} hố</p>
            </div>
            <div>
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-green-100 text-green-800': course.status === 'open',
                  'bg-red-100 text-red-800': course.status === 'closed',
                  'bg-yellow-100 text-yellow-800':
                    course.status === 'maintenance',
                }"
              >
                {{ getCourseStatusText(course.status) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Recent Activities -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          Hoạt động gần đây
        </h2>
        <div class="space-y-4">
          <div
            v-for="(activity, index) in recentActivities"
            :key="index"
            class="flex items-start"
          >
            <div
              class="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3"
              :class="getActivityIconBg(activity.type)"
            >
              <UserIcon
                v-if="activity.type === 'member'"
                class="h-4 w-4 text-white"
              />
              <CalendarIcon
                v-else-if="activity.type === 'booking'"
                class="h-4 w-4 text-white"
              />
              <DollarSignIcon
                v-else-if="activity.type === 'payment'"
                class="h-4 w-4 text-white"
              />
              <PartyPopperIcon
                v-else-if="activity.type === 'event'"
                class="h-4 w-4 text-white"
              />
              <SettingsIcon v-else class="h-4 w-4 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.description }}
              </p>
              <p class="text-xs text-gray-500">
                {{ formatDateTime(activity.timestamp) }}
              </p>
            </div>
            <span class="text-xs text-gray-500">{{
              getTimeAgo(activity.timestamp)
            }}</span>
          </div>
          <div
            v-if="recentActivities.length === 0"
            class="text-center text-gray-500 py-4"
          >
            Không có hoạt động nào gần đây
          </div>
        </div>
        <div class="mt-4 text-center">
          <button class="text-sm text-green-700 hover:text-green-800">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h2>
        <div class="grid grid-cols-2 gap-3">
          <button
            class="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <CalendarPlusIcon class="h-6 w-6 text-green-700 mb-1" />
            <span class="text-sm text-gray-900">Đặt sân</span>
          </button>
          <button
            class="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <UserPlusIcon class="h-6 w-6 text-blue-700 mb-1" />
            <span class="text-sm text-gray-900">Thêm hội viên</span>
          </button>
          <button
            class="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <ReceiptIcon class="h-6 w-6 text-purple-700 mb-1" />
            <span class="text-sm text-gray-900">Thanh toán</span>
          </button>
          <button
            class="flex flex-col items-center justify-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <PartyPopperIcon class="h-6 w-6 text-orange-700 mb-1" />
            <span class="text-sm text-gray-900">Tạo sự kiện</span>
          </button>
          <button
            class="flex flex-col items-center justify-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FileBarChart2Icon class="h-6 w-6 text-red-700 mb-1" />
            <span class="text-sm text-gray-900">Báo cáo</span>
          </button>
          <button
            class="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <SettingsIcon class="h-6 w-6 text-gray-700 mb-1" />
            <span class="text-sm text-gray-900">Cài đặt</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import {
  RefreshCwIcon,
  DollarSignIcon,
  CalendarIcon,
  UsersIcon,
  PercentIcon,
  CloudSunIcon,
  SunIcon,
  CloudRainIcon,
  CloudIcon,
  UserIcon,
  PartyPopperIcon,
  SettingsIcon,
  CalendarPlusIcon,
  UserPlusIcon,
  ReceiptIcon,
  FileBarChart2Icon,
} from "lucide-vue-next";
import Chart from "chart.js/auto";

// State
const dateRange = ref("week");
const revenueChartType = ref("daily");
const bookingsChartType = ref("daily");
const revenueChart = ref(null);
const bookingsChart = ref(null);
const memberChart = ref(null);
let revenueChartInstance = null;
let bookingsChartInstance = null;
let memberChartInstance = null;

// Mock data
const stats = reactive({
  totalRevenue: 125000000,
  revenueChange: 12.5,
  totalBookings: 248,
  bookingsChange: 8.3,
  newMembers: 15,
  membersChange: 5.2,
  occupancyRate: 78,
  occupancyChange: -2.1,
});

const weather = reactive({
  temperature: 28,
  condition: "partly_cloudy",
  description: "Có mây, trời nắng nhẹ",
  humidity: 65,
  wind: 12,
  visibility: 10,
  uvIndex: 6,
});

const courses = ref([
  { id: "1", name: "Sân A - 18 hố", holes: 18, status: "open" },
  { id: "2", name: "Sân B - 9 hố", holes: 9, status: "maintenance" },
  { id: "3", name: "Sân C - 18 hố", holes: 18, status: "open" },
]);

const recentActivities = ref([
  {
    type: "booking",
    description: "Nguyễn Văn A đã đặt sân 18 hố vào ngày 25/04/2025",
    timestamp: "2025-04-22T09:30:00",
  },
  {
    type: "payment",
    description: "Thanh toán phí hội viên của Trần Thị B đã hoàn tất",
    timestamp: "2025-04-22T08:45:00",
  },
  {
    type: "member",
    description: "Hội viên mới Lê Văn C đã được tạo",
    timestamp: "2025-04-21T16:20:00",
  },
  {
    type: "event",
    description: 'Sự kiện "Giải Golf Mùa Xuân" đã được tạo',
    timestamp: "2025-04-21T14:10:00",
  },
  {
    type: "booking",
    description: "Phạm Thị D đã hủy đặt sân ngày 23/04/2025",
    timestamp: "2025-04-21T11:05:00",
  },
  {
    type: "payment",
    description: "Hoàn tiền cho Hoàng Văn E đã được xử lý",
    timestamp: "2025-04-20T15:30:00",
  },
]);

// Mock chart data
const revenueData = {
  daily: {
    labels: ["16/04", "17/04", "18/04", "19/04", "20/04", "21/04", "22/04"],
    data: [4500000, 5200000, 4800000, 7500000, 6300000, 5900000, 6800000],
  },
  weekly: {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    data: [18000000, 22500000, 19800000, 25700000],
  },
  monthly: {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    data: [
      85000000, 78000000, 92000000, 105000000, 115000000, 125000000, 135000000,
      128000000, 118000000, 125000000, 132000000, 145000000,
    ],
  },
};

const bookingsData = {
  daily: {
    labels: ["16/04", "17/04", "18/04", "19/04", "20/04", "21/04", "22/04"],
    data: [32, 28, 35, 42, 38, 45, 28],
  },
  weekly: {
    labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
    data: [120, 145, 135, 160],
  },
  monthly: {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    data: [320, 280, 350, 420, 480, 520, 580, 540, 490, 510, 540, 580],
  },
};

const memberData = {
  labels: ["Tiêu chuẩn", "Cao cấp", "VIP", "Gia đình", "Doanh nghiệp"],
  data: [45, 25, 15, 10, 5],
};

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeAgo(dateTimeString) {
  const date = new Date(dateTimeString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffDay > 0) {
    return `${diffDay} ngày trước`;
  } else if (diffHour > 0) {
    return `${diffHour} giờ trước`;
  } else if (diffMin > 0) {
    return `${diffMin} phút trước`;
  } else {
    return "Vừa xong";
  }
}

function getCourseStatusText(status) {
  switch (status) {
    case "open":
      return "Đang mở";
    case "closed":
      return "Đã đóng";
    case "maintenance":
      return "Bảo trì";
    default:
      return status;
  }
}

function getActivityIconBg(type) {
  switch (type) {
    case "member":
      return "bg-purple-600";
    case "booking":
      return "bg-blue-600";
    case "payment":
      return "bg-green-600";
    case "event":
      return "bg-orange-600";
    default:
      return "bg-gray-600";
  }
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing dashboard data...");
}

function updateDashboard() {
  // In a real app, this would update the dashboard based on the selected date range
  console.log(`Updating dashboard for date range: ${dateRange.value}`);

  // For demo purposes, we'll just update some random stats
  stats.totalRevenue = Math.floor(Math.random() * 50000000) + 100000000;
  stats.revenueChange = Math.floor(Math.random() * 20) - 5;
  stats.totalBookings = Math.floor(Math.random() * 100) + 200;
  stats.bookingsChange = Math.floor(Math.random() * 15) - 3;
  stats.newMembers = Math.floor(Math.random() * 10) + 10;
  stats.membersChange = Math.floor(Math.random() * 10) - 2;
  stats.occupancyRate = Math.floor(Math.random() * 30) + 60;
  stats.occupancyChange = Math.floor(Math.random() * 10) - 5;

  // Update charts
  updateCharts();
}

function initCharts() {
  // Revenue Chart
  const revenueCtx = revenueChart.value.getContext("2d");
  revenueChartInstance = new Chart(revenueCtx, {
    type: "line",
    data: {
      labels: revenueData[revenueChartType.value].labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: revenueData[revenueChartType.value].data,
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          borderColor: "rgba(34, 197, 94, 1)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                notation: "compact",
                compactDisplay: "short",
              }).format(value);
            },
          },
        },
      },
    },
  });

  // Bookings Chart
  const bookingsCtx = bookingsChart.value.getContext("2d");
  bookingsChartInstance = new Chart(bookingsCtx, {
    type: "bar",
    data: {
      labels: bookingsData[bookingsChartType.value].labels,
      datasets: [
        {
          label: "Số lượt đặt sân",
          data: bookingsData[bookingsChartType.value].data,
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Member Chart
  const memberCtx = memberChart.value.getContext("2d");
  memberChartInstance = new Chart(memberCtx, {
    type: "doughnut",
    data: {
      labels: memberData.labels,
      datasets: [
        {
          data: memberData.data,
          backgroundColor: [
            "rgba(34, 197, 94, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(168, 85, 247, 0.7)",
            "rgba(249, 115, 22, 0.7)",
            "rgba(239, 68, 68, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            boxWidth: 12,
            font: {
              size: 11,
            },
          },
        },
      },
    },
  });
}

function updateCharts() {
  // Update Revenue Chart
  if (revenueChartInstance) {
    revenueChartInstance.data.labels =
      revenueData[revenueChartType.value].labels;
    revenueChartInstance.data.datasets[0].data =
      revenueData[revenueChartType.value].data;
    revenueChartInstance.update();
  }

  // Update Bookings Chart
  if (bookingsChartInstance) {
    bookingsChartInstance.data.labels =
      bookingsData[bookingsChartType.value].labels;
    bookingsChartInstance.data.datasets[0].data =
      bookingsData[bookingsChartType.value].data;
    bookingsChartInstance.update();
  }
}

watch(revenueChartType, () => {
  updateCharts();
});

watch(bookingsChartType, () => {
  updateCharts();
});

onMounted(() => {
  initCharts();
});
</script>
