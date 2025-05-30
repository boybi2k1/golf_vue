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
import { formatDate, getStatusBookingText } from "../../utils/format";
const showToast = inject('showToast');
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
const bookingSelected = reactive({});
const bookingDetailSelected = reactive([]);
const showConfirmModal = ref(false);
const isViewMode = ref(false);
const isEditMode = ref(false);
const selectedBookingId = ref(null);
const bookingDetails = reactive([]);
const editBookingDetails = reactive([]);
const originalTeeTimeId = ref(null);
const teeTimeSelected = ref(null);
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
  const teeTime = availableTeeTimes.value.find(
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
    bookingForm.totalCost = selectedTeeTimePrice.value * newVal;
  }
);

const { bookings, pagination } = storeToRefs(bookingStore);
const { golfCourses } = storeToRefs(courseStore);
const { availableTeeTimes } = storeToRefs(teeTimeStore);
const { allServices } = storeToRefs(serviceStore);
const { golfClubs } = storeToRefs(toolStore);

const bookingDetailData = computed(() => {
  return isEditMode.value ? editBookingDetails : bookingDetails;
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

async function viewBooking(booking) {
  isViewMode.value = true;
  selectedBookingId.value = booking.id;
  Object.assign(bookingSelected, booking);
  const detail = await bookingStore.getBookingDetailByBookingId(booking.id);
  Object.assign(bookingDetailSelected, detail);
}

async function editBooking(booking) {
  isEditMode.value = true;
  selectedBookingId.value = booking.id;
  originalTeeTimeId.value = booking.teeTime.id;
  Object.assign(bookingForm, booking);
  bookingForm.golfCourseId = booking.golfCourse.id;
  bookingForm.teeTimeId = booking.teeTime.id;
  bookingForm.priceByTeeTime = booking.teeTime.price;
  teeTimeSelected.value = booking.teeTime;
  const detail = await bookingStore.getBookingDetailByBookingId(booking.id);
  Object.assign(editBookingDetails, detail);
  showBookingModal.value = true;
}

async function saveBooking() {
  if (isEditMode.value && selectedBookingId.value) {
    await bookingStore.updateBooking(selectedBookingId.value, {
      ...bookingForm,
    });
  } else {
    const newBooking = await bookingStore.createBooking(bookingForm);

    addBookingDetailToBooking(newBooking.id);
  }
  closeBookingModal();
}

function addService() {
  isEditMode.value
    ? editBookingDetails.push({
        serviceId: "",
        toolId: null,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      })
    : bookingDetails.push({
        serviceId: "",
        toolId: null,
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
      });
}

function removeService(index) {
  isEditMode.value
    ? editBookingDetails.splice(index, 1)
    : bookingDetails.splice(index, 1);
}

function confirmDeleteBooking(booking) {
  selectedBookingId.value = booking.id;
  showConfirmModal.value = true;
}

function deleteBooking() {
  if (selectedBookingId.value) {
    bookingStore.deleteBooking(selectedBookingId.value);
    showConfirmModal.value = false;
  }
}
//khi chon teetime thi goi luon api teetime hold
async function holdTeeTime(teeTimeId) {
  if (isEditMode.value && teeTimeId === originalTeeTimeId.value) return;
  if (!teeTimeId) return;
  const param = {
    teeTimeId: teeTimeId,
    holes: bookingForm.numberOfHoles,
  };
  try{
    const res = await teeTimeStore.holdTeeTime({ param });
    teeTimeSelected.value = res;

  } catch (error) {
    console.error("Error holding tee time:", error);
    showToast("TeeTime không có sẵn! Vui lòng chọn giờ khác", "error");
    return;
  }
}

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
function getCategoryText(type) {
  switch (type) {
    case "CADDY":
      return "Thuê caddy";
    case "GOLF_CAR":
      return "Thuê xe điện";
    case "GOLF_CLUB":
      return "Thuê gậy";
    case "OTHER":
      return "Khác";
    default:
      return type;
  }
}

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

function onServiceChangeEdit(index) {
  const selectedServiceId = editBookingDetails[index].serviceId;
  const selectedService = allServices.value.find(
    (service) => service.id === selectedServiceId
  );
  if (selectedService.type === "GOLF_CLUB") {
    editBookingDetails[index].unitPrice = 0;
  }
  if (selectedService) {
    editBookingDetails[index].unitPrice = selectedService.price;
    editBookingDetails[index].totalPrice =
      editBookingDetails[index].unitPrice * editBookingDetails[index].quantity;
  }
}
function onToolChangeEdit(index) {
  editBookingDetails[index].totalPrice =
    editBookingDetails[index].quantity * editBookingDetails[index].unitPrice;
  const selectedToolId = editBookingDetails[index].toolId;
  const selectedTool = golfClubs.value.find(
    (tool) => tool.id === selectedToolId
  );
  if (selectedTool) {
    editBookingDetails[index].unitPrice = selectedTool.rentPrice;
    editBookingDetails[index].totalPrice =
      editBookingDetails[index].unitPrice * editBookingDetails[index].quantity;
  }
}
function updateTotalPriceEdit(index) {
  editBookingDetails[index].totalPrice =
    editBookingDetails[index].quantity * editBookingDetails[index].unitPrice;
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
}, 10000);

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

// Tính tổng tiền dịch vụ

const calPriceCourse = computed(() => {
  const numPlayers = bookingForm.numPlayers || 0;
  const priceByCourse = bookingForm.priceByTeeTime || 0;
  return priceByCourse * numPlayers;
});
const totalPrice = computed(() => {
  const numPlayers = bookingForm.numPlayers || 0;
  const priceByCourse = bookingForm.priceByTeeTime || 0;
  const courseTotal = priceByCourse * numPlayers;
  return courseTotal + servicesTotal.value;
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
const servicesTotalEdit = computed(() => {
  return editBookingDetails.reduce(
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
                    <div class="text-sm text-gray-500">{{ booking.phone }}</div>
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
                    'bg-blue-100 text-blue-800': booking.status === 'completed',
                    'bg-red-100 text-red-800': booking.status === 'cancelled',
                  }"
                >
                  {{ getStatusBookingText(booking.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewBooking(booking)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="editBooking(booking)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
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
      class="fixed inset-0 flex items-center justify-center z-50"
      :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            {{ isEditMode ? "Chỉnh sửa đặt lịch" : "Đặt lịch mới" }}
          </h2>
          <button
            @click="closeBookingModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Sân Golf</label
              >
              <select
                v-model="bookingForm.golfCourseId"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày</label
              >
              <input
                type="date"
                v-model="bookingForm.bookingDate"
                required
                :min="minBookingDate"
                :max="maxBookingDate"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số lỗ</label
              >
              <select
                v-model="bookingForm.numberOfHoles"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tee Time</label
              >
              <select
                v-model="bookingForm.teeTimeId"
                required
                @blur="holdTeeTime(bookingForm.teeTimeId)"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option v-if="availableTeeTimes.length === 0" disabled>
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
                class="text-sm text-red-500 mt-1"
              >
                Không có giờ khả dụng. Vui lòng thử lại sau.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tên khách hàng</label
              >
              <input
                type="text"
                v-model="bookingForm.fullName"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Số người chơi</label
                >
                <input
                  type="number"
                  v-model="bookingForm.numPlayers"
                  min="1"
                  max="4"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số điện thoại</label
              >
              <input
                type="tel"
                v-model="bookingForm.phone"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                type="email"
                v-model="bookingForm.email"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giá giờ chơi</label
              >
              <input
                type="number"
                v-model="bookingForm.priceByCourse"
                min="0"
                step="1000"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="bookingForm.status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="PLAYING">Đang chơi</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELED">Đã hủy</option>
              </select>
            </div>
          </div>
          <!-- Bảng dịch vụ đi kèm -->
          <div class="mb-6">
            <label
              class="block text-sm font-semibold text-gray-700 mb-3 text-green-700 text-lg"
            >
              Dịch vụ đi kèm
            </label>

            <div class="overflow-x-auto rounded-md border border-gray-300">
              <table class="min-w-full text-sm">
                <thead class="bg-green-100 text-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left">Dịch vụ</th>
                    <th class="px-4 py-3 text-left">Gậy</th>
                    <th class="px-4 py-3 text-center">Số lượng</th>
                    <th class="px-4 py-3 text-center">Đơn giá</th>
                    <th class="px-4 py-3 text-center">Thành tiền</th>
                    <th class="px-4 py-3 text-center">Xoá</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in bookingDetailData"
                    :key="index"
                    class="border-t hover:bg-gray-50"
                  >
                    <!-- Chọn dịch vụ -->
                    <td class="px-4 py-2">
                      <select
                        v-model="item.serviceId"
                        @change="
                          isEditMode
                            ? onServiceChangeEdit(index)
                            : onServiceChange(index)
                        "
                        class="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Chọn dịch vụ</option>
                        <option
                          v-for="service in allServices"
                          :key="service.id"
                          :value="service.id"
                        >
                          {{ service.name }} ({{
                            getCategoryText(service.type)
                          }})
                        </option>
                      </select>
                    </td>

                    <!-- Chọn gậy nếu là GOLF_CLUB -->
                    <td class="px-4 py-2">
                      <select
                        v-if="getServiceType(item.serviceId) === 'GOLF_CLUB'"
                        v-model="item.toolId"
                        @change="
                          isEditMode
                            ? onToolChangeEdit(index)
                            : onToolChange(index)
                        "
                        class="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Chọn gậy</option>
                        <option
                          v-for="tool in golfClubs"
                          :key="tool.id"
                          :value="tool.id"
                        >
                          {{ tool.name }}
                        </option>
                      </select>
                      <span v-else class="text-gray-400 italic"
                        >Không yêu cầu</span
                      >
                    </td>

                    <!-- Nhập số lượng -->
                    <td class="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="1"
                        v-model.number="item.quantity"
                        @input="
                          isEditMode
                            ? updateTotalPriceEdit(index)
                            : updateTotalPrice(index)
                        "
                        class="w-16 text-center border border-gray-300 rounded-md py-1 focus:ring-green-500 focus:border-green-500"
                      />
                    </td>

                    <td class="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        v-model="item.unitPrice"
                        class="w-24 text-center border border-gray-300 rounded-md py-1 focus:ring-green-500 focus:border-green-500"
                      />
                    </td>

                    <!-- Tổng giá -->
                    <td
                      class="px-4 py-2 text-center font-semibold text-green-700"
                    >
                      {{ formatPrice(item.totalPrice || 0) }}
                    </td>

                    <!-- Nút xóa -->
                    <td class="px-4 py-2 text-center">
                      <button
                        @click="removeService(index)"
                        class="text-red-500 hover:underline"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Nút thêm dịch vụ -->
            <div class="mt-4 text-right">
              <button
                @click="addService"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-md"
              >
                + Thêm dịch vụ
              </button>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="bookingForm.note"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
          <!-- Chi tiết thanh toán (giống modal thêm/sửa) -->
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">
              Chi tiết thanh toán
            </h4>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600"
                  >Giá sân ({{ bookingForm.numPlayers }} người):</span
                >
                <span class="font-medium">{{
                  formatPrice(calPriceCourse || 0)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Dịch vụ đi kèm:</span>
                <span class="font-medium">{{
                  formatPrice(
                    (isEditMode ? servicesTotalEdit : servicesTotal) || 0
                  )
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-red-600">Thanh toán trước:</span>
                <span class="font-medium text-red">{{
                  formatPrice(depositAmount || 0)
                }}</span>
              </div>
              <div class="border-t border-gray-300 pt-3">
                <div class="flex justify-between items-center">
                  <span class="text-lg font-semibold text-gray-800"
                    >Tổng cộng:</span
                  >
                  <span class="text-2xl font-bold text-green-600">{{
                    formatPrice(totalPrice || 0)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeBookingModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="saveBooking"
            :disabled="
              !bookingForm.fullName ||
              !bookingForm.phone ||
              !bookingForm.teeTimeId
            "
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium',
              !bookingForm.fullName ||
              !bookingForm.phone ||
              !bookingForm.teeTimeId
                ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-800 text-white',
            ]"
          >
            {{ isEditMode ? "Lưu lại" : "Đặt lịch" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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

    <!-- Booking Modal: Xem chi tiết -->
    <div
      v-if="isViewMode"
      class="fixed inset-0 flex items-center justify-center z-50"
      :style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Xem chi tiết đặt lịch
          </h2>
          <button
            @click="closeBookingModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Sân Golf</label
              >
              <input
                type="text"
                :value="bookingSelected.golfCourse.name"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày</label
              >
              <input
                type="date"
                :value="bookingSelected.bookingDate"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tee time</label
              >
              <input
                type="text"
                :value="bookingSelected.teeTime.startTime"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số lỗ</label
              >
              <input
                type="number"
                :value="bookingSelected.numberOfHoles"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tên khách hàng</label
              >
              <input
                type="text"
                :value="bookingSelected.fullName"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số điện thoại</label
              >
              <input
                type="text"
                :value="bookingSelected.phone"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Email</label
              >
              <input
                type="text"
                :value="bookingSelected.email"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số người chơi</label
              >
              <input
                type="number"
                :value="bookingSelected.numPlayers"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <input
                type="text"
                :value="getStatusBookingText(bookingSelected.status)"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Check-in Time</label
              >
              <input
                type="datetime-local"
                :value="bookingSelected.checkInTime"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Check-out Time</label
              >
              <input
                type="datetime-local"
                :value="bookingSelected.checkOutTime"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Checked Out By</label
              >
              <input
                type="text"
                :value="bookingSelected.checkOutBy"
                disabled
                class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
              />
            </div>
          </div>
          <!-- Bảng dịch vụ đi kèm -->
          <div class="mb-6">
            <label
              class="block text-sm font-semibold text-gray-700 mb-3 text-green-700 text-lg"
              >Dịch vụ đi kèm</label
            >
            <div class="overflow-x-auto rounded-md border border-gray-300">
              <table class="min-w-full text-sm">
                <thead class="bg-green-100 text-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left">Dịch vụ</th>
                    <th class="px-4 py-3 text-left">Gậy</th>
                    <th class="px-4 py-3 text-center">Số lượng</th>
                    <th class="px-4 py-3 text-center">Đơn giá</th>
                    <th class="px-4 py-3 text-center">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in bookingDetailSelected"
                    :key="index"
                    class="border-t hover:bg-gray-50"
                  >
                    <td class="px-4 py-2">
                      <input
                        type="text"
                        :value="item.service.name"
                        disabled
                        class="w-full border-none bg-transparent"
                      />
                    </td>
                    <td class="px-4 py-2">
                      <input
                        type="text"
                        :value="
                          item.service.type === 'GOLF_CLUB'
                            ? item.tool.name
                            : '---'
                        "
                        disabled
                        class="w-full border-none bg-transparent"
                      />
                    </td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="number"
                        :value="item.quantity"
                        disabled
                        class="w-16 text-center border-none bg-transparent"
                      />
                    </td>
                    <td class="px-4 py-2 text-center">
                      <input
                        type="number"
                        :value="
                          item.service.type === 'GOLF_CLUB'
                            ? item.tool.rentPrice
                            : item.service.price
                        "
                        disabled
                        class="w-24 text-center border-none bg-transparent"
                      />
                    </td>
                    <td
                      class="px-4 py-2 text-center font-semibold text-green-700"
                    >
                      {{ item.totalPrice || 0 }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              :value="bookingForm.note"
              rows="3"
              disabled
              class="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
            ></textarea>
          </div>
          <div class="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 class="text-lg font-semibold text-green-700 mb-4">
              Chi tiết thanh toán
            </h3>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span class="text-sm font-medium text-gray-700">Tiền sân:</span>
                <span class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(bookingSelected.priceByCourse || 0) }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span class="text-sm font-medium text-gray-700"
                  >Tiền dịch vụ:</span
                >
                <span class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(bookingSelected.priceByService || 0) }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span class="text-sm font-medium text-gray-700">Tiền cọc:</span>
                <span class="text-sm font-semibold text-orange-600">
                  {{ formatPrice(bookingSelected.depositAmount || 0) }}
                </span>
              </div>
              <div
                class="flex justify-between items-center py-3 bg-green-100 px-3 rounded-md"
              >
                <span class="text-base font-bold text-green-800"
                  >Tổng tiền:</span
                >
                <span class="text-lg font-bold text-green-800">
                  {{ formatPrice(bookingSelected.totalCost || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeBookingModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
