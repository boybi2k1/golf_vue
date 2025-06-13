<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">
          Báo Cáo Thống Kê Đặt Sân
        </h1>
        <div class="flex gap-2"></div>
      </div>

      <!-- Bộ lọc báo cáo -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Bộ lọc báo cáo</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Từ ngày</label
            >
            <input
              type="date"
              v-model="reportConfig.dateFrom"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Đến ngày</label
            >
            <input
              type="date"
              v-model="reportConfig.dateTo"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Sân</label
            >
            <select
              v-model="reportConfig.golfCourseId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tất cả sân</option>
              <option
                v-for="course in golfCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>
          </div>
          <button
            @click="onFilter"
            class="mt-6 w-full md:w-auto bg-green-600 text-white rounded-md px-4 py-2 font-medium shadow hover:bg-green-700 transition"
          >
            Lọc
          </button>
        </div>
      </div>

      <!-- Kết quả báo cáo -->
      <div
        v-if="reportData"
        class="bg-white rounded-lg shadow overflow-hidden mb-4"
      >
        <div
          class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
        >
          <h2 class="text-lg font-medium text-gray-900">Kết quả báo cáo</h2>
          <div class="flex gap-2"></div>
        </div>

        <div class="p-4">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">
              Báo Cáo Đặt Sân & Doanh Thu
            </h3>
            <p class="text-gray-600">
              Thời gian: {{ formatDate(reportConfig.dateFrom) }} -
              {{ formatDate(reportConfig.dateTo) }}
            </p>
          </div>

          <!-- Thống kê tổng quan -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng lượt đặt sân</p>
              <h4 class="text-xl font-bold text-green-700">
                {{ reportData.totalBookings }}
              </h4>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tỷ lệ lấp đầy</p>
              <h4 class="text-xl font-bold text-blue-700">
                {{ reportData.occupancyRate }}%
              </h4>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng doanh thu</p>
              <h4 class="text-xl font-bold text-purple-700">
                {{ formatCurrency(reportData.totalRevenue) }}
              </h4>
            </div>
          </div>

          <!-- Biểu đồ đặt sân theo ngày -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Đặt sân theo ngày
            </h4>
            <div class="h-64 mb-4">
              <canvas ref="bookingByDayChart"></canvas>
            </div>
          </div>

          <!-- Biểu đồ doanh thu -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Doanh thu theo ngày
            </h4>
            <div class="h-64 mb-4">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>

          <!-- Thống kê theo sân -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Thống kê theo sân
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sân
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số lượt đặt
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tỷ lệ
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doanh thu
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in reportData.bookingsByCourse"
                    :key="index"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ item.courseName }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ item.count }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ item.percentage }}%
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ formatCurrency(item.revenue) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      Tổng cộng
                    </td>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      {{ reportData.totalBookings }}
                    </td>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      100%
                    </td>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      {{ formatCurrency(reportData.totalRevenue) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useReportStore } from "../../stores/report";
import Chart from "chart.js/auto";
import { useGolfCourseStore } from "../../stores/golf_course";
import { storeToRefs } from "pinia";

// Store
const reportStore = useReportStore();
const courseStore = useGolfCourseStore();
const { golfCourses } = storeToRefs(courseStore);
// State
const reportData = ref(null);
const bookingByDayChart = ref(null);
const revenueChart = ref(null);
let chartInstances = {};

// Cấu hình lọc
const reportConfig = ref({
  dateFrom: new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0],
  dateTo: new Date().toISOString().split("T")[0],
  golfCourseId: "all",
});

// Formatters
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Xử lý dữ liệu trả về từ backend
const processData = () => {
  const bookingsByDayRaw = reportStore.numberBookingByDate.map((item) => ({
    date: item[0],
    count: item[1],
  }));

  const revenueByDayRaw = reportStore.revenueByDate.map((item) => ({
    date: item[0],
    revenue: item[1],
  }));

  const bookingsByCourseRaw =
    reportStore.bookingCountAndRevenueByGolfCourse.map((item) => ({
      course: item[0],
      count: item[1],
      revenue: item[2],
    }));

  const totalCourseBookings = bookingsByCourseRaw.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const bookingsByCourse = bookingsByCourseRaw.map((item) => ({
    ...item,
    courseName: (golfCourses.value.find((c) => c.id == item.course)?.name) || item.course,
    percentage:
      totalCourseBookings > 0
        ? ((item.count / totalCourseBookings) * 100).toFixed(1)
        : 0,
  }));

  // Kết hợp dữ liệu
  reportData.value = {
    totalBookings: reportStore.totalBookings,
    totalRevenue: reportStore.totalRevenue,
    occupancyRate: 0, // Tùy bạn tính sau nếu có dữ liệu tổng sức chứa
    bookingsByDay: {
      labels: bookingsByDayRaw.map((d) => formatDate(d.date)),
      bookings: bookingsByDayRaw.map((d) => d.count),
      revenue: revenueByDayRaw.map((d) => d.revenue),
    },
    bookingsByCourse,
  };
};

// Vẽ biểu đồ
const initCharts = () => {
  Object.values(chartInstances).forEach((chart) => {
    if (chart) chart.destroy();
  });

  if (bookingByDayChart.value) {
    chartInstances.bookingByDay = new Chart(
      bookingByDayChart.value.getContext("2d"),
      {
        type: "bar",
        data: {
          labels: reportData.value.bookingsByDay.labels,
          datasets: [
            {
              label: "Số lượt đặt sân",
              data: reportData.value.bookingsByDay.bookings,
              backgroundColor: "rgba(59, 130, 246, 0.7)",
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
        },
      }
    );
  }

  if (revenueChart.value) {
    chartInstances.revenue = new Chart(revenueChart.value.getContext("2d"), {
      type: "line",
      data: {
        labels: reportData.value.bookingsByDay.labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: reportData.value.bookingsByDay.revenue,
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
        plugins: { legend: { display: false } },
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
  }
};

// Gọi API
const fetchData = async () => {
  await Promise.all([
    reportStore.fetchTotalBookings({
      startDate: reportConfig.value.dateFrom,
      endDate: reportConfig.value.dateTo,
      golfCourseId: reportConfig.value.golfCourseId,
    }),
    reportStore.fetchTotalRevenue({
      startDate: reportConfig.value.dateFrom,
      endDate: reportConfig.value.dateTo,
      golfCourseId: reportConfig.value.golfCourseId,
    }),
    reportStore.fetchNumberBookingByDate({
      startDate: reportConfig.value.dateFrom,
      endDate: reportConfig.value.dateTo,
      golfCourseId: reportConfig.value.golfCourseId,
    }),
    reportStore.fetchRevenueByDate({
      startDate: reportConfig.value.dateFrom,
      endDate: reportConfig.value.dateTo,
      golfCourseId: reportConfig.value.golfCourseId,
    }),
    reportStore.fetchBookingCountAndRevenueByGolfCourse({
      startDate: reportConfig.value.dateFrom,
      endDate: reportConfig.value.dateTo,
    }),
  ]);
  processData();
  setTimeout(initCharts, 100);
};

// Khởi tạo
onMounted(async () => {
  await fetchData();
  await courseStore.getAllGolfCourses();
  processData();
  setTimeout(initCharts, 100);
});

const onFilter = async () => {
  await fetchData();
};
</script>
