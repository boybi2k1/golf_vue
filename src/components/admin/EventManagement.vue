<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Sự Kiện</h1>
      <div class="flex gap-2">
        <button
          @click="openNewEventModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm sự kiện mới
        </button>
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Filters -->
      <div class="lg:col-span-full">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại sự kiện</label
              >
              <select
                v-model="filters.value"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="PROMOTION">Khuyến mãi</option>
                <option value="TOURNAMENT">Giải đấu</option>
                <option value="EVENT">Sự kiện</option>
                <option value="HOLIDAY">Ngày lễ</option>
              </select>
            </div>
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
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tìm kiếm</label
              >
              <div class="relative flex gap-2 items-center">
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  v-model="filters.value2"
                  placeholder="Tên, mã sự kiện..."
                  class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  @click="searchEvent"
                  class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium whitespace-nowrap"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Events List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách sự kiện</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên sự kiện
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày bắt đầu
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày kết thúc
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giảm giá
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
              v-for="event in filteredEvents"
              :key="event.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ event.title }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getEventTypeText(event.type) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(event.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(event.endDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  event.discountPercent ? event.discountPercent + "%" : "Không"
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': event.status === 'ACTIVE',
                    'bg-gray-100 text-gray-800': event.status === 'INACTIVE',
                  }"
                >
                  {{ getStatusText(event.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewEventDetails(event)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="editEvent(event)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDeleteEvent(event)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu sự kiện
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
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{ filteredEvents.length }}</span> trong
              số <span class="font-medium">{{ events.length }}</span> kết quả
            </p>
          </div>
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
                Trang {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
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

    <!-- Event Modal -->
    <div
      v-if="showEventModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            {{ isEditMode ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới" }}
          </h2>
          <button
            @click="closeEventModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tên sự kiện</label
            >
            <input
              type="text"
              v-model="eventForm.title"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại sự kiện</label
              >
              <select
                v-model="eventForm.type"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="PROMOTION">Khuyến mãi</option>
                <option value="TOURNAMENT">Giải đấu</option>
                <option value="EVENT">Sự kiện</option>
                <option value="HOLIDAY">Ngày lễ</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="eventForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Không hoạt động</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày bắt đầu</label
              >
              <input
                type="date"
                v-model="eventForm.startDate"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày kết thúc</label
              >
              <input
                type="date"
                v-model="eventForm.endDate"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phần trăm giảm giá (%)</label
              >
              <input
                type="number"
                v-model="eventForm.discountPercent"
                min="0"
                max="100"
                step="0.1"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- Bỏ phần chọn loại dịch vụ, chỉ cần biết là app dựng khuyến mãi -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Đối tượng người dùng</label
              >
              <select
                v-model="eventForm.targetUserType"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="MEMBER">Thành viên</option>
                <option value="GUEST">Khách</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ALL">Tất cả</option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Mô tả</label
            >
            <textarea
              v-model="eventForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeEventModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="saveEvent"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Chi tiết sự kiện</h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center mb-4">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ selectedEvent.title }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ getEventTypeText(selectedEvent.type) }}
              </p>
            </div>
            <span
              :class="{
                'ml-auto px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-green-100 text-green-800':
                  selectedEvent.status === 'ACTIVE',
                'bg-gray-100 text-gray-800':
                  selectedEvent.status === 'INACTIVE',
              }"
            >
              {{ getStatusText(selectedEvent.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Mã sự kiện</h4>
              <p class="text-gray-900">{{ selectedEvent.id }}</p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày bắt đầu
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedEvent.startDate) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày kết thúc
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedEvent.endDate) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Phần trăm giảm giá
              </h4>
              <p class="text-gray-900">
                {{
                  selectedEvent.discountPercent
                    ? selectedEvent.discountPercent + "%"
                    : "Không có giảm giá"
                }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Đối tượng người dùng
              </h4>
              <p class="text-gray-900">
                {{ getTargetUserTypeText(selectedEvent.targetUserType) }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedEvent.description || "Không có mô tả" }}
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            @click="editFromDetails"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Chỉnh sửa
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
            Bạn có chắc chắn muốn xóa sự kiện này không?
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
            @click="deleteEvent"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
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

import { useEventStore } from "../../stores/event";
import { storeToRefs } from "pinia";
const eventStore = useEventStore();
const { events, pagination } = storeToRefs(eventStore);

const currentPage = ref(1);
const itemsPerPage = ref(10);
const showEventModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedEventId = ref(null);
const selectedEvent = ref({});

const filters = reactive({
  key: "type",
  value: "",
  startDate: "",
  endDate: "",
  key2: "title",
  value2: "",
  page: 1,
  size: 10,
});

const eventForm = reactive({
  id: "",
  title: "",
  description: "",
  type: "PROMOTION",
  discountPercent: 0,
  startDate: "",
  endDate: "",
  targetUserType: "ALL",
  status: "ACTIVE",
});

const filteredEvents = computed(() => events.value || []);
const totalPages = computed(() => pagination.value?.totalPages || 1);

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getEventTypeText(type) {
  switch (type) {
    case "PROMOTION":
      return "Khuyến mãi";
    case "TOURNAMENT":
      return "Giải đấu";
    case "EVENT":
      return "Sự kiện";
    case "HOLIDAY":
      return "Ngày lễ";
    default:
      return type;
  }
}

function getStatusText(status) {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Không hoạt động";
    default:
      return status;
  }
}


function getTargetUserTypeText(targetUserType) {
  switch (targetUserType) {
    case "MEMBER":
      return "Thành viên";
    case "GUEST":
      return "Khách";
    case "STAFF":
      return "Nhân viên";
    case "ALL":
      return "Tất cả";
    default:
      return targetUserType;
  }
}

function refreshData() {
  filfil;
  searchEvent();
}

function openNewEventModal() {
  isEditMode.value = false;
  resetEventForm();
  showEventModal.value = true;
}

function closeEventModal() {
  showEventModal.value = false;
  resetEventForm();
}

function resetEventForm() {
  const today = new Date().toISOString().split("T")[0];
  Object.assign(eventForm, {
    id: "",
    title: "",
    description: "",
    type: "PROMOTION",
    discountPercent: 0,
    startDate: today,
    endDate: today,
    targetUserType: "ALL",
    status: "ACTIVE",
  });
}

function viewEventDetails(event) {
  selectedEvent.value = JSON.parse(JSON.stringify(event));
  showDetailsModal.value = true;
}

function editEvent(event) {
  isEditMode.value = true;
  selectedEventId.value = event.id;
  Object.assign(eventForm, JSON.parse(JSON.stringify(event)));
  showEventModal.value = true;
}

function editFromDetails() {
  isEditMode.value = true;
  selectedEventId.value = selectedEvent.value.id;
  Object.assign(eventForm, JSON.parse(JSON.stringify(selectedEvent.value)));
  showDetailsModal.value = false;
  showEventModal.value = true;
}

async function saveEvent() {
  if (!isEditMode.value) {
    await eventStore.createEvent(eventForm);
  } else {
    await eventStore.updateEvent(selectedEventId.value, eventForm);
  }
  closeEventModal();
  searchEvent();
}

function confirmDeleteEvent(event) {
  selectedEventId.value = event.id;
  showConfirmModal.value = true;
}

async function deleteEvent() {
  await eventStore.deleteEvent(selectedEventId.value);
  showConfirmModal.value = false;
  searchEvent();
}

async function searchEvent() {
  filters.page = currentPage.value;
  filters.size = itemsPerPage.value;
  await eventStore.searchEvent({ ...filters });
}

watch([currentPage, itemsPerPage], searchEvent);

onMounted(async () => {
  await searchEvent();
});
</script>
