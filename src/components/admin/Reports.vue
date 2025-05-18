<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Báo Cáo Thống Kê</h1>
      <div class="flex gap-2">
        <button
          @click="generateReport"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <FileBarChart2Icon class="w-4 h-4" /> Tạo báo cáo
        </button>
        <button
          @click="exportReport"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
          :disabled="!selectedReport"
        >
          <DownloadIcon class="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Report Selection -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Loại báo cáo</h2>
          <div class="space-y-2">
            <button
              v-for="report in reportTypes"
              :key="report.id"
              @click="selectReport(report)"
              :class="{
                'w-full flex items-center p-3 rounded-md transition-colors': true,
                'bg-green-50 text-green-800 border border-green-200':
                  selectedReportId === report.id,
                'hover:bg-gray-50 text-gray-700':
                  selectedReportId !== report.id,
              }"
            >
              <component :is="report.icon" class="w-5 h-5 mr-3" />
              <span>{{ report.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Report Configuration -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Cấu hình báo cáo
          </h2>

          <div v-if="!selectedReport" class="text-center py-8 text-gray-500">
            Vui lòng chọn loại báo cáo từ danh sách bên trái
          </div>

          <div v-else>
            <h3 class="text-md font-medium text-gray-800 mb-3">
              {{ selectedReport.name }}
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              {{ selectedReport.description }}
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            </div>

            <!-- Financial Report Options -->
            <div v-if="selectedReport.id === 'financial'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại doanh thu</label
                >
                <select
                  v-model="reportConfig.revenueType"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="membership">Phí hội viên</option>
                  <option value="booking">Đặt sân</option>
                  <option value="service">Dịch vụ</option>
                  <option value="event">Sự kiện</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Phân tích theo</label
                >
                <select
                  v-model="reportConfig.groupBy"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="day">Theo ngày</option>
                  <option value="week">Theo tuần</option>
                  <option value="month">Theo tháng</option>
                  <option value="quarter">Theo quý</option>
                  <option value="year">Theo năm</option>
                </select>
              </div>
            </div>

            <!-- Member Report Options -->
            <div v-if="selectedReport.id === 'member'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại hội viên</label
                >
                <select
                  v-model="reportConfig.membershipType"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="standard">Tiêu chuẩn</option>
                  <option value="premium">Cao cấp</option>
                  <option value="vip">VIP</option>
                  <option value="family">Gia đình</option>
                  <option value="corporate">Doanh nghiệp</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Trạng thái</label
                >
                <select
                  v-model="reportConfig.memberStatus"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="expired">Hết hạn</option>
                  <option value="pending">Chờ duyệt</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
              </div>
            </div>

            <!-- Booking Report Options -->
            <div v-if="selectedReport.id === 'booking'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Sân</label
                >
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
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Phân tích theo</label
                >
                <select
                  v-model="reportConfig.bookingGroupBy"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="day">Theo ngày</option>
                  <option value="weekday">Theo thứ trong tuần</option>
                  <option value="hour">Theo giờ trong ngày</option>
                  <option value="course">Theo sân</option>
                </select>
              </div>
            </div>

            <!-- Service Report Options -->
            <div v-if="selectedReport.id === 'service'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại dịch vụ</label
                >
                <select
                  v-model="reportConfig.serviceType"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">Tất cả</option>
                  <option value="lesson">Học đánh golf</option>
                  <option value="rental">Cho thuê thiết bị</option>
                  <option value="food">Ẩm thực</option>
                  <option value="spa">Spa & Massage</option>
                  <option value="transport">Đưa đón</option>
                </select>
              </div>
            </div>

            <!-- Format Options -->
            <div class="mt-6 space-y-4">
              <h3 class="text-md font-medium text-gray-800 mb-2">
                Tùy chọn xuất báo cáo
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Định dạng</label
                  >
                  <select
                    v-model="reportConfig.format"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Bao gồm biểu đồ</label
                  >
                  <div class="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      v-model="reportConfig.includeCharts"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      for="includeCharts"
                      class="ml-2 block text-sm text-gray-900"
                    >
                      Thêm biểu đồ vào báo cáo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Preview -->
    <div
      v-if="reportData"
      class="bg-white rounded-lg shadow overflow-hidden mb-4"
    >
      <div
        class="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center"
      >
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
          <h3 class="text-xl font-bold text-gray-900">
            {{ selectedReport.name }}
          </h3>
          <p class="text-gray-600">
            Thời gian: {{ formatDate(reportConfig.dateFrom) }} -
            {{ formatDate(reportConfig.dateTo) }}
          </p>
        </div>

        <!-- Financial Report Preview -->
        <div v-if="selectedReport.id === 'financial'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng doanh thu</p>
              <h4 class="text-xl font-bold text-green-700">
                {{ formatCurrency(reportData.totalRevenue) }}
              </h4>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Số giao dịch</p>
              <h4 class="text-xl font-bold text-blue-700">
                {{ reportData.transactionCount }}
              </h4>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Giá trị trung bình</p>
              <h4 class="text-xl font-bold text-purple-700">
                {{ formatCurrency(reportData.averageValue) }}
              </h4>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Phân tích doanh thu
            </h4>
            <div class="h-64 mb-4">
              <canvas ref="revenueAnalysisChart"></canvas>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Chi tiết doanh thu theo loại
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Loại
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số giao dịch
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doanh thu
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in reportData.revenueByType"
                    :key="index"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ item.type }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ item.count }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ formatCurrency(item.amount) }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ item.percentage }}%
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
                      {{ reportData.transactionCount }}
                    </td>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      {{ formatCurrency(reportData.totalRevenue) }}
                    </td>
                    <td
                      class="px-6 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      100%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Member Report Preview -->
        <div v-if="selectedReport.id === 'member'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng hội viên</p>
              <h4 class="text-xl font-bold text-green-700">
                {{ reportData.totalMembers }}
              </h4>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Hội viên mới</p>
              <h4 class="text-xl font-bold text-blue-700">
                {{ reportData.newMembers }}
              </h4>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Hội viên hết hạn</p>
              <h4 class="text-xl font-bold text-yellow-700">
                {{ reportData.expiredMembers }}
              </h4>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tỷ lệ duy trì</p>
              <h4 class="text-xl font-bold text-purple-700">
                {{ reportData.retentionRate }}%
              </h4>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-3">
                Phân bố theo loại hội viên
              </h4>
              <div class="h-64">
                <canvas ref="memberTypeChart"></canvas>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-3">
                Xu hướng hội viên
              </h4>
              <div class="h-64">
                <canvas ref="memberTrendChart"></canvas>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Thống kê hội viên theo trạng thái
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Trạng thái
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số lượng
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tỷ lệ
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in reportData.membersByStatus"
                    :key="index"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ item.status }}
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
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Booking Report Preview -->
        <div v-if="selectedReport.id === 'booking'" class="space-y-6">
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
              <p class="text-sm text-gray-500">Doanh thu đặt sân</p>
              <h4 class="text-xl font-bold text-purple-700">
                {{ formatCurrency(reportData.bookingRevenue) }}
              </h4>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Phân tích đặt sân
            </h4>
            <div class="h-64 mb-4">
              <canvas ref="bookingAnalysisChart"></canvas>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-3">
                Đặt sân theo thời gian trong ngày
              </h4>
              <div class="h-64">
                <canvas ref="bookingTimeChart"></canvas>
              </div>
            </div>
            <div>
              <h4 class="text-lg font-medium text-gray-900 mb-3">
                Đặt sân theo sân
              </h4>
              <div class="h-64">
                <canvas ref="bookingCourseChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Service Report Preview -->
        <div v-if="selectedReport.id === 'service'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Tổng dịch vụ đã sử dụng</p>
              <h4 class="text-xl font-bold text-green-700">
                {{ reportData.totalServices }}
              </h4>
            </div>
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Doanh thu dịch vụ</p>
              <h4 class="text-xl font-bold text-blue-700">
                {{ formatCurrency(reportData.serviceRevenue) }}
              </h4>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <p class="text-sm text-gray-500">Đánh giá trung bình</p>
              <h4 class="text-xl font-bold text-purple-700">
                {{ reportData.averageRating }}/5
              </h4>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Doanh thu theo loại dịch vụ
            </h4>
            <div class="h-64 mb-4">
              <canvas ref="serviceRevenueChart"></canvas>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-lg font-medium text-gray-900 mb-3">
              Dịch vụ phổ biến nhất
            </h4>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Dịch vụ
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Loại
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số lượt sử dụng
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Doanh thu
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Đánh giá
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(service, index) in reportData.topServices"
                    :key="index"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {{ service.name }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ service.type }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ service.usageCount }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ formatCurrency(service.revenue) }}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ service.rating }}/5
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import {
  FileBarChart2Icon,
  DownloadIcon,
  PrinterIcon,
  DollarSignIcon,
  UsersIcon,
  CalendarIcon,
  ShoppingBagIcon,
} from "lucide-vue-next";
import Chart from "chart.js/auto";

// State
const selectedReportId = ref(null);
const selectedReport = ref(null);
const reportData = ref(null);
const revenueAnalysisChart = ref(null);
const memberTypeChart = ref(null);
const memberTrendChart = ref(null);
const bookingAnalysisChart = ref(null);
const bookingTimeChart = ref(null);
const bookingCourseChart = ref(null);
const serviceRevenueChart = ref(null);

let chartInstances = {};

// Report configuration
const reportConfig = reactive({
  dateFrom: new Date().toISOString().split("T")[0],
  dateTo: new Date().toISOString().split("T")[0],
  revenueType: "all",
  groupBy: "day",
  membershipType: "all",
  memberStatus: "all",
  courseId: "all",
  bookingGroupBy: "day",
  serviceType: "all",
  format: "pdf",
  includeCharts: true,
});

// Report types
const reportTypes = [
  {
    id: "financial",
    name: "Báo cáo tài chính",
    icon: DollarSignIcon,
    description:
      "Báo cáo chi tiết về doanh thu, chi phí và lợi nhuận của sân golf.",
  },
  {
    id: "member",
    name: "Báo cáo hội viên",
    icon: UsersIcon,
    description:
      "Thống kê về hội viên, bao gồm số lượng, loại hội viên, tỷ lệ duy trì và xu hướng.",
  },
  {
    id: "booking",
    name: "Báo cáo đặt sân",
    icon: CalendarIcon,
    description:
      "Phân tích về lượt đặt sân, tỷ lệ lấp đầy, thời gian đặt sân phổ biến và doanh thu.",
  },
  {
    id: "service",
    name: "Báo cáo dịch vụ",
    icon: ShoppingBagIcon,
    description:
      "Thống kê về các dịch vụ được sử dụng, doanh thu từ dịch vụ và đánh giá của khách hàng.",
  },
];

// Mock data for reports
const mockReportData = {
  financial: {
    totalRevenue: 1250000000,
    transactionCount: 1845,
    averageValue: 677508,
    revenueByType: [
      { type: "Phí hội viên", count: 120, amount: 650000000, percentage: 52 },
      { type: "Đặt sân", count: 1250, amount: 375000000, percentage: 30 },
      { type: "Dịch vụ", count: 450, amount: 187500000, percentage: 15 },
      { type: "Sự kiện", count: 25, amount: 37500000, percentage: 3 },
    ],
    revenueByPeriod: {
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
        85000000, 78000000, 92000000, 105000000, 115000000, 125000000,
        135000000, 128000000, 118000000, 125000000, 132000000, 12000000,
      ],
    },
  },
  member: {
    totalMembers: 350,
    newMembers: 28,
    expiredMembers: 12,
    retentionRate: 92,
    membersByType: [
      { type: "Tiêu chuẩn", count: 150, percentage: 42.9 },
      { type: "Cao cấp", count: 85, percentage: 24.3 },
      { type: "VIP", count: 45, percentage: 12.9 },
      { type: "Gia đình", count: 40, percentage: 11.4 },
      { type: "Doanh nghiệp", count: 30, percentage: 8.5 },
    ],
    membersByStatus: [
      { status: "Đang hoạt động", count: 280, percentage: 80 },
      { status: "Hết hạn", count: 35, percentage: 10 },
      { status: "Chờ duyệt", count: 25, percentage: 7.1 },
      { status: "Tạm khóa", count: 10, percentage: 2.9 },
    ],
    memberTrend: {
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
      newData: [8, 12, 15, 10, 18, 22, 16, 14, 20, 25, 18, 28],
      expiredData: [5, 3, 7, 4, 6, 8, 5, 9, 4, 7, 10, 12],
    },
  },
  booking: {
    totalBookings: 3250,
    occupancyRate: 78,
    bookingRevenue: 375000000,
    bookingsByDay: {
      labels: [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
      ],
      data: [280, 310, 350, 420, 520, 680, 690],
    },
    bookingsByTime: {
      labels: [
        "6-8h",
        "8-10h",
        "10-12h",
        "12-14h",
        "14-16h",
        "16-18h",
        "18-20h",
      ],
      data: [420, 680, 520, 380, 450, 520, 280],
    },
    bookingsByCourse: [
      { course: "Sân A - 18 hố", count: 1450, percentage: 44.6 },
      { course: "Sân B - 9 hố", count: 850, percentage: 26.2 },
      { course: "Sân C - 18 hố", count: 950, percentage: 29.2 },
    ],
  },
  service: {
    totalServices: 2150,
    serviceRevenue: 187500000,
    averageRating: 4.6,
    revenueByServiceType: [
      { type: "Học đánh golf", amount: 67500000, percentage: 36 },
      { type: "Cho thuê thiết bị", amount: 45000000, percentage: 24 },
      { type: "Ẩm thực", amount: 37500000, percentage: 20 },
      { type: "Spa & Massage", amount: 22500000, percentage: 12 },
      { type: "Đưa đón", amount: 15000000, percentage: 8 },
    ],
    topServices: [
      {
        name: "Khóa học golf cơ bản",
        type: "Học đánh golf",
        usageCount: 120,
        revenue: 45000000,
        rating: 4.7,
      },
      {
        name: "Thuê bộ gậy golf",
        type: "Cho thuê thiết bị",
        usageCount: 350,
        revenue: 28000000,
        rating: 4.5,
      },
      {
        name: "Buffet nhà hàng sân golf",
        type: "Ẩm thực",
        usageCount: 480,
        revenue: 21600000,
        rating: 4.8,
      },
      {
        name: "Massage thư giãn sau golf",
        type: "Spa & Massage",
        usageCount: 180,
        revenue: 11700000,
        rating: 4.9,
      },
      {
        name: "Đưa đón sân bay - sân golf",
        type: "Đưa đón",
        usageCount: 95,
        revenue: 11400000,
        rating: 4.6,
      },
    ],
  },
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

function selectReport(report) {
  selectedReportId.value = report.id;
  selectedReport.value = report;
  reportData.value = null; // Reset report data when changing report type
}

function generateReport() {
  if (!selectedReport.value) {
    alert("Vui lòng chọn loại báo cáo trước khi tạo báo cáo");
    return;
  }

  // In a real app, this would fetch report data from the server
  console.log(
    `Generating ${selectedReport.value.name} with config:`,
    reportConfig
  );

  // For demo purposes, we'll use mock data
  reportData.value = mockReportData[selectedReport.value.id];

  // Initialize charts after data is loaded
  setTimeout(() => {
    initCharts();
  }, 100);
}

function exportReport() {
  if (!reportData.value) {
    alert("Vui lòng tạo báo cáo trước khi xuất");
    return;
  }

  // In a real app, this would export the report to the selected format
  console.log(`Exporting report to ${reportConfig.format}`);
  alert(`Báo cáo đã được xuất dưới dạng ${reportConfig.format.toUpperCase()}`);
}

function printReport() {
  if (!reportData.value) {
    alert("Vui lòng tạo báo cáo trước khi in");
    return;
  }

  // In a real app, this would print the report
  console.log("Printing report");
  window.print();
}

function initCharts() {
  // Destroy existing charts to prevent duplicates
  Object.values(chartInstances).forEach((chart) => {
    if (chart) chart.destroy();
  });

  // Initialize charts based on the selected report type
  if (selectedReport.value.id === "financial" && revenueAnalysisChart.value) {
    const ctx = revenueAnalysisChart.value.getContext("2d");
    chartInstances.revenueAnalysis = new Chart(ctx, {
      type: "line",
      data: {
        labels: reportData.value.revenueByPeriod.labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: reportData.value.revenueByPeriod.data,
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
  }

  if (selectedReport.value.id === "member") {
    if (memberTypeChart.value) {
      const ctx = memberTypeChart.value.getContext("2d");
      chartInstances.memberType = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: reportData.value.membersByType.map((item) => item.type),
          datasets: [
            {
              data: reportData.value.membersByType.map((item) => item.count),
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
        },
      });
    }

    if (memberTrendChart.value) {
      const ctx = memberTrendChart.value.getContext("2d");
      chartInstances.memberTrend = new Chart(ctx, {
        type: "line",
        data: {
          labels: reportData.value.memberTrend.labels,
          datasets: [
            {
              label: "Hội viên mới",
              data: reportData.value.memberTrend.newData,
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: "Hội viên hết hạn",
              data: reportData.value.memberTrend.expiredData,
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 2,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  if (selectedReport.value.id === "booking") {
    if (bookingAnalysisChart.value) {
      const ctx = bookingAnalysisChart.value.getContext("2d");
      chartInstances.bookingAnalysis = new Chart(ctx, {
        type: "bar",
        data: {
          labels: reportData.value.bookingsByDay.labels,
          datasets: [
            {
              label: "Số lượt đặt sân",
              data: reportData.value.bookingsByDay.data,
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
        },
      });
    }

    if (bookingTimeChart.value) {
      const ctx = bookingTimeChart.value.getContext("2d");
      chartInstances.bookingTime = new Chart(ctx, {
        type: "line",
        data: {
          labels: reportData.value.bookingsByTime.labels,
          datasets: [
            {
              label: "Số lượt đặt sân",
              data: reportData.value.bookingsByTime.data,
              backgroundColor: "rgba(168, 85, 247, 0.2)",
              borderColor: "rgba(168, 85, 247, 1)",
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
        },
      });
    }

    if (bookingCourseChart.value) {
      const ctx = bookingCourseChart.value.getContext("2d");
      chartInstances.bookingCourse = new Chart(ctx, {
        type: "pie",
        data: {
          labels: reportData.value.bookingsByCourse.map((item) => item.course),
          datasets: [
            {
              data: reportData.value.bookingsByCourse.map((item) => item.count),
              backgroundColor: [
                "rgba(34, 197, 94, 0.7)",
                "rgba(59, 130, 246, 0.7)",
                "rgba(168, 85, 247, 0.7)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  if (selectedReport.value.id === "service" && serviceRevenueChart.value) {
    const ctx = serviceRevenueChart.value.getContext("2d");
    chartInstances.serviceRevenue = new Chart(ctx, {
      type: "bar",
      data: {
        labels: reportData.value.revenueByServiceType.map((item) => item.type),
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: reportData.value.revenueByServiceType.map(
              (item) => item.amount
            ),
            backgroundColor: [
              "rgba(34, 197, 94, 0.7)",
              "rgba(59, 130, 246, 0.7)",
              "rgba(249, 115, 22, 0.7)",
              "rgba(168, 85, 247, 0.7)",
              "rgba(239, 68, 68, 0.7)",
            ],
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

onMounted(() => {
  // Initialize with default date range (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  reportConfig.dateFrom = thirtyDaysAgo.toISOString().split("T")[0];
  reportConfig.dateTo = today.toISOString().split("T")[0];
});
</script>
