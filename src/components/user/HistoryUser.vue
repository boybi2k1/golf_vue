<template>
  <div class="bg-white min-h-screen">
    <!-- Header section -->
    <div class="bg-green-600 p-6 text-white">
      <h1 class="text-2xl font-bold">Lịch sử chơi golf</h1>
      <p class="mt-2">Xem lại các lần đặt sân và chơi golf của bạn</p>
    </div>

    <!-- Filter section -->
    <!-- <div class="bg-white p-4 shadow-md mb-6">
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
    </div> -->

    <!-- Stats section -->
    <!-- <div class="container mx-auto px-4 mb-6">
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
    </div> -->

    <!-- History list -->
    <div class="container mx-auto px-4 mb-8">
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Lịch sử đặt sân</h2>
        </div>

        <div v-if="bookings.length === 0" class="text-center py-8">
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
                  v-for="booking in bookings"
                  :key="booking.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(booking.bookingDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.teeTime.startTime }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3"
                      ></div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ booking.golfCourse.name }}
                        </div>
                        <div class="text-xs text-gray-500">
                          {{ booking.golfCourse.hold }} hố
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.numPlayers }} người
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatPrice(booking.totalCost) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'px-2 py-1 text-xs rounded-full': true,
                        'bg-green-100 text-green-800':
                          booking.status === 'CONFIRMED',
                        'bg-red-100 text-red-800':
                          booking.status === 'CANCELLED',
                        'bg-gray-100 text-gray-800':
                          booking.status === 'NO_SHOW',
                      }"
                    >
                      {{ getStatusBookingText(booking.status) }}
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
          <div
            class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
          >
            <div
              class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end"
            >
              <div>
                <nav
                  class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    @click="searchQuery.page--"
                    :disabled="pagination.page + 1 === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Previous</span>
                    <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <span
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
                    Trang {{ pagination.page + 1 }} /
                    {{ pagination.totalPages }}
                  </span>
                  <button
                    @click="searchQuery.page++"
                    :disabled="pagination.page + 1 === pagination.totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span class="sr-only">Next</span>
                    <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import {
  Calendar as CalendarIcon,
  MapPin as MapPinIcon,
  Clock as ClockIcon,
  X as XIcon,
  CalendarX as CalendarXIcon,
  Flag as FlagIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "lucide-vue-next";
import {
  formatDate,
  formatPrice,
  getStatusLabel,
  getPaymentMethodLabel,
  getPlayerTypeLabel,
} from "@/utils/format";
import { useBookingStore } from "../../stores/booking";
import { useAuthStore } from "../../stores/auth";
import { storeToRefs } from "pinia";
import { on } from "process";
import { getStatusBookingText } from "../../utils/format";

const authStore = useAuthStore();
const bookingStore = useBookingStore();
const { bookings, pagination } = storeToRefs(bookingStore);
console.log(bookings.value);

const showDetailsModal = ref(false);
const selectedBooking = ref(null);
const showSuccessModal = ref(false);

const searchQuery = reactive({
  userId: localStorage.getItem("userId"),
  page: 0,
  size: 10,
  key: "",
  value: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  golfCourseId: "",
  bookingDate: "",
  status: "",
});
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedBooking.value = null;
};
const viewBookingDetails = (booking) => {
  selectedBooking.value = booking;
  showDetailsModal.value = true;
};
const closeSuccessModal = () => {
  showSuccessModal.value = false;
};
onMounted(async () => {
  await bookingStore.searchBooking(searchQuery);
});
</script>
