<script setup>
import { ref, reactive, computed, onMounted, watch, inject } from "vue";
import {
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  XIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";

import { useBookingStore } from "../../stores/booking";
import { useGolfCourseStore } from "../../stores/golf_course";
import { useTeeTimeStore } from "../../stores/tee_time";
import { storeToRefs } from "pinia";
import { useServicesStore } from "../../stores/services";
import { useToolStore } from "../../stores/tool";
import {
  checkAdminRole,
  formatDate,
  getStatusBookingText,
} from "../../utils/utils";
import ToolSelectDialog from "../../components/ToolSelectDialog.vue";
const showToast = inject("showToast");
const isAdmin = checkAdminRole();
// Stores
const bookingStore = useBookingStore();
const courseStore = useGolfCourseStore();
const teeTimeStore = useTeeTimeStore();
const serviceStore = useServicesStore();
const toolStore = useToolStore();

// State
const itemsPerPage = ref(10);
const currentPage = ref(1);
const showBookingModal = ref(false);
const showConfirmModal = ref(false);
const isViewMode = ref(false);
const isEditMode = ref(false);
const selectedBookingId = ref(null);
const bookingDetails = reactive([]);
const teeTimeSelected = ref(null);

// Tool selection dialog
const showToolDialog = ref(false);
const toolSelectIndex = ref(null);

// Form and filters
const filters = reactive({
  golfCourseId: "",
  bookingDate: "",
  status: "",
  searchKey: "",
  searchValue: "",
});
// Không cho chọn ngày đã qua cho bookingForm.bookingDate
const minBookingDate = new Date().toISOString().split("T")[0];
const maxBookingDate = computed(() => {
  const today = new Date();
  today.setDate(today.getDate() + 3); // Thay đổi số ngày theo yêu cầu
  return today.toISOString().split("T")[0];
});
const searchQuery = reactive({
  page: currentPage.value - 1,
  size: itemsPerPage.value,
  key: filters.searchKey,
  value: filters.searchValue,
  golfCourseId: filters.golfCourseId,
  bookingDate: filters.bookingDate,
  status: filters.status,
});

const bookingForm = reactive({
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
// Lấy giá giờ chơi theo teeTime đã chọn
const selectedTeeTimePrice = computed(() => {
  if (!bookingForm.teeTimeId) return 0;
  const teeTime = mergedTeeTimes.value.find(
    (t) => t.id === bookingForm.teeTimeId
  );
  return teeTime ? teeTime.price : 0;
});

// Tự động cập nhật giá khi chọn teeTime mới
watch(
  () => bookingForm.teeTimeId,
  (newVal) => {
    bookingForm.priceByTeeTime = selectedTeeTimePrice.value;
  }
);
// Tự động cập nhật giá khi nhập số lượng người chơi va dich vụ
watch(
  () => bookingForm.numPlayers,
  (newVal) => {
    bookingForm.totalCost =
      (selectedTeeTimePrice.value * newVal * bookingForm.numberOfHoles) / 9;
  }
);

const { golfCourses } = storeToRefs(courseStore);
const { availableTeeTimes } = storeToRefs(teeTimeStore);
const { allServices } = storeToRefs(serviceStore);
const { golfClubs } = storeToRefs(toolStore);
const { bookings, pagination } = storeToRefs(bookingStore);

const bookingDetailData = computed(() => {
  return bookingDetails;
});

const filteredBookings = computed(() => bookings.value);

function openNewBookingModal() {
  isEditMode.value = false;
  resetBookingForm();
  bookingForm.bookingDate = filters.bookingDate;
  showBookingModal.value = true;
}

function closeBookingModal() {
  showBookingModal.value = false;
  isEditMode.value = false;
  isViewMode.value = false;
  resetBookingForm();
  teeTimeSelected.value = null;
  // Clear availableTeeTimes if no course or date is selected
  if (!bookingForm.golfCourseId || !bookingForm.bookingDate) {
    availableTeeTimes.value = [];
  }
}

function resetBookingForm() {
  Object.assign(bookingForm, {
    id: "",
    bookingCode: "",
    phone: "",
    fullName: "",
    email: "",
    golferId: null,
    teeTimeId: "",
    golfCourseId: "",
    golfCourse: null,
    bookingDate: new Date().toISOString().split("T")[0],
    teeTime: null,
    numPlayers: 1,
    priceByCourse: 0,
    priceByService: 0,
    status: "PENDING",
    depositAmount: 0,
    isDeposit: 0,
    totalCost: 0,
  });
  bookingDetails.length = 0;
}

async function saveBooking() {
  const newBooking = await bookingStore.createBooking(bookingForm);
  addBookingDetailToBooking(newBooking.id);
  showToast("Đặt lịch thành công!", "success");
  closeBookingModal();
}

function addService() {
  bookingDetails.push({
    serviceId: "",
    toolId: null,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
}

function removeService(index) {
  bookingDetails.splice(index, 1);
}

function confirmDeleteBooking(booking) {
  selectedBookingId.value = booking.id;
  showConfirmModal.value = true;
}

function deleteBooking() {
  if (selectedBookingId.value) {
    console.log(bookingStore);
    console.log(typeof bookingStore.softDelete);
    bookingStore.softDelete(selectedBookingId.value);

    showConfirmModal.value = false;
  }
}
//khi chon teetime thi goi luon api teetime hold
async function holdTeeTime(teeTimeId) {
  if (!teeTimeId) return;
  const param = {
    teeTimeId: teeTimeId,
    holes: bookingForm.numberOfHoles,
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
  () => bookingForm.teeTimeId,
  (newTeeTimeId) => {
    if (newTeeTimeId) {
      holdTeeTime(newTeeTimeId);
    } else {
      teeTimeSelected.value = null; // Nếu không có tee time, đặt lại
    }
  }
);

function refreshData() {
  searchQuery.page = currentPage.value - 1;
  searchQuery.size = itemsPerPage.value;
  searchQuery.golfCourseId = filters.golfCourseId || "";
  searchQuery.bookingDate = filters.bookingDate || "";
  searchQuery.status = filters.status === "" ? null : filters.status;
  searchQuery.key = filters.searchKey || "";
  searchQuery.value = filters.searchValue || "";
  bookingStore.searchBooking(searchQuery);
}

const getServiceType = (serviceId) => {
  const service = allServices.value.find((s) => s.id === serviceId);
  return service ? service.type : null;
};

function addBookingDetailToBooking(bookingId) {
  bookingStore.addBookingDetailToBooking(bookingId, bookingDetails);
}

// lấy ra danh sách tee time theo sân và ngày
watch(
  () => [bookingForm.golfCourseId, bookingForm.bookingDate],
  ([courseId, date], [oldCourseId, oldDate]) => {
    if (courseId && date && (courseId !== oldCourseId || date !== oldDate)) {
      teeTimeStore.getAvailableTeeTimes(courseId, date);
    }
  }
);
// goi lai ham search khi chuyen trang
watch(currentPage, (newPage) => {
  searchQuery.page = newPage - 1;
  refreshData();
});

// hàm search booking
const onSearch = () => {
  currentPage.value = 1;
  refreshData();
};

// lam sao chon dich vu xong thi don gia tu dien

function onServiceChange(index) {
  const selectedServiceId = bookingDetails[index].serviceId;
  const selectedService = allServices.value.find(
    (service) => service.id === selectedServiceId
  );
  if (selectedService.type === "GOLF_CLUB") {
    bookingDetails[index].unitPrice = 0;
  }
  if (selectedService) {
    bookingDetails[index].unitPrice = selectedService.price;
    bookingDetails[index].totalPrice =
      bookingDetails[index].unitPrice * bookingDetails[index].quantity;
  }
}
function onToolChange(index) {
  const selectedToolId = bookingDetails[index].toolId;
  const selectedTool = golfClubs.value.find(
    (tool) => tool.id === selectedToolId
  );
  if (selectedTool) {
    bookingDetails[index].unitPrice = selectedTool.rentPrice;
    bookingDetails[index].totalPrice =
      bookingDetails[index].unitPrice * bookingDetails[index].quantity;
  }
}

function updateTotalPrice(index) {
  const quantity = bookingDetails[index].quantity || 0;
  const unitPrice = bookingDetails[index].unitPrice || 0;
  bookingDetails[index].totalPrice = quantity * unitPrice;
}

onMounted(async () => {
  await Promise.all([
    courseStore.getAllGolfCourses(),
    serviceStore.getAllServices(),
    toolStore.getAllGolfClub(),
  ]);
  refreshData();
  bookingForm.bookingDate = minBookingDate;
});
// GOI API LAY DANH SACH TEETIME AVAILABLE MOI 10S
setInterval(() => {
  if (bookingForm.golfCourseId && bookingForm.bookingDate) {
    teeTimeStore.getAvailableTeeTimes(
      bookingForm.golfCourseId,
      bookingForm.bookingDate
    );
  }
}, 30000);

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

const priceByHoles = computed(() => {
  // Lấy giá theo số lỗ đã chọn
  const numberHoles = bookingForm.numberOfHoles || 9; // Mặc định là 9 lỗ nếu không có giá trị
  const holeByCourse = golfCourses.value.find(
    (course) => course.id === bookingForm.golfCourseId
  )?.holes;
  return numberHoles / holeByCourse;
});

// Tính tổng tiền dịch vụ
const calPriceCourse = computed(() => {
  const numPlayers = bookingForm.numPlayers;
  const priceByCourse = bookingForm.priceByTeeTime;
  // Mặc định là 9 lỗ nếu không có giá trị
  return priceByCourse * numPlayers * priceByHoles.value;
});
const totalPrice = computed(() => {
  return calPriceCourse.value + servicesTotal.value;
});
const depositAmount = computed(() => {
  const total = totalPrice.value || 0;
  const depositAmount = total * 0.5; // Giả sử đặt cọc 30% tổng giá
  bookingForm.depositAmount = depositAmount;
  return depositAmount || 0;
});

const servicesTotal = computed(() => {
  return bookingDetails.reduce(
    (total, item) => total + (item.totalPrice || 0),
    0
  );
});

const listHoles = [
  { value: 9, label: "9 lỗ" },
  { value: 18, label: "18 lỗ" },
];
// format giá tiền theo định dạng VND
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};
</script>

<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">Đặt Lịch Sân Golf</h1>
        <div class="flex gap-2">
          <button
            @click="openNewBookingModal"
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon class="w-4 h-4" /> Đặt lịch mới
          </button>
          <button
            @click="refreshData"
            class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
          >
            <RefreshCwIcon class="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <!-- Sân Golf -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Sân Golf</label
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

          <!-- Ngày -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ngày</label
            >
            <input
              type="date"
              v-model="filters.bookingDate"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <!-- Trạng thái -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Trạng thái</label
            >
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="PLAYING">Đang chơi</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELED">Đã hủy</option>
            </select>
          </div>

          <!-- Tìm kiếm -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tìm kiếm</label
            >
            <div class="flex gap-2">
              <!-- Select key -->
              <select
                v-model="filters.searchKey"
                class="w-1/4 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option disabled value="">Chọn trường</option>
                <option value="bookingCode">Mã booking</option>
                <option value="phone">Số điện thoại</option>
                <option value="email">Email</option>
                <option value="name">Tên khách hàng</option>
              </select>

              <!-- Input value -->
              <div class="relative w-2/3">
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  v-model="filters.searchValue"
                  placeholder="Nhập từ khóa"
                  class="w-full border border-gray-300 rounded-md pl-5 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>

              <!-- Nút tìm kiếm nhỏ -->
              <button
                @click="onSearch"
                class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-200"
              >
                Tìm
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã đặt lịch
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sân
                </th>
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
                  Số người
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số lỗ
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng thái
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="booking in filteredBookings"
                :key="booking.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ booking.bookingCode }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 mr-3">
                      <template v-if="booking.avatar">
                        <img
                          :src="booking.avatar"
                          :alt="booking.fullName"
                          class="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                      </template>
                      <template v-else>
                        <div
                          class="flex items-center justify-center w-10 h-10 text-xl font-semibold text-gray-500 bg-gray-200 rounded-full"
                        >
                          {{ booking.fullName?.charAt(0) }}
                        </div>
                      </template>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ booking.fullName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ booking.phone }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ booking.golfCourse?.name || "Không xác định" }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(booking.bookingDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ booking.teeTime.startTime }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ booking.numPlayers }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ booking.numberOfHoles }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-yellow-100 text-yellow-800':
                        booking.status === 'pending',
                      'bg-green-100 text-green-800':
                        booking.status === 'confirmed',
                      'bg-blue-100 text-blue-800':
                        booking.status === 'completed',
                      'bg-red-100 text-red-800': booking.status === 'cancelled',
                    }"
                  >
                    {{ getStatusBookingText(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="
                        $router.push({
                          name: 'booking-detail',
                          params: { id: booking.id },
                        })
                      "
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="
                        $router.push({
                          name: 'booking-detail',
                          params: { id: booking.id },
                        })
                      "
                      class="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="confirmDeleteBooking(booking)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredBookings.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu đặt lịch
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <span
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}
                </span>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === pagination.totalPages"
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

      <!-- Booking Modal: Thêm mới -->
      <div
        v-if="showBookingModal"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop with blur effect -->
        <div
          class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        >
          <div
            class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
            @click="closeBookingModal"
          ></div>

          <!-- Modal Container -->
          <div
            class="inline-block align-bottom bg-white rounded-2xl shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-6xl"
          >
            <!-- Header with Gradient -->
            <div
              class="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 px-8 py-6 rounded-t-2xl"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <svg
                    class="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div>
                    <h2 class="text-2xl font-bold text-white">
                      Đặt lịch chơi golf
                    </h2>
                    <p class="text-green-100 text-sm">
                      Điền thông tin để hoàn tất đặt sân
                    </p>
                  </div>
                </div>
                <button
                  @click="closeBookingModal"
                  class="bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl transition-all duration-200"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="max-h-[70vh] overflow-y-auto">
              <div class="px-8 py-6">
                <!-- Course & Date Section -->
                <div class="mb-8">
                  <div class="flex items-center mb-4">
                    <div class="bg-green-100 p-2 rounded-lg mr-3">
                      <svg
                        class="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Thông tin sân & thời gian
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                      <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-medium text-gray-700"
                          >Sân Golf</label
                        >
                        <div class="flex-1 relative">
                          <select
                            v-model="bookingForm.golfCourseId"
                            class="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all duration-200"
                          >
                            <option value="">Chọn sân golf</option>
                            <option
                              v-for="course in golfCourses"
                              :key="course.id"
                              :value="course.id"
                            >
                              {{ course.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-medium text-gray-700"
                          >Ngày chơi</label
                        >
                        <input
                          type="date"
                          v-model="bookingForm.bookingDate"
                          required
                          :min="minBookingDate"
                          :max="maxBookingDate"
                          class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-medium text-gray-700"
                          >Số lỗ</label
                        >
                        <select
                          v-model="bookingForm.numberOfHoles"
                          required
                          class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
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
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center gap-4">
                        <label class="w-32 text-sm font-medium text-gray-700"
                          >Tee Time</label
                        >
                        <div class="flex-1">
                          <select
                            v-model="bookingForm.teeTimeId"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                            :class="{
                              'border-red-300 bg-red-50':
                                mergedTeeTimes.length === 0,
                            }"
                          >
                            <option v-if="mergedTeeTimes.length === 0" disabled>
                              Không có giờ khả dụng
                            </option>
                            <option
                              v-for="time in mergedTeeTimes"
                              :key="time.id"
                              :value="time.id"
                            >
                              {{ time.startTime }}
                            </option>
                          </select>
                          <p
                            v-if="mergedTeeTimes.length === 0"
                            class="text-sm text-red-500 flex items-center mt-1"
                          >
                            <svg
                              class="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              ></path>
                            </svg>
                            Không có giờ khả dụng. Vui lòng thử lại sau.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Customer Information Section -->
                <div class="mb-8">
                  <div class="flex items-center mb-4">
                    <div class="bg-blue-100 p-2 rounded-lg mr-3">
                      <svg
                        class="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Thông tin khách hàng
                    </h3>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex items-center gap-4 mb-4">
                      <label class="w-40 text-sm font-medium text-gray-700"
                        >Tên khách hàng *</label
                      >
                      <input
                        type="text"
                        v-model="bookingForm.fullName"
                        required
                        placeholder="Nhập họ và tên"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                      />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                      <label class="w-40 text-sm font-medium text-gray-700"
                        >Số người chơi</label
                      >
                      <input
                        type="number"
                        v-model="bookingForm.numPlayers"
                        min="1"
                        max="4"
                        required
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                      />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                      <label class="w-40 text-sm font-medium text-gray-700"
                        >Số điện thoại *</label
                      >
                      <input
                        type="tel"
                        v-model="bookingForm.phone"
                        required
                        placeholder="Nhập số điện thoại"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                      />
                    </div>
                    <div class="flex items-center gap-4 mb-4">
                      <label class="w-40 text-sm font-medium text-gray-700"
                        >Email</label
                      >
                      <input
                        type="email"
                        v-model="bookingForm.email"
                        placeholder="Nhập địa chỉ email"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <!-- Services Section -->
                <div class="mb-8">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                      <div class="bg-purple-100 p-2 rounded-lg mr-3">
                        <svg
                          class="w-5 h-5 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          ></path>
                        </svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Dịch vụ đi kèm
                      </h3>
                    </div>
                    <button
                      @click="addService"
                      class="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <span>Thêm dịch vụ</span>
                    </button>
                  </div>

                  <!-- Services Table -->
                  <div
                    class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                  >
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead
                          class="bg-gradient-to-r from-gray-50 to-gray-100"
                        >
                          <tr>
                            <th
                              class="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                            >
                              Dịch vụ
                            </th>
                            <th
                              class="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                            >
                              Chi tiết
                            </th>
                            <th
                              class="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                            >
                              Số lượng
                            </th>
                            <th
                              class="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                            >
                              Đơn giá
                            </th>
                            <th
                              class="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                            >
                              Thành tiền
                            </th>
                            <th
                              class="px-6 py-4 text-center text-sm font-semibold text-gray-900"
                            >
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr
                            v-for="(item, index) in bookingDetailData"
                            :key="index"
                            class="hover:bg-gray-50 transition-colors"
                          >
                            <td class="px-6 py-4">
                              <select
                                v-model="item.serviceId"
                                @change="onServiceChange(index)"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                              >
                                <option value="">Chọn dịch vụ</option>
                                <option
                                  v-for="service in allServices"
                                  :key="service.id"
                                  :value="service.id"
                                >
                                  {{ service.name }}
                                </option>
                              </select>
                            </td>

                            <td class="px-6 py-4">
                              <div
                                v-if="
                                  getServiceType(item.serviceId) === 'GOLF_CLUB'
                                "
                              >
                                <button
                                  class="px-3 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 text-sm font-medium flex items-center space-x-2 transition-colors"
                                  @click="
                                    () => {
                                      showToolDialog = true;
                                      toolSelectIndex = index;
                                    }
                                  "
                                  type="button"
                                >
                                  <svg
                                    class="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M19 9l-7 7-7-7"
                                    ></path>
                                  </svg>
                                  <span v-if="item.toolId">
                                    {{
                                      golfClubs.find(
                                        (t) => t.id === item.toolId
                                      )?.name || "Chọn gậy"
                                    }}
                                  </span>
                                  <span v-else>Chọn gậy</span>
                                </button>
                              </div>
                              <span v-else class="text-gray-400 italic text-sm"
                                >Không yêu cầu</span
                              >
                            </td>

                            <td class="px-6 py-4 text-center">
                              <input
                                type="number"
                                min="1"
                                v-model.number="item.quantity"
                                @input="updateTotalPrice(index)"
                                class="w-20 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </td>

                            <td class="px-6 py-4 text-center">
                              <div class="font-medium text-gray-900">
                                {{ formatPrice(item.unitPrice || 0) }}
                              </div>
                            </td>

                            <td class="px-6 py-4 text-center">
                              <div class="font-bold text-green-600">
                                {{ formatPrice(item.totalPrice || 0) }}
                              </div>
                            </td>

                            <td class="px-6 py-4 text-center">
                              <button
                                @click="removeService(index)"
                                class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                              >
                                <svg
                                  class="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                          <tr v-if="bookingDetailData.length === 0">
                            <td
                              colspan="6"
                              class="px-6 py-12 text-center text-gray-500"
                            >
                              <div class="flex flex-col items-center">
                                <svg
                                  class="h-12 w-12 text-gray-400 mb-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                  ></path>
                                </svg>
                                <p class="text-lg font-medium">
                                  Chưa có dịch vụ nào
                                </p>
                                <p class="text-sm">
                                  Thêm dịch vụ để nâng cao trải nghiệm
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Notes Section -->
                <div class="mb-8">
                  <div class="flex items-center mb-4">
                    <div class="bg-orange-100 p-2 rounded-lg mr-3">
                      <svg
                        class="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        ></path>
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">Ghi chú</h3>
                  </div>
                  <textarea
                    v-model="bookingForm.note"
                    rows="4"
                    placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all duration-200 resize-none"
                  ></textarea>
                </div>

                <!-- Payment Summary -->
                <div
                  class="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200"
                >
                  <div class="flex items-center mb-6">
                    <div class="bg-green-100 p-2 rounded-lg mr-3">
                      <svg
                        class="w-5 h-5 text-green-600"
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
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900">
                      Chi tiết thanh toán
                    </h3>
                  </div>

                  <div class="space-y-4">
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600"
                        >Giá sân ({{ bookingForm.numPlayers }} người):</span
                      >
                      <span class="font-semibold text-gray-900">{{
                        formatPrice(calPriceCourse || 0)
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                      <span class="text-gray-600">Dịch vụ đi kèm:</span>
                      <span class="font-semibold text-gray-900">{{
                        formatPrice(servicesTotal || 0)
                      }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2">
                      <span class="text-orange-600"
                        >Thanh toán trước (50%):</span
                      >
                      <span class="font-semibold text-orange-600">{{
                        formatPrice(depositAmount || 0)
                      }}</span>
                    </div>
                    <div class="border-t border-green-200 pt-4">
                      <div class="flex justify-between items-center">
                        <span class="text-xl font-bold text-gray-900"
                          >Tổng cộng:</span
                        >
                        <span class="text-3xl font-bold text-green-600">{{
                          formatPrice(totalPrice || 0)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div
              class="bg-gray-50 px-8 py-6 rounded-b-2xl border-t border-gray-200"
            >
              <div class="flex justify-end space-x-4">
                <button
                  @click="closeBookingModal"
                  class="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 shadow-sm"
                >
                  Hủy bỏ
                </button>
                <button
                  @click="saveBooking"
                  :disabled="
                    !bookingForm.fullName ||
                    !bookingForm.phone ||
                    !bookingForm.teeTimeId
                  "
                  :class="[
                    'px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg',
                    !bookingForm.fullName ||
                    !bookingForm.phone ||
                    !bookingForm.teeTimeId
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl transform hover:-translate-y-0.5',
                  ]"
                >
                  <span class="flex items-center space-x-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Xác nhận đặt lịch</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Modal -->
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.5);"
        >
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-gray-900">Xác nhận</h2>
            <button
              @click="showConfirmModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4 flex flex-col items-center">
            <AlertTriangleIcon class="w-12 h-12 text-yellow-500 mb-4" />
            <p class="text-gray-900 text-center mb-2">
              Bạn có chắc chắn muốn xóa lịch đặt này không?
            </p>
            <p class="text-gray-500 text-center text-sm">
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="flex justify-end space-x-2 border-t px-6 py-4">
            <button
              @click="showConfirmModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="deleteBooking"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <ToolSelectDialog
    :visible="showToolDialog"
    :tools="golfClubs"
    @select="
      (tool) => {
        if (toolSelectIndex !== null) {
          bookingDetailData[toolSelectIndex].toolId = tool.id;
          bookingDetailData[toolSelectIndex].unitPrice = tool.price;
          updateTotalPrice(toolSelectIndex);
        }
      }
    "
    @close="showToolDialog = false"
  />
</template>
