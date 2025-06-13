<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-green-800">Báo Cáo Thống Kê Đặt Sân</h1>
        <div class="flex gap-2">
          <button
            @click="exportReport"
            class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
            :disabled="!reportData"
          >
            <DownloadIcon class="w-4 h-4" /> Xuất báo cáo
          </button>
        </div>
      </div>

      <!-- Bộ lọc báo cáo -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Bộ lọc báo cáo</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              v-model="reportConfig.dateFrom"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              v-model="reportConfig.dateTo"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sân</label>
            <select
              v-model="reportConfig.courseId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">Tất cả sân</option>
              <option value="1">Sân A - 18 hố</option>
              <option value="2">Sân B - 9 hố</option>
              <option value="3">Sân C - 18 hố</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            @click="filterReport"
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md"

          >
          </button>
        </div>
      </div>



      <!-- Kết quả báo cáo -->
      <div class="bg-white rounded-lg shadow overflow-hidden mb-4">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Kết quả báo cáo</h2>
          <div class="flex gap-2">
            <button
              @click="printReport"
              class="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
            >
              <PrinterIcon class="w-4 h-4" /> In
            </button>
            <button
              @click="exportReport"
              class="flex items-center gap-1 text-sm text-green-700 hover:text-green-900"
            >
              <DownloadIcon class="w-4 h-4" /> Tải xuống
            </button>
          </div>
        </div>

        <div class="p-4">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">Báo Cáo Đặt Sân & Doanh Thu</h3>
            <p class="text-gray-600">
              Thời gian: {{ formatDate(reportConfig.dateFrom) }} - {{ formatDate(reportConfig.dateTo) }}
            </p>
          </div>

          <!-- Thống kê tổng quan -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng lượt đặt sân</p>
              <h4 class="text-xl font-bold text-green-700">{{ reportData.totalBookings }}</h4>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tỷ lệ lấp đầy</p>
              <h4 class="text-xl font-bold text-blue-700">{{ reportData.occupancyRate || '75' }}%</h4>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng doanh thu</p>
              <h4 class="text-xl font-bold text-purple-700">{{ formatCurrency(reportData.totalRevenue) }}</h4>
            </div>
          </div>

          <!-- Biểu đồ đặt sân theo ngày -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">Đặt sân theo ngày</h4>
            <div class="h-64 mb-4">
              <canvas ref="bookingByDayChart"></canvas>
            </div>
          </div>

          <!-- Biểu đồ doanh thu -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">Doanh thu theo ngày</h4>
            <div class="h-64 mb-4">
              <canvas ref="revenueChart"></canvas>
            </div>
          </div>

          <!-- Thống kê theo sân -->
          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">Thống kê theo sân</h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sân</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượt đặt</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in reportData.bookingsByCourse" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.course }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.count }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.percentage }}%</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatCurrency(item.revenue) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td class="px-6 py-3 text-left text-sm font-medium text-gray-900">Tổng cộng</td>
                    <td class="px-6 py-3 text-left text-sm font-medium text-gray-900">{{ reportData.totalBookings }}</td>
                    <td class="px-6 py-3 text-left text-sm font-medium text-gray-900">100%</td>
                    <td class="px-6 py-3 text-left text-sm font-medium text-gray-900">{{ formatCurrency(reportData.totalRevenue) }}</td>
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
import { ref, watch, onMounted } from "vue";
import Chart from "chart.js/auto";
import { useReportStore } from "../../stores/report";
import { storeToRefs } from "pinia";
import { DownloadIcon, PrinterIcon, FileBarChart2Icon, FilterIcon, LoaderIcon } from "lucide-vue-next";

// Store
const reportStore = useReportStore();
const {
  totalBookings,
  totalRevenue,
  revenueByDate,
  bookingCountAndRevenueByGolfCourse,
} = storeToRefs(reportStore);

// Trạng thái
const reportConfig = ref({
  dateFrom: "",
  dateTo: "",
  courseId: "all",
});

const bookingByDayChart = ref(null);
const revenueChart = ref(null);
let chartInstances = {};
const reportData = ref(null); // dữ liệu tổng hợp để truyền vào biểu đồ
const isLoading = ref(false);

// Hàm định dạng
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

// Hàm gọi API
async function filterReport() {
  if (!reportConfig.value.dateFrom || !reportConfig.value.dateTo) {
    alert("Vui lòng chọn khoảng thời gian để lọc báo cáo");
    return;
  }

  isLoading.value = true;
  
  try {
    // Gọi các API song song để tối ưu thời gian
    await Promise.all([
      reportStore.fetchTotalBookings({
        startDate: reportConfig.value.dateFrom,
        endDate: reportConfig.value.dateTo,
        golfCourseId: reportConfig.value.courseId,
      }),
      
      reportStore.fetchTotalRevenue({
        startDate: reportConfig.value.dateFrom,
        endDate: reportConfig.value.dateTo,
        golfCourseId: reportConfig.value.courseId,
      }),
      
      reportStore.fetchRevenueByDate({
        startDate: reportConfig.value.dateFrom,
        endDate: reportConfig.value.dateTo,
        golfCourseId: reportConfig.value.courseId,
      }),
      
      reportStore.fetchBookingCountAndRevenueByGolfCourse({
        startDate: reportConfig.value.dateFrom,
        endDate: reportConfig.value.dateTo,
      })
    ]);
    
    // Cập nhật dữ liệu báo cáo sau khi tất cả API hoàn thành
    updateReportData();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu báo cáo:", error);
    alert("Đã xảy ra lỗi khi tải dữ liệu báo cáo. Vui lòng thử lại sau.");
  } finally {
    isLoading.value = false;
  }
}

// Cập nhật dữ liệu báo cáo từ store
function updateReportData() {
  if (revenueByDate.value?.labels && bookingCountAndRevenueByGolfCourse.value) {
    reportData.value = {
      bookingsByDay: revenueByDate.value,
      bookingsByCourse: bookingCountAndRevenueByGolfCourse.value,
      totalRevenue: totalRevenue.value,
      totalBookings: totalBookings.value,
      occupancyRate: 75, // Giả định tỷ lệ lấp đầy, có thể thay bằng dữ liệu thực từ API
    };
    
    // Vẽ biểu đồ sau khi có dữ liệu
    setTimeout(() => {
      initCharts();
    }, 100);
  }
}

// Biểu đồ
function initCharts() {
  // Hủy các biểu đồ cũ để tránh trùng lặp
  Object.values(chartInstances).forEach((chart) => chart?.destroy());

  if (!reportData.value || !reportData.value.bookingsByDay) return;

  const labels = reportData.value.bookingsByDay.labels;

  // Chart: Đặt sân theo ngày
  if (bookingByDayChart.value) {
    const ctx = bookingByDayChart.value.getContext("2d");
    chartInstances.bookingByDay = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
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
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  // Chart: Doanh thu theo ngày
  if (revenueChart.value) {
    const ctx = revenueChart.value.getContext("2d");
    chartInstances.revenue = new Chart(ctx, {
      type: "line",
      data: {
        labels,
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
        plugins: {
          legend: { display: false },
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
  }
}

// Xuất báo cáo
function exportReport() {
  if (!reportData.value) {
    alert("Vui lòng tạo báo cáo trước khi xuất");
    return;
  }

  // Trong thực tế, đây sẽ xuất báo cáo ra file
  alert("Báo cáo đã được xuất dưới dạng Excel");
}

// In báo cáo
function printReport() {
  if (!reportData.value) {
    alert("Vui lòng tạo báo cáo trước khi in");
    return;
  }

  // Trong thực tế, đây sẽ in báo cáo
  window.print();
}

// Khởi tạo ngày mặc định khi mở trang
onMounted(() => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  reportConfig.value.dateFrom = thirtyDaysAgo.toISOString().split("T")[0];
  reportConfig.value.dateTo = today.toISOString().split("T")[0];
  
  // Không tự động gọi API khi trang được tải
  // Người dùng cần nhấn nút "Lọc" để tải dữ liệu
});
</script>