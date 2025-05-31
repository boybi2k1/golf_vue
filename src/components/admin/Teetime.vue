<script setup>
import { ref, computed, onMounted, watch, reactive } from "vue";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Plus as PlusIcon,
  RefreshCw as RefreshCwIcon,
  X as XIcon,
} from "lucide-vue-next";
import { useGolfCourseStore } from "../../stores/golf_course";
import { storeToRefs } from "pinia";
import { useTeeTimeStore } from "../../stores/tee_time";
import { checkAdminRole } from "../../utils/format";
const isAdmin = checkAdminRole();
const golfCourseStore = useGolfCourseStore();
const { golfCourses } = storeToRefs(golfCourseStore);
const teeTimeStore = useTeeTimeStore();
const { teeTimeSearch, pagination, loading } = storeToRefs(teeTimeStore);
// State
const searchQuery = reactive({
  status: "",
  key: "golfCourseId",
  value: "",
  date: new Date().toISOString().split("T")[0],
  page: 1,
  size: 10,
});

const teeTimes = ref([]);
const showModal = ref(false);
const isEditing = ref(false);
const selectedTeeTimeId = ref(null);
const teeTimeForm = ref({
  golfCourseId: "GC001",
  date: new Date().toISOString().split("T")[0],
  startTime: "07:00",
  maxPlayers: 4,
  bookedPlayers: 0,
  status: "available",
  price: 1500000,
});

// Computed

// Methods
function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
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
    HOLD: "Đang giữ",
    CANCELLED: "Đã hủy",
    AVAILABLE: "Còn trống",
    BOOKED: "Đã đặt",
    CHECKED_OUT: "Đã check-out",
    CHECKED_IN: "Đã check-in",
    UNAVAILABLE: "Không khả dụng",
  };
  return statusMap[status] || status;
}

function getCourseName(courseId) {
  const course = golfCourses.value.find((c) => c.id === courseId);
  return course ? course.name : "Không xác định";
}

function applyFilters() {
  loadTeeTimes();
}

function refreshData() {
  loadTeeTimes();
}

function openCreateModal() {
  isEditing.value = false;
  selectedTeeTimeId.value = null;
  teeTimeForm.value = {
    golfCourseId: golfCourses.value[0]?.id || "",
    date: new Date().toISOString().split("T")[0],
    startTime: "07:00",
    maxPlayers: 4,
    bookedPlayers: 0,
    status: "AVAILABLE",
    price: 1500000,
  };
  showModal.value = true;
}

function editTeeTime(teeTime) {
  isEditing.value = true;
  selectedTeeTimeId.value = teeTime.id;
  teeTimeForm.value = {
    golfCourseId: teeTime.golfCourseId,
    date: teeTime.date,
    startTime: teeTime.startTime,
    maxPlayers: teeTime.maxPlayers,
    bookedPlayers: teeTime.bookedPlayers,
    status: teeTime.status,
    price: teeTime.price,
  };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}
function saveTeeTime() {
  if (isEditing.value && selectedTeeTimeId.value) {
    // Sửa tee time
    teeTimeStore
      .updateTeeTime(selectedTeeTimeId.value, { ...teeTimeForm.value })
      .then(() => {
        closeModal();
      });
  } else {
    // Thêm mới tee time
    teeTimeStore.createTeeTime({ ...teeTimeForm.value }).then(() => {
      closeModal();
    });
  }
}

function cancelTeeTime(teeTime) {
  if (confirm("Bạn có chắc chắn muốn hủy tee time này không?")) {
    const index = teeTimes.value.findIndex((t) => t.id === teeTime.id);
    if (index !== -1) {
      teeTimes.value[index] = {
        ...teeTimes.value[index],
        status: "cancelled",
      };
    }
  }
}

async function loadTeeTimes() {
  await teeTimeStore.searchTeeTime(searchQuery);
}

watch(golfCourses, (newCourses) => {
  if (newCourses.length > 0 && !searchQuery.value) {
    searchQuery.value = newCourses[0].id;
  }
});
//watch for change page
function onChangePage(page) {
  searchQuery.page = page + 1;
  loadTeeTimes();
}
// Lifecycle hooks
onMounted(async () => {
  Promise.all([golfCourseStore.getAllGolfCourses(), loadTeeTimes()]);
});
</script>

<template>
  <div class="bg-emerald-50 min-h-screen p-4">
    <!-- Header -->
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-emerald-800">Quản Lý Tee Time</h1>
      <div class="flex gap-2">
        <button
          v-if="isAdmin"
          @click="openCreateModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Tạo Tee Time
        </button>
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-emerald-700 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Ngày</label
          >
          <input
            type="date"
            v-model="searchQuery.date"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sân Golf</label
          >
          <select
            v-model="searchQuery.value"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
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
            v-model="searchQuery.status"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="AVAILABLE">Còn trống</option>
            <option value="BOOKED">Đã đặt</option>
            <option value="HOLD">Đang giữ</option>
            <option value="CHECKED_OUT">Đã Check-out</option>
            <option value="CHECKED_IN">Đã Check-in</option>
            <option value="UNAVAILABLE">Không khả dụng</option>
          </select>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="applyFilters"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>

    <!-- Tee Time List -->
    <div v-if="loading" class="flex justify-center items-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"
      ></div>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách Tee Time</h2>
      </div>
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
                Giờ bắt đầu
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sân
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số người
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giá
              </th>
              <th
                v-if="isAdmin"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(teeTime, index) in teeTimeSearch" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(teeTime.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ teeTime.startTime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getCourseName(teeTime.golfCourseId) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ teeTime.bookedPlayers }}/{{ teeTime.maxPlayers }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs rounded-full': true,
                    'bg-emerald-100 text-emerald-800':
                      teeTime.status === 'available',
                    'bg-blue-100 text-blue-800': teeTime.status === 'booked',
                    'bg-red-100 text-red-800': teeTime.status === 'cancelled',
                  }"
                >
                  {{ getStatusLabel(teeTime.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatPrice(teeTime.price) }}
              </td>
              <td
                v-if="isAdmin"
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  @click="editTeeTime(teeTime)"
                  class="text-emerald-600 hover:text-emerald-900 mr-3"
                >
                  Sửa
                </button>
                <button
                  v-if="teeTime.status !== 'cancelled'"
                  @click="cancelTeeTime(teeTime)"
                  class="text-red-600 hover:text-red-900"
                >
                  Hủy
                </button>
              </td>
            </tr>
            <tr v-if="teeTimeSearch.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu tee time phù hợp với bộ lọc
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
                @click="onChangePage(pagination.page - 1)"
                :disabled="pagination.page + 1 === 1"
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
                @click="onChangePage(pagination.page + 1)"
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

    <!-- Create/Edit Modal -->
    <!-- Thay thế phần form trong modal tạo/sửa tee time như sau -->

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 animate-fade-in"
      >
        <!-- Header -->
        <div
          class="p-5 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-xl font-semibold text-gray-800">
            {{ isEditing ? "Chỉnh sửa Tee Time" : "Tạo Tee Time mới" }}
          </h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-red-500 transition duration-200"
          >
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveTeeTime" class="p-5 space-y-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Sân Golf</label>
            <select
              v-model="teeTimeForm.golfCourseId"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option disabled value="">Chọn sân golf</option>
              <option
                v-for="course in golfCourses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.name }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Ngày</label>
            <input
              type="date"
              v-model="teeTimeForm.date"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Giờ bắt đầu</label>
            <input
              type="time"
              v-model="teeTimeForm.startTime"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700"
              >Số người tối đa</label
            >
            <input
              type="number"
              v-model="teeTimeForm.maxPlayers"
              min="1"
              max="4"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700"
              >Số người đã đặt</label
            >
            <input
              type="number"
              v-model="teeTimeForm.bookedPlayers"
              min="0"
              :max="teeTimeForm.maxPlayers"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Trạng thái</label>
            <select
              v-model="teeTimeForm.status"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="AVAILABLE">Còn trống</option>
              <option value="BOOKED">Đã đặt</option>
              <option value="HOLD">Đang giữ</option>
              <option value="CHECKED_IN">Đã Check-in</option>
              <option value="CHECKED_OUT">Đã Check-out</option>
              <option value="UNAVAILABLE">Không khả dụng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Giá (VND)</label>
            <input
              type="number"
              v-model="teeTimeForm.price"
              min="0"
              step="10000"
              required
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <!-- Footer -->
          <div class="pt-4 flex justify-end space-x-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
            >
              {{ isEditing ? "Cập nhật" : "Tạo mới" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
