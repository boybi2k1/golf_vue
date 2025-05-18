<template>
  <div class="bg-white min-h-screen">
    <!-- Header section -->
    <div class="bg-green-600 p-6 text-white">
      <h1 class="text-2xl font-bold">Lịch sử chơi golf</h1>
      <p class="mt-2">Xem lại các lần đặt sân và chơi golf của bạn</p>
    </div>

    <!-- Filter section -->
    <div class="bg-white p-4 shadow-md mb-6">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Từ ngày</label
            >
            <input
              type="date"
              v-model="filters.startDate"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Đến ngày</label
            >
            <input
              type="date"
              v-model="filters.endDate"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Sân golf</label
            >
            <select
              v-model="filters.golfCourseId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả sân</option>
              <option
                v-for="course in golfCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Trạng thái</label
            >
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="NO_SHOW">Không đến</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="applyFilters"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Stats section -->
    <div class="container mx-auto px-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          class="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <CalendarIcon class="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Tổng số lần chơi</p>
              <p class="text-xl font-semibold">{{ stats.totalGames }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <MapPinIcon class="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Sân yêu thích</p>
              <p class="text-xl font-semibold">{{ stats.favoriteCourse }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4">
              <ClockIcon class="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Giờ chơi phổ biến</p>
              <p class="text-xl font-semibold">{{ stats.popularTime }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white p-4 rounded-lg shadow-md border-l-4 border-purple-500"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 mr-4">
              <UsersIcon class="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Số người trung bình</p>
              <p class="text-xl font-semibold">{{ stats.avgPlayers }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- History list -->
    <div class="container mx-auto px-4 mb-8">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Lịch sử đặt sân</h2>
        </div>

        <div v-if="filteredHistory.length === 0" class="text-center py-8">
          <CalendarXIcon class="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-500">Không tìm thấy lịch sử chơi golf nào</p>
          <p class="text-gray-400 text-sm mt-1">
            Hãy đặt sân và trải nghiệm golf ngay hôm nay
          </p>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ngày
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giờ
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sân golf
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Số người
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tổng tiền
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="booking in filteredHistory"
                  :key="booking.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(booking.date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.startTime }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
                      >
                        <GolfIcon class="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ booking.golfCourseName }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ booking.holeCount }} hố
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.playerCount }} người
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatPrice(booking.totalAmount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'px-2 py-1 text-xs rounded-full': true,
                        'bg-green-100 text-green-800':
                          booking.status === 'COMPLETED',
                        'bg-red-100 text-red-800':
                          booking.status === 'CANCELLED',
                        'bg-gray-100 text-gray-800':
                          booking.status === 'NO_SHOW',
                      }"
                    >
                      {{ getStatusLabel(booking.status) }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <button
                      @click="viewBookingDetails(booking)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="px-6 py-4 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-center">
              <div class="text-sm text-gray-700 mb-4 sm:mb-0">
                Hiển thị <span class="font-medium">{{ startItem }}</span> -
                <span class="font-medium">{{ endItem }}</span> trong tổng số
                <span class="font-medium">{{ filteredHistory.length }}</span>
                kết quả
              </div>
              <div class="flex gap-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  :class="{
                    'px-3 py-1 border rounded-md': true,
                    'border-gray-300 text-gray-700 hover:bg-gray-100':
                      currentPage !== 1,
                    'border-gray-200 text-gray-400 cursor-not-allowed':
                      currentPage === 1,
                  }"
                >
                  Trước
                </button>

                <button
                  v-for="page in visiblePageNumbers"
                  :key="page"
                  @click="goToPage(page)"
                  :class="{
                    'px-3 py-1 border rounded-md': true,
                    'bg-green-50 text-green-700 border-green-300':
                      currentPage === page,
                    'border-gray-300 text-gray-700 hover:bg-gray-100':
                      currentPage !== page,
                  }"
                >
                  {{ page }}
                </button>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  :class="{
                    'px-3 py-1 border rounded-md': true,
                    'border-gray-300 text-gray-700 hover:bg-gray-100':
                      currentPage !== totalPages,
                    'border-gray-200 text-gray-400 cursor-not-allowed':
                      currentPage === totalPages,
                  }"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking details modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-gray-900">Chi tiết đặt sân</h3>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-500"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>

        <div class="p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h4 class="text-xl font-bold text-gray-900">
                {{ selectedBooking.golfCourseName }}
              </h4>
              <p class="text-gray-600">
                {{ formatDate(selectedBooking.date) }} |
                {{ selectedBooking.startTime }}
              </p>
            </div>
            <span
              :class="{
                'px-3 py-1 text-sm rounded-full': true,
                'bg-green-100 text-green-800':
                  selectedBooking.status === 'COMPLETED',
                'bg-red-100 text-red-800':
                  selectedBooking.status === 'CANCELLED',
                'bg-gray-100 text-gray-800':
                  selectedBooking.status === 'NO_SHOW',
              }"
            >
              {{ getStatusLabel(selectedBooking.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h5 class="font-medium text-gray-700 mb-3">Thông tin đặt sân</h5>
              <div class="space-y-3">
                <div class="flex items-start">
                  <MapPinIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p class="font-medium">Sân golf</p>
                    <p class="text-gray-600">
                      {{ selectedBooking.golfCourseName }}
                    </p>
                    <p class="text-gray-500 text-sm">
                      {{ selectedBooking.golfCourseAddress }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <CalendarIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p class="font-medium">Ngày chơi</p>
                    <p class="text-gray-600">
                      {{ formatDate(selectedBooking.date) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <ClockIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p class="font-medium">Giờ bắt đầu</p>
                    <p class="text-gray-600">{{ selectedBooking.startTime }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <FlagIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div>
                    <p class="font-medium">Số hố</p>
                    <p class="text-gray-600">
                      {{ selectedBooking.holeCount }} hố
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 class="font-medium text-gray-700 mb-3">
                Chi tiết thanh toán
              </h5>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phí sân golf</span>
                    <span>{{ formatPrice(selectedBooking.greenFee) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phí caddie</span>
                    <span>{{ formatPrice(selectedBooking.caddieFee) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Phí xe điện</span>
                    <span>{{ formatPrice(selectedBooking.cartFee) }}</span>
                  </div>
                  <div
                    v-if="selectedBooking.otherFees > 0"
                    class="flex justify-between"
                  >
                    <span class="text-gray-600">Phí khác</span>
                    <span>{{ formatPrice(selectedBooking.otherFees) }}</span>
                  </div>
                  <div
                    v-if="selectedBooking.discount > 0"
                    class="flex justify-between text-red-600"
                  >
                    <span>Giảm giá</span>
                    <span>-{{ formatPrice(selectedBooking.discount) }}</span>
                  </div>
                  <div
                    class="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold"
                  >
                    <span>Tổng cộng</span>
                    <span>{{ formatPrice(selectedBooking.totalAmount) }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Phương thức thanh toán</span>
                    <span>{{
                      getPaymentMethodLabel(selectedBooking.paymentMethod)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h5 class="font-medium text-gray-700 mb-3">Thông tin người chơi</h5>
            <div class="bg-gray-50 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      STT
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Họ tên
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      Loại
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(player, index) in selectedBooking.players"
                    :key="index"
                  >
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ index + 1 }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ player.name }}
                    </td>
                    <td
                      class="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                    >
                      {{ getPlayerTypeLabel(player.type) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success modal -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-full max-w-md text-center p-6"
      >
        <div
          class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <CheckIcon class="w-8 h-8 text-green-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Cảm ơn bạn đã đánh giá!
        </h3>
        <p class="text-gray-600 mb-6">
          Đánh giá của bạn đã được ghi nhận. Chúng tôi rất trân trọng phản hồi
          của bạn.
        </p>
        <button
          @click="closeSuccessModal"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  Users as UsersIcon,
  X as XIcon,
  Check as CheckIcon,
  CalendarX as CalendarXIcon,
  Flag as FlagIcon,
  Star as StarIcon,
} from "lucide-vue-next";

// Custom Golf icon component
const GolfIcon = {
  template: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 18v-6"></path>
      <path d="M8 18v-1"></path>
      <path d="M16 18v-3"></path>
      <path d="M12 12l8-4"></path>
      <path d="M2 16l10-4"></path>
      <circle cx="12" cy="4" r="1"></circle>
      <path d="M12 8a4 4 0 0 0 4-4"></path>
      <line x1="2" y1="18" x2="22" y2="18"></line>
    </svg>
  `,
};

// State
const bookingHistory = ref([]);
const golfCourses = ref([]);
const filters = ref({
  startDate: "",
  endDate: "",
  golfCourseId: "",
  status: "",
});
const showDetailsModal = ref(false);
const showSuccessModal = ref(false);
const selectedBooking = ref({});
const rating = ref({
  course: 0,
  caddie: 0,
  comment: "",
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Stats
const stats = ref({
  totalGames: 0,
  favoriteCourse: "",
  popularTime: "",
  avgPlayers: 0,
});

// Computed
const filteredHistory = computed(() => {
  return bookingHistory.value.filter((booking) => {
    // Filter by date range
    if (
      filters.value.startDate &&
      new Date(booking.date) < new Date(filters.value.startDate)
    ) {
      return false;
    }
    if (
      filters.value.endDate &&
      new Date(booking.date) > new Date(filters.value.endDate)
    ) {
      return false;
    }

    // Filter by golf course
    if (
      filters.value.golfCourseId &&
      booking.golfCourseId !== filters.value.golfCourseId
    ) {
      return false;
    }

    // Filter by status
    if (filters.value.status && booking.status !== filters.value.status) {
      return false;
    }

    return true;
  });
});

const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredHistory.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredHistory.value.length / itemsPerPage));
});

const startItem = computed(() => {
  if (filteredHistory.value.length === 0) return 0;
  return (currentPage.value - 1) * itemsPerPage + 1;
});

const endItem = computed(() => {
  if (filteredHistory.value.length === 0) return 0;
  return Math.min(
    currentPage.value * itemsPerPage,
    filteredHistory.value.length
  );
});

const visiblePageNumbers = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;

  if (totalPages.value <= maxPagesToShow) {
    // If we have fewer pages than the max, show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always include current page
    pages.push(currentPage.value);

    // Add pages before current page
    for (let i = 1; i <= 2; i++) {
      if (currentPage.value - i > 0) {
        pages.unshift(currentPage.value - i);
      }
    }

    // Add pages after current page
    for (let i = 1; i <= 2; i++) {
      if (currentPage.value + i <= totalPages.value) {
        pages.push(currentPage.value + i);
      }
    }

    // Sort the pages
    pages.sort((a, b) => a - b);
  }

  return pages;
});

// Methods
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getStatusLabel(status) {
  const statusMap = {
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy",
    NO_SHOW: "Không đến",
  };
  return statusMap[status] || status;
}

function getPaymentMethodLabel(method) {
  const methodMap = {
    CREDIT_CARD: "Thẻ tín dụng",
    BANK_TRANSFER: "Chuyển khoản",
    CASH: "Tiền mặt",
    E_WALLET: "Ví điện tử",
  };
  return methodMap[method] || method;
}

function getPlayerTypeLabel(type) {
  const typeMap = {
    MEMBER: "Thành viên",
    GUEST: "Khách",
    CHILD: "Trẻ em",
  };
  return typeMap[type] || type;
}

function applyFilters() {
  console.log("Applying filters:", filters.value);
  // In a real app, this might fetch data from an API
  currentPage.value = 1; // Reset to first page when filters change
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function viewBookingDetails(booking) {
  selectedBooking.value = booking;
  showDetailsModal.value = true;

  // Reset rating form
  rating.value = {
    course: 0,
    caddie: 0,
    comment: "",
  };
}

function closeDetailsModal() {
  showDetailsModal.value = false;
}

function submitRating() {
  console.log("Submitting rating:", rating.value);

  // In a real app, this would send the rating to the server

  // Update the booking to show it has been rated
  const index = bookingHistory.value.findIndex(
    (b) => b.id === selectedBooking.value.id
  );
  if (index !== -1) {
    bookingHistory.value[index].hasRated = true;
    selectedBooking.value.hasRated = true;
  }

  showDetailsModal.value = false;
  showSuccessModal.value = true;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

function calculateStats() {
  // Calculate total games
  stats.value.totalGames = bookingHistory.value.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  // Find favorite course
  const courseCounts = {};
  bookingHistory.value.forEach((booking) => {
    if (booking.status === "COMPLETED") {
      courseCounts[booking.golfCourseName] =
        (courseCounts[booking.golfCourseName] || 0) + 1;
    }
  });

  let maxCount = 0;
  let favoriteCourse = "";
  for (const [course, count] of Object.entries(courseCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteCourse = course;
    }
  }
  stats.value.favoriteCourse = favoriteCourse || "Chưa có";

  // Find popular time
  const timeCounts = {};
  bookingHistory.value.forEach((booking) => {
    if (booking.status === "COMPLETED") {
      const hour = booking.startTime.split(":")[0];
      const timeRange = `${hour}:00 - ${parseInt(hour) + 1}:00`;
      timeCounts[timeRange] = (timeCounts[timeRange] || 0) + 1;
    }
  });

  maxCount = 0;
  let popularTime = "";
  for (const [time, count] of Object.entries(timeCounts)) {
    if (count > maxCount) {
      maxCount = count;
      popularTime = time;
    }
  }
  stats.value.popularTime = popularTime || "Chưa có";

  // Calculate average players
  const completedBookings = bookingHistory.value.filter(
    (b) => b.status === "COMPLETED"
  );
  if (completedBookings.length > 0) {
    const totalPlayers = completedBookings.reduce(
      (sum, booking) => sum + booking.playerCount,
      0
    );
    stats.value.avgPlayers = (totalPlayers / completedBookings.length).toFixed(
      1
    );
  } else {
    stats.value.avgPlayers = "0";
  }
}

// Load mock data
function loadData() {
  // Load golf courses
  golfCourses.value = [
    { id: "GC001", name: "Kings Island Golf Resort" },
    { id: "GC002", name: "Vinpearl Golf Nam Hội An" },
    { id: "GC003", name: "BRG Da Nang Golf Resort" },
    { id: "GC004", name: "The Bluffs Ho Tram Strip" },
    { id: "GC005", name: "Long Thanh Golf Club" },
  ];

  // Load booking history
  const mockHistory = [
    {
      id: "BK001",
      date: "2025-04-15",
      startTime: "07:30",
      golfCourseId: "GC001",
      golfCourseName: "Kings Island Golf Resort",
      golfCourseAddress: "Đồng Mô, Sơn Tây, Hà Nội",
      holeCount: 18,
      playerCount: 4,
      greenFee: 1800000,
      caddieFee: 500000,
      cartFee: 300000,
      otherFees: 100000,
      discount: 0,
      totalAmount: 2700000,
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Trần Văn B", type: "GUEST" },
        { name: "Lê Thị C", type: "GUEST" },
        { name: "Phạm Văn D", type: "GUEST" },
      ],
    },
    {
      id: "BK002",
      date: "2025-03-20",
      startTime: "09:00",
      golfCourseId: "GC002",
      golfCourseName: "Vinpearl Golf Nam Hội An",
      golfCourseAddress: "Thăng Bình, Quảng Nam",
      holeCount: 18,
      playerCount: 2,
      greenFee: 2000000,
      caddieFee: 500000,
      cartFee: 300000,
      otherFees: 0,
      discount: 300000,
      totalAmount: 2500000,
      paymentMethod: "BANK_TRANSFER",
      status: "COMPLETED",
      hasRated: true,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Hoàng Thị E", type: "GUEST" },
      ],
    },
    {
      id: "BK003",
      date: "2025-02-10",
      startTime: "14:00",
      golfCourseId: "GC003",
      golfCourseName: "BRG Da Nang Golf Resort",
      golfCourseAddress: "Ngũ Hành Sơn, Đà Nẵng",
      holeCount: 18,
      playerCount: 3,
      greenFee: 1700000,
      caddieFee: 450000,
      cartFee: 300000,
      otherFees: 150000,
      discount: 0,
      totalAmount: 2600000,
      paymentMethod: "CASH",
      status: "COMPLETED",
      hasRated: true,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Vũ Thị F", type: "GUEST" },
        { name: "Đặng Văn G", type: "GUEST" },
      ],
    },
    {
      id: "BK004",
      date: "2025-01-05",
      startTime: "08:30",
      golfCourseId: "GC001",
      golfCourseName: "Kings Island Golf Resort",
      golfCourseAddress: "Đồng Mô, Sơn Tây, Hà Nội",
      holeCount: 9,
      playerCount: 2,
      greenFee: 1000000,
      caddieFee: 300000,
      cartFee: 200000,
      otherFees: 0,
      discount: 0,
      totalAmount: 1500000,
      paymentMethod: "E_WALLET",
      status: "CANCELLED",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Ngô Thị H", type: "GUEST" },
      ],
    },
    {
      id: "BK005",
      date: "2024-12-25",
      startTime: "10:00",
      golfCourseId: "GC004",
      golfCourseName: "The Bluffs Ho Tram Strip",
      golfCourseAddress: "Xuyên Mộc, Bà Rịa - Vũng Tàu",
      holeCount: 18,
      playerCount: 4,
      greenFee: 2500000,
      caddieFee: 600000,
      cartFee: 400000,
      otherFees: 200000,
      discount: 500000,
      totalAmount: 3200000,
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
      hasRated: true,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Trần Văn B", type: "GUEST" },
        { name: "Lê Thị C", type: "GUEST" },
        { name: "Phạm Văn D", type: "GUEST" },
      ],
    },
    {
      id: "BK006",
      date: "2024-11-15",
      startTime: "07:00",
      golfCourseId: "GC005",
      golfCourseName: "Long Thanh Golf Club",
      golfCourseAddress: "Long Thành, Đồng Nai",
      holeCount: 18,
      playerCount: 3,
      greenFee: 1800000,
      caddieFee: 450000,
      cartFee: 300000,
      otherFees: 0,
      discount: 0,
      totalAmount: 2550000,
      paymentMethod: "BANK_TRANSFER",
      status: "NO_SHOW",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Vũ Thị F", type: "GUEST" },
        { name: "Đặng Văn G", type: "GUEST" },
      ],
    },
    {
      id: "BK007",
      date: "2024-10-20",
      startTime: "13:30",
      golfCourseId: "GC002",
      golfCourseName: "Vinpearl Golf Nam Hội An",
      golfCourseAddress: "Thăng Bình, Quảng Nam",
      holeCount: 18,
      playerCount: 2,
      greenFee: 2000000,
      caddieFee: 500000,
      cartFee: 300000,
      otherFees: 100000,
      discount: 0,
      totalAmount: 2900000,
      paymentMethod: "CASH",
      status: "COMPLETED",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Hoàng Thị E", type: "GUEST" },
      ],
    },
    {
      id: "BK008",
      date: "2024-09-05",
      startTime: "08:00",
      golfCourseId: "GC003",
      golfCourseName: "BRG Da Nang Golf Resort",
      golfCourseAddress: "Ngũ Hành Sơn, Đà Nẵng",
      holeCount: 9,
      playerCount: 1,
      greenFee: 900000,
      caddieFee: 300000,
      cartFee: 200000,
      otherFees: 0,
      discount: 0,
      totalAmount: 1400000,
      paymentMethod: "E_WALLET",
      status: "COMPLETED",
      hasRated: true,
      players: [{ name: "Nguyễn Văn A", type: "MEMBER" }],
    },
    {
      id: "BK009",
      date: "2024-08-15",
      startTime: "15:30",
      golfCourseId: "GC001",
      golfCourseName: "Kings Island Golf Resort",
      golfCourseAddress: "Đồng Mô, Sơn Tây, Hà Nội",
      holeCount: 18,
      playerCount: 4,
      greenFee: 1800000,
      caddieFee: 500000,
      cartFee: 300000,
      otherFees: 200000,
      discount: 300000,
      totalAmount: 2500000,
      paymentMethod: "CREDIT_CARD",
      status: "COMPLETED",
      hasRated: true,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Trần Văn B", type: "GUEST" },
        { name: "Lê Thị C", type: "GUEST" },
        { name: "Phạm Văn D", type: "GUEST" },
      ],
    },
    {
      id: "BK010",
      date: "2024-07-20",
      startTime: "09:30",
      golfCourseId: "GC004",
      golfCourseName: "The Bluffs Ho Tram Strip",
      golfCourseAddress: "Xuyên Mộc, Bà Rịa - Vũng Tàu",
      holeCount: 18,
      playerCount: 2,
      greenFee: 2500000,
      caddieFee: 600000,
      cartFee: 400000,
      otherFees: 0,
      discount: 0,
      totalAmount: 3500000,
      paymentMethod: "BANK_TRANSFER",
      status: "COMPLETED",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Ngô Thị H", type: "GUEST" },
      ],
    },
    {
      id: "BK011",
      date: "2024-06-10",
      startTime: "07:30",
      golfCourseId: "GC005",
      golfCourseName: "Long Thanh Golf Club",
      golfCourseAddress: "Long Thành, Đồng Nai",
      holeCount: 18,
      playerCount: 3,
      greenFee: 1800000,
      caddieFee: 450000,
      cartFee: 300000,
      otherFees: 150000,
      discount: 200000,
      totalAmount: 2500000,
      paymentMethod: "CASH",
      status: "CANCELLED",
      hasRated: false,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Vũ Thị F", type: "GUEST" },
        { name: "Đặng Văn G", type: "GUEST" },
      ],
    },
    {
      id: "BK012",
      date: "2024-05-05",
      startTime: "14:00",
      golfCourseId: "GC002",
      golfCourseName: "Vinpearl Golf Nam Hội An",
      golfCourseAddress: "Thăng Bình, Quảng Nam",
      holeCount: 9,
      playerCount: 2,
      greenFee: 1000000,
      caddieFee: 300000,
      cartFee: 200000,
      otherFees: 0,
      discount: 0,
      totalAmount: 1500000,
      paymentMethod: "E_WALLET",
      status: "COMPLETED",
      hasRated: true,
      players: [
        { name: "Nguyễn Văn A", type: "MEMBER" },
        { name: "Hoàng Thị E", type: "GUEST" },
      ],
    },
  ];

  bookingHistory.value = mockHistory;

  // Calculate stats
  calculateStats();
}

// Lifecycle hooks
onMounted(() => {
  loadData();
});
</script>
