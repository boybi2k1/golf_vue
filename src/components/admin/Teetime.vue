<script setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  Plus as PlusIcon,
  RefreshCw as RefreshCwIcon,
  X as XIcon,
} from "lucide-vue-next";
import { useGolfCourseStore } from "../../stores/golf_course";
import { storeToRefs } from "pinia";
import { useTeeTimeStore } from "../../stores/tee_time";

// State
const searchQuery = ref({
  status: "",
  key: "golfCourseId",
  value: "",
  key2: "date",
  value2: "",
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

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

const golfCourseStore = useGolfCourseStore();
const golfCourses = storeToRefs(golfCourseStore);
const teeTimeStore = useTeeTimeStore();
const { teeTimeSearch, pagination, loading } = storeToRefs(teeTimeStore);
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
    available: "Còn trống",
    booked: "Đã đặt",
    cancelled: "Đã hủy",
  };
  return statusMap[status] || status;
}

function getCourseName(courseId) {
  const courseMap = {
    GC001: "Sân A - 18 hố",
    GC002: "Sân B - 9 hố",
    GC003: "Sân C - 18 hố",
  };
  return courseMap[courseId] || courseId;
}

function applyFilters() {
  // In a real app, this would fetch data from the server with the filters
  console.log("Applying filters:", filters.value);
  loadTeeTimes();
  // Reset to first page when filters change
  currentPage.value = 1;
}

function refreshData() {
  loadTeeTimes();
  // Reset to first page when refreshing data
  currentPage.value = 1;
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function openCreateModal() {
  isEditing.value = false;
  selectedTeeTimeId.value = null;
  teeTimeForm.value = {
    golfCourseId: "GC001",
    date: filters.value.date || new Date().toISOString().split("T")[0],
    startTime: "07:00",
    maxPlayers: 4,
    bookedPlayers: 0,
    status: "available",
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
  const formData = { ...teeTimeForm.value };

  const teeTimeData = {
    id: isEditing.value
      ? selectedTeeTimeId.value
      : `TT${Date.now().toString().substring(6)}`,
    golfCourseId: formData.golfCourseId,
    date: formData.date,
    startTime: formData.startTime,
    maxPlayers: parseInt(formData.maxPlayers),
    bookedPlayers: parseInt(formData.bookedPlayers),
    status: formData.status,
    price: parseFloat(formData.price),
  };

  if (isEditing.value) {
    // Update existing tee time
    const index = teeTimes.value.findIndex(
      (t) => t.id === selectedTeeTimeId.value
    );
    if (index !== -1) {
      teeTimes.value[index] = teeTimeData;
    }
  } else {
    // Create new tee time
    teeTimes.value.push(teeTimeData);
  }

  closeModal();
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
  await teeTimeStore.searchTeeTime(searchQuery.value);
}

// Watch for changes in filteredTeeTimes to reset pagination if needed
watch(filteredTeeTimes, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value);
  }
});

// Lifecycle hooks
onMounted(async () => {
  await golfCourseStore.getAllGolfCourses();
  loadTeeTimes();
});
</script>F
<template>
  <div class="bg-emerald-50 min-h-screen p-4">
    <!-- Header -->
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-emerald-800">Quản Lý Tee Time</h1>
      <div class="flex gap-2">
        <button
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
            v-model="filters.date"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sân Golf</label
          >
          <select
            v-model="filters.golfCourseId"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Tất cả sân</option>
            <option value="GC001">Sân A - 18 hố</option>
            <option value="GC002">Sân B - 9 hố</option>
            <option value="GC003">Sân C - 18 hố</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Trạng thái</label
          >
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="available">Còn trống</option>
            <option value="booked">Đã đặt</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>
    </div>

    <!-- Tee Time List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
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
                ID
              </th>
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
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(teeTime, index) in paginatedTeeTimes" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ teeTime.id }}
              </td>
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
            <tr v-if="filteredTeeTimes.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu tee time phù hợp với bộ lọc
              </td>
            </tr>
            <tr v-else-if="paginatedTeeTimes.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu tee time trên trang này
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-200">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <div class="text-sm text-gray-700 mb-4 sm:mb-0">
            Hiển thị
            <span class="font-medium">{{ startItem }}-{{ endItem }}</span> trong
            tổng số
            <span class="font-medium">{{ filteredTeeTimes.length }}</span> tee
            time
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

            <template v-if="totalPages <= 7">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="goToPage(page)"
                :class="{
                  'px-3 py-1 border rounded-md': true,
                  'bg-emerald-50 text-emerald-700 border-emerald-300':
                    currentPage === page,
                  'border-gray-300 text-gray-700 hover:bg-gray-100':
                    currentPage !== page,
                }"
              >
                {{ page }}
              </button>
            </template>

            <template v-else>
              <!-- First page -->
              <button
                @click="goToPage(1)"
                :class="{
                  'px-3 py-1 border rounded-md': true,
                  'bg-emerald-50 text-emerald-700 border-emerald-300':
                    currentPage === 1,
                  'border-gray-300 text-gray-700 hover:bg-gray-100':
                    currentPage !== 1,
                }"
              >
                
              </button>

              <!-- Ellipsis if needed -->
              <span v-if="currentPage > 3" class="px-3 py-1">...</span>

              <!-- Pages around current page -->
              <template v-for="page in visiblePageNumbers" :key="page">
                <button
                  v-if="page !== 1 && page !== totalPages"
                  @click="goToPage(page)"
                  :class="{
                    'px-3 py-1 border rounded-md': true,
                    'bg-emerald-50 text-emerald-700 border-emerald-300':
                      currentPage === page,
                    'border-gray-300 text-gray-700 hover:bg-gray-100':
                      currentPage !== page,
                  }"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Ellipsis if needed -->
              <span v-if="currentPage < totalPages - 2" class="px-3 py-1"
                >...</span
              >

              <!-- Last page -->
              <button
                @click="goToPage(totalPages)"
                :class="{
                  'px-3 py-1 border rounded-md': true,
                  'bg-emerald-50 text-emerald-700 border-emerald-300':
                    currentPage === totalPages,
                  'border-gray-300 text-gray-700 hover:bg-gray-100':
                    currentPage !== totalPages,
                }"
              >
                {{ totalPages }}
              </button>
            </template>

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

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div
          class="p-4 border-b border-gray-200 flex justify-between items-center"
        >
          <h3 class="text-lg font-medium text-gray-900">
            {{ isEditing ? "Chỉnh sửa Tee Time" : "Tạo Tee Time mới" }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="p-4">
          <form @submit.prevent="saveTeeTime">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Sân Golf</label
                >
                <select
                  v-model="teeTimeForm.golfCourseId"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="GC001">Sân A - 18 hố</option>
                  <option value="GC002">Sân B - 9 hố</option>
                  <option value="GC003">Sân C - 18 hố</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Ngày</label
                >
                <input
                  type="date"
                  v-model="teeTimeForm.date"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Giờ bắt đầu</label
                >
                <input
                  type="time"
                  v-model="teeTimeForm.startTime"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Số người tối đa</label
                >
                <input
                  type="number"
                  v-model="teeTimeForm.maxPlayers"
                  min="1"
                  max="4"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Số người đã đặt</label
                >
                <input
                  type="number"
                  v-model="teeTimeForm.bookedPlayers"
                  min="0"
                  :max="teeTimeForm.maxPlayers"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Trạng thái</label
                >
                <select
                  v-model="teeTimeForm.status"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="available">Còn trống</option>
                  <option value="booked">Đã đặt</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Giá (VND)</label
                >
                <input
                  type="number"
                  v-model="teeTimeForm.price"
                  min="0"
                  step="10000"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            <div class="mt-6 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                {{ isEditing ? "Cập nhật" : "Tạo mới" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
