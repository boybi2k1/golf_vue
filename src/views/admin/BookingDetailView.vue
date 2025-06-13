<template>
  <div class="flex-1 bg-gray-50 min-h-screen">
    <div class="container mx-auto py-12 px-4">
      <div class="bg-white shadow rounded-lg overflow-scroll max-h-[80vh]">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-green-400 to-blue-500 text-white py-6 px-8"
        >
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-semibold">
                {{
                  isEditMode ? "Chỉnh Sửa Chi Tiết Đặt Sân" : "Chi Tiết Đặt Sân"
                }}
              </h2>
              <p class="text-gray-100">
                Mã Đặt Sân: {{ booking?.bookingCode || "N/A" }}
              </p>
            </div>
            <div class="space-x-3">
              <button
                v-if="!isEditMode"
                @click="handleEditMode"
                class="bg-white text-green-500 hover:bg-green-50 hover:text-green-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
              >
                Chỉnh Sửa
              </button>
              <button
                @click="goBack"
                class="bg-red-500 text-white hover:bg-red-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
              >
                Quay Lại
              </button>
            </div>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="px-8 py-4 border-b border-gray-100">
          <div class="flex items-center space-x-4 mb-4">
            <button
              v-if="booking?.status === 'CONFIRMED'"
              @click="handleCheckIn"
              class="bg-green-500 text-white hover:bg-green-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
            >
              Nhận Sân
            </button>
            <button
              v-if="booking?.status === 'PENDING'"
              @click="handleConfirm"
              class="bg-green-500 text-white hover:bg-green-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
            >
              Xác Nhận
            </button>
            <button
              v-if="booking?.status === 'PLAYING'"
              @click="openCheckoutModal"
              class="bg-blue-500 text-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
            >
              Trả Sân
            </button>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-gray-500">Trạng Thái:</span>
              <span
                :class="getStatusBadgeClass(booking?.status)"
                class="px-4 py-2 rounded-full text-sm font-semibold"
              >
                {{ getStatusBookingText(booking?.status) }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              Cập nhật lúc: {{ formatDateTime(booking?.updatedAt) }}
            </div>
          </div>
        </div>

        <!-- Booking Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          <!-- Golf Course -->
          <div class="mb-4">
            <label
              for="golfCourse"
              class="block text-sm font-medium text-gray-700"
              >Sân Golf</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.golfCourse?.name }}
            </div>
            <select
              v-else
              id="golfCourse"
              v-model="updateBookingForm.golfCourseId"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Chọn Sân Golf</option>
              <option
                v-for="course in golfCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>
          </div>

          <!-- Booking Date -->
          <div class="mb-4">
            <label
              for="bookingDate"
              class="block text-sm font-medium text-gray-700"
              >Ngày Đặt Sân</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ formatDate(booking?.bookingDate) }}
            </div>
            <input
              v-else
              id="bookingDate"
              type="date"
              v-model="updateBookingForm.bookingDate"
              :min="minBookingDate"
              :max="maxBookingDate"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <!-- Tee Time -->
          <div class="mb-4">
            <label for="teeTime" class="block text-sm font-medium text-gray-700"
              >Giờ Tee Off</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.teeTime?.startTime }}
            </div>
            <select
              v-else
              id="teeTime"
              v-model="updateBookingForm.teeTimeId"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Chọn Giờ Tee Off</option>
              <option
                v-for="time in mergedTeeTimes"
                :key="time.id"
                :value="time.id"
              >
                {{ time.startTime }}
              </option>
            </select>
          </div>

          <!-- Number of Holes -->
          <div class="mb-4">
            <label for="holes" class="block text-sm font-medium text-gray-700"
              >Số Hố</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.numberOfHoles }} hố
            </div>
            <select
              v-else
              id="holes"
              v-model="updateBookingForm.numberOfHoles"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option
                v-for="hole in listHoles"
                :key="hole.id"
                :value="hole.value"
              >
                {{ hole.label }}
              </option>
            </select>
          </div>

          <!-- Customer Name -->
          <div class="mb-4">
            <label
              for="customerName"
              class="block text-sm font-medium text-gray-700"
              >Tên Khách Hàng</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.fullName }}
            </div>
            <input
              v-else
              id="customerName"
              type="text"
              v-model="updateBookingForm.fullName"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <!-- Number of Players -->
          <div class="mb-4">
            <label
              for="numPlayers"
              class="block text-sm font-medium text-gray-700"
              >Số Người Chơi</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.numPlayers }} người
            </div>
            <input
              v-else
              id="numPlayers"
              type="number"
              v-model="updateBookingForm.numPlayers"
              min="1"
              max="4"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <!-- Phone -->
          <div class="mb-4">
            <label for="phone" class="block text-sm font-medium text-gray-700"
              >Số Điện Thoại</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.phone }}
            </div>
            <input
              v-else
              id="phone"
              type="tel"
              v-model="updateBookingForm.phone"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50"
            >
              {{ booking?.email || "N/A" }}
            </div>
            <input
              v-else
              id="email"
              type="email"
              v-model="updateBookingForm.email"
              class="border border-gray-300 mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <!-- Check-in/Check-out Times (View Mode Only) -->
          <div
            v-if="
              !isEditMode && (booking?.checkInTime || booking?.checkOutTime)
            "
            class="lg:col-span-3"
          >
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Thời Gian Nhận/Trả Sân
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="booking?.checkInTime" class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Nhận Sân</label
                >
                <div class="mt-1 p-3 border rounded-md bg-green-50">
                  {{ formatDateTime(booking?.checkInTime) }}
                </div>
              </div>
              <div v-if="booking?.checkOutTime" class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Trả Sân</label
                >
                <div class="mt-1 p-3 border rounded-md bg-blue-50">
                  {{ formatDateTime(booking?.checkOutTime) }}
                  <div
                    v-if="booking?.checkOutBy"
                    class="text-sm text-blue-700 mt-1"
                  >
                    Bởi: {{ booking?.checkOutBy }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-4 lg:col-span-3">
            <label for="notes" class="block text-sm font-medium text-gray-700"
              >Ghi Chú</label
            >
            <div
              v-if="!isEditMode"
              class="mt-1 p-3 border rounded-md bg-gray-50 min-h-[50px]"
            >
              {{ booking?.note }}
            </div>
            <textarea
              v-else
              id="notes"
              v-model="updateBookingForm.note"
              rows="3"
              class="border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md"
            ></textarea>
          </div>

          <!-- Services -->
          <div class="mb-4 lg:col-span-3">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700"
                >Dịch Vụ</label
              >
              <button
                v-if="isEditMode"
                @click="addService"
                class="bg-green-500 text-white hover:bg-green-600 font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none"
              >
                Thêm Dịch Vụ
              </button>
            </div>
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
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Số lượng
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Đơn giá
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Thành tiền
                    </th>
                    <th
                      v-if="isEditMode"
                      class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(item, index) in isEditMode
                      ? editBookingDetails
                      : bookingDetail"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="!isEditMode" class="text-sm text-gray-900">
                        {{ item.service?.name }}
                      </div>
                      <select
                        v-else
                        v-model="item.serviceId"
                        @change="onServiceChange(index)"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">Chọn Dịch Vụ</option>
                        <option
                          v-for="service in servicesForBooking"
                          :key="service.id"
                          :value="service.id"
                        >
                          {{ service.name }}
                        </option>
                      </select>
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div v-if="!isEditMode" class="text-sm text-gray-900">
                        {{ item.quantity }}
                      </div>
                      <input
                        v-else
                        type="number"
                        min="1"
                        v-model.number="item.quantity"
                        @input="updateTotalPrice(index)"
                        class="mt-1 block w-20 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md mx-auto"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div v-if="!isEditMode" class="text-sm text-gray-900">
                        {{
                          formatPrice(
                            item.service?.type === "GOLF_CLUB"
                              ? item.tool?.rentPrice
                              : item.service?.price
                          )
                        }}
                      </div>
                      <input
                        v-else
                        type="number"
                        min="0"
                        step="1000"
                        v-model="item.unitPrice"
                        class="mt-1 block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md mx-auto"
                      />
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-center font-semibold text-green-600"
                    >
                      {{ formatPrice(item.totalPrice || 0) }}
                    </td>
                    <td
                      v-if="isEditMode"
                      class="px-6 py-4 whitespace-nowrap text-center"
                    >
                      <button
                        @click="removeService(index)"
                        class="text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <svg
                          class="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr
                    v-if="
                      (!bookingDetail || bookingDetail.length === 0) &&
                      !isEditMode
                    "
                  >
                    <td
                      colspan="6"
                      class="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                    >
                      Không có dịch vụ nào được đặt
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Payment Summary -->
        <div class="bg-gray-100 p-8 border-t border-gray-200">
          <h3 class="text-xl font-semibold text-gray-700 mb-4">
            Tổng Kết Thanh Toán
          </h3>

          <div class="flex justify-between py-2">
            <span
              >Phí Sân Golf ({{
                booking?.numPlayers || updateBookingForm.numPlayers
              }}
              người):</span
            >
            <span class="font-semibold">{{
              formatPrice(
                isEditMode ? calPriceCourse : booking?.priceByCourse || 0
              )
            }}</span>
          </div>

          <div class="flex justify-between py-2">
            <span>Phí Dịch Vụ:</span>
            <span class="font-semibold">{{
              formatPrice(
                isEditMode ? servicesTotal : booking?.priceByService || 0
              )
            }}</span>
          </div>

          <div
            v-if="booking.discountPromotion > 0"
            class="flex justify-between py-2"
          >
            <span>Khuyễn mãi sự kiện:</span>

            <span class="font-semibold text-red-500"
              >{{ booking.discountPromotion }} %</span
            >
          </div>

          <div class="flex justify-between py-2">
            <span>Đặt Cọc:</span>
            <span class="font-semibold text-orange-600">{{
              formatPrice(
                isEditMode ? depositAmount : booking?.depositAmount || 0
              )
            }}</span>
          </div>

          <div
            class="border-t border-gray-300 mt-4 pt-4 flex justify-between font-bold text-lg"
          >
            <span>Tổng Cộng:</span>
            <span class="text-green-600">{{
              formatPrice(isEditMode ? totalPrice : booking?.totalCost || 0)
            }}</span>
          </div>

          <div
            v-if="!isEditMode"
            class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div class="flex items-center">
              <svg
                class="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              <span class="font-medium text-blue-800"
                >Đã thanh toán qua VNPay</span
              >
            </div>
          </div>

          <div v-if="isEditMode" class="mt-6">
            <button
              @click="saveBooking"
              :disabled="
                !updateBookingForm.fullName ||
                !updateBookingForm.phone ||
                !updateBookingForm.teeTimeId
              "
              :class="[
                'w-full py-3 rounded-md shadow-sm font-semibold',
                !updateBookingForm.fullName ||
                !updateBookingForm.phone ||
                !updateBookingForm.teeTimeId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600 focus:outline-none',
              ]"
            >
              Lưu Thay Đổi
            </button>
            <button
              @click="isEditMode = false"
              class="w-full mt-3 py-3 rounded-md shadow-sm font-semibold border border-gray-400 hover:bg-gray-100 focus:outline-none"
            >
              Hủy Bỏ
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showCheckoutModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold mb-4">Thanh toán khi hoàn thành</h2>
        <div class="mb-3 flex justify-between">
          <span>Tổng tiền:</span>
          <span class="font-semibold text-green-700">{{
            formatPrice(booking.totalCost)
          }}</span>
        </div>
        <div class="mb-3 flex justify-between">
          <span>Đã thanh toán trước:</span>
          <span class="font-semibold text-blue-700">{{
            formatPrice(booking.depositAmount || 0)
          }}</span>
        </div>
        <div class="mb-3 flex justify-between">
          <span>Số tiền còn lại:</span>
          <span class="font-bold text-red-600">{{
            formatPrice(booking.totalCost - booking.depositAmount)
          }}</span>
        </div>
        <div class="mb-4">
          <label class="block mb-1 font-medium">Phương thức thanh toán</label>
          <select
            v-model="checkoutForm.paymentMethod"
            class="w-full border rounded px-3 py-2"
          >
            <option value="">Chọn phương thức</option>
            <option value="cash">Tiền mặt</option>
            <option value="bank">Chuyển khoản</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="showCheckoutModal = false"
            class="px-4 py-2 border rounded"
          >
            Hủy
          </button>
          <button
            :disabled="!checkoutForm.paymentMethod"
            @click="handleCheckOut"
            class="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            Xác nhận & Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Check-in/Check-out handlers
async function handleCheckIn() {
  if (!booking.value.id) return;
  const param = {
    bookingCode: booking.value.bookingCode,
  };
  try {
    await bookingStore.checkIn({ param });
    showToast("Check-in thành công", "success");
    await fetchData();
    isEditMode.value = false;
  } catch (e) {
    showToast("Check-in thất bại", "error");
  }
}
async function handleConfirm() {


  if (!booking.value.id) return;
  try {
    const data = {
      bookingId: booking.value.id,
      status: "CONFIRMED",
    };
    await bookingStore.confirm(data);
    showToast("Xác nhận thành công", "success");
    await fetchData();
    isEditMode.value = false;
  } catch (e) {
    showToast("Xác nhận thất bại", "error");
  }
}

const showCheckoutModal = ref(false);
const checkoutForm = reactive({
  paymentMethod: "",
});

function openCheckoutModal() {
  showCheckoutModal.value = true;
  checkoutForm.paymentMethod = "";
}
async function handleCheckOut() {
  if (!booking.value.id) return;
  try {
    const param = {
      bookingCode: booking.value.bookingCode,
      paymentMethod: checkoutForm.paymentMethod,
    };
    await bookingStore.checkOut({ param });
    showToast("Check-out thành công", "success");
    await fetchData();
    showCheckoutModal.value = false;
    isEditMode.value = false;
  } catch (e) {
    showToast("Check-out thất bại", "error");
  }
}
import { ref, onMounted, reactive, computed, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useBookingStore } from "../../stores/booking";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  getStatusBookingText,
} from "../../utils/utils";
import { storeToRefs } from "pinia";
import { useToolStore } from "../../stores/tool";
import { useServicesStore } from "../../stores/services";
import { useTeeTimeStore } from "../../stores/tee_time";
import { useGolfCourseStore } from "../../stores/golf_course";
import { watch } from "vue";
import { usePaymentStore } from "../../stores/payment";
const showToast = inject("showToast");
// store
const courseStore = useGolfCourseStore();
const teeTimeStore = useTeeTimeStore();
const serviceStore = useServicesStore();
const pyamentStore = usePaymentStore();
const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();
const booking = ref({});
const bookingDetail = ref([]);
const loading = ref(true);
const isEditMode = ref(false);
const teeTimeSelected = ref(null);
const originalTeeTimeId = ref(null);
const editBookingDetails = reactive([]);

const updateBookingForm = reactive({
  id: "",
  bookingCode: "",
  phone: "",
  fullName: "",
  numberOfHoles: 9,
  email: "",
  golferId: null,
  golfCourseId: "", // ID of the selected golf course
  bookingDate: new Date().toISOString().split("T")[0],
  numPlayers: 1,
  teeTimeId: null, // ID of the selected tee time
  teeTime: null,
  golfCourse: null,
  status: "PENDING",
  depositAmount: 0,
  priceByCourse: 0,
  priceByService: 0,
  priceByTeeTime: 0, // Giá giờ chơi theo teeTime đã chọn
  totalCost: 0,
  priceByCourse: 0,
});
const getStatusBadgeClass = (status) => {
  const classMap = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PLAYING: "bg-green-100 text-green-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELED: "bg-red-100 text-red-800",
  };
  return classMap[status] || "bg-gray-100 text-gray-800";
};
function handleEditMode() {
  isEditMode.value = true;
  originalTeeTimeId.value = booking.value.teeTime.id;
  Object.assign(updateBookingForm, booking.value);
  updateBookingForm.golfCourseId = booking.value.golfCourse.id;
  updateBookingForm.teeTimeId = booking.value.teeTime.id;
  updateBookingForm.priceByTeeTime = booking.value.teeTime.price;
  teeTimeSelected.value = booking.value.teeTime;
  Object.assign(editBookingDetails, bookingDetail.value);
}

const mergedTeeTimes = computed(() => {
  // Nếu chưa hold tee time thì trả về danh sách gốc
  if (!teeTimeSelected.value || !teeTimeSelected.value.id) {
    return availableTeeTimes.value;
  }
  // Nếu tee time đang hold đã có trong danh sách thì trả về như cũ
  if (availableTeeTimes.value.some((t) => t.id === teeTimeSelected.value.id)) {
    return availableTeeTimes.value;
  }
  // Nếu chưa có thì thêm vào
  return [...availableTeeTimes.value, teeTimeSelected.value];
});
async function fetchData() {
  loading.value = true;
  const id = route.params.id;
  try {
    // Always use getBookingById for detail
    const res = await bookingStore.getBookingById(id);
    booking.value = res || {};
    const detail = await bookingStore.getBookingDetailByBookingId(id);
    bookingDetail.value = detail || [];
  } finally {
    loading.value = false;
  }
}

const selectedTeeTimePrice = computed(() => {
  if (!updateBookingForm.teeTimeId) return 0;
  const teeTime = mergedTeeTimes.value.find(
    (t) => t.id === updateBookingForm.teeTimeId
  );
  return teeTime ? teeTime.price : 0;
});

// Tự động cập nhật giá khi chọn teeTime mới
watch(
  () => updateBookingForm.teeTimeId,
  (newVal) => {
    updateBookingForm.priceByTeeTime = selectedTeeTimePrice.value;
  }
);
// Tự động cập nhật giá khi nhập số lượng người chơi va dich vụ
watch(
  () => updateBookingForm.numPlayers,
  (newVal) => {
    updateBookingForm.totalCost = selectedTeeTimePrice.value * newVal;
  }
);

const { golfCourses } = storeToRefs(courseStore);
const { availableTeeTimes } = storeToRefs(teeTimeStore);
const { servicesForBooking } = storeToRefs(serviceStore);

function goBack() {
  router.back();
}
setInterval(() => {
  if (updateBookingForm.golfCourseId && updateBookingForm.bookingDate) {
    teeTimeStore.getAvailableTeeTimes(
      updateBookingForm.golfCourseId,
      updateBookingForm.bookingDate
    );
  }
}, 30000);

watch(
  () => [updateBookingForm.golfCourseId, updateBookingForm.bookingDate],
  ([courseId, date], [oldCourseId, oldDate]) => {
    if (courseId && date && (courseId !== oldCourseId || date !== oldDate)) {
      teeTimeStore.getAvailableTeeTimes(courseId, date);
    }
  }
);
const listHoles = [
  { id: 1, label: "9 lỗ", value: 9 },
  { id: 2, label: "18 lỗ", value: 18 },
];
async function holdTeeTime(teeTimeId) {
  if (isEditMode.value && teeTimeId === originalTeeTimeId.value) return;
  if (!teeTimeId) return;
  const param = {
    teeTimeId: teeTimeId,
    holes: updateBookingForm.numberOfHoles,
  };
  try {
    const res = await teeTimeStore.holdTeeTime({ param });
    teeTimeSelected.value = res;
  } catch (error) {
    console.error("Error holding tee time:", error);
    showToast("TeeTime không có sẵn! Vui lòng chọn giờ khác", "error");
    return;
  }
}

// holdTeeTime khi thay doi teeTime
watch(
  () => updateBookingForm.teeTimeId,
  (newTeeTimeId) => {
    if (newTeeTimeId) {
      holdTeeTime(newTeeTimeId);
    } else {
      teeTimeSelected.value = null; // Nếu không có tee time, đặt lại
    }
  }
);

async function saveBooking() {
  const selectedBookingId = route.params.id;
  await bookingStore.updateBooking(selectedBookingId, {
    ...updateBookingForm,
  });
  showToast("Cập nhật đặt lịch thành công", "success");
}

// Thêm dịch vụ mới vào booking
function addService() {
  editBookingDetails.push({
    serviceId: null,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
}
// Xoá dịch vụ khỏi booking
function removeService(index) {
  editBookingDetails.splice(index, 1);
}
// Cập nhật giá dịch vụ khi thay đổi
function onServiceChange(index) {
  const selectedServiceId = editBookingDetails[index].serviceId;
  const selectedService = servicesForBooking.value.find(
    (service) => service.id === selectedServiceId
  );
  if (selectedService) {
    editBookingDetails[index].unitPrice = selectedService.price;
    editBookingDetails[index].totalPrice =
      editBookingDetails[index].unitPrice * editBookingDetails[index].quantity;
  }
}

function updateTotalPrice(index) {
  const quantity = editBookingDetails[index].quantity || 0;
  const unitPrice = editBookingDetails[index].unitPrice || 0;
  editBookingDetails[index].totalPrice = quantity * unitPrice;
}
// Cập nhật giá khi thay ddoo

// Cập nhật giá dịch vụ khi thay đổi số lượng hoặc đơn giá

const priceByHoles = computed(() => {
  // Lấy giá theo số lỗ đã chọn
  const numberHoles = updateBookingForm.numberOfHoles || 9; // Mặc định là 9 lỗ nếu không có giá trị
  const holeByCourse = golfCourses.value.find(
    (course) => course.id === updateBookingForm.golfCourseId
  )?.holes;
  return numberHoles / holeByCourse;
});
// Tính tổng tiền dịch vụ
const calPriceCourse = computed(() => {
  const numPlayers = updateBookingForm.numPlayers;
  const priceByCourse = updateBookingForm.priceByTeeTime;
  // Mặc định là 9 lỗ nếu không có giá trị
  return priceByCourse * numPlayers * priceByHoles.value;
});
const totalPrice = computed(() => {
  return calPriceCourse.value + servicesTotal.value;
});
const depositAmount = computed(() => {
  const total = totalPrice.value || 0;
  const depositAmount = total * 0.5; // Giả sử đặt cọc 30% tổng giá
  updateBookingForm.depositAmount = depositAmount;
  return depositAmount || 0;
});
console.log(booking);
const servicesTotal = computed(() => {
  console.log("check", editBookingDetails);
  return editBookingDetails.reduce(
    (total, item) => total + (item.totalPrice || 0),
    0
  );
});
onMounted(async () => {
  fetchData();
  await Promise.all([
    courseStore.getAllGolfCourses(),
    serviceStore.getServiceForBooking("OTHER"),
  ]);
});
</script>
