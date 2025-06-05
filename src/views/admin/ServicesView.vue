s<script setup>
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
import { useServicesStore } from "../../stores/services";
import { storeToRefs } from "pinia";
import { checkAdminRole } from "../../utils/utils";

// State
const showServiceModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedServiceId = ref(null);
const selectedService = ref({});
const isAdmin = checkAdminRole();
const searchQuery = reactive({
  page: 1,
  size: 10,
  key: "type",
  value: "",
  key2: "",
  value2: "",
});

const serviceForm = reactive({
  id: "",
  name: "",
  code: "",
  type: "",
  description: "",
  price: 0,
  status: "ACTIVE",
  imageUrl: "",
});

const serviceFile = ref(null);

function onServiceImageChange(e) {
  const selected = e.target.files[0];
  if (!selected) return;
  serviceFile.value = selected;
  const reader = new FileReader();
  reader.onload = (evt) => {
    serviceForm.imageUrl = evt.target.result;
  };
  reader.readAsDataURL(selected);
}

const servicesStore = useServicesStore();
const { services, pagination } = storeToRefs(servicesStore);

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}
const formatLocalDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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

function getStatusText(status) {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Tạm ngưng";

    default:
      return status;
  }
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
}

function openNewServiceModal() {
  isEditMode.value = false;
  resetServiceForm();
  showServiceModal.value = true;
}

function closeServiceModal() {
  showServiceModal.value = false;
  resetServiceForm();
}

function resetServiceForm() {
  Object.assign(serviceForm, {
    id: "",
    name: "",
    code: "",
    type: "",
    description: "",
    price: 0,
    status: "ACTIVE",
  });
}

function viewServiceDetails(service) {
  selectedService.value = JSON.parse(JSON.stringify(service));
  showDetailsModal.value = true;
}

function editService(service) {
  isEditMode.value = true;
  selectedServiceId.value = service.id;
  Object.assign(serviceForm, JSON.parse(JSON.stringify(service)));
  showServiceModal.value = true;
}

function editFromDetails() {
  isEditMode.value = true;
  selectedServiceId.value = selectedService.value.id;
  Object.assign(serviceForm, JSON.parse(JSON.stringify(selectedService.value)));
  showDetailsModal.value = false;
  showServiceModal.value = true;
}

function saveService() {
  let payload = serviceForm;
  if (serviceFile.value) {
    const formData = new FormData();
    for (const key in serviceForm) {
      if (key !== "imageUrl") formData.append(key, serviceForm[key]);
    }
    formData.append("image", serviceFile.value);
    payload = formData;
  }
  if (!isEditMode.value) {
    servicesStore.createService(payload);
  } else {
    servicesStore.updateService(selectedService.id, payload);
  }
  closeServiceModal();
}

function confirmDeleteService(service) {
  selectedServiceId.value = service.id;
  showConfirmModal.value = true;
}

function deleteService() {
  const index = services.value.findIndex(
    (s) => s.id === selectedServiceId.value
  );
  if (index !== -1) {
    services.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}
const searchSevice = async () => {
  await servicesStore.searchServices(searchQuery);
};

// goij laij search neu chuyen trang
watch(
  () => searchQuery.page,
  (newPage) => {
    if (newPage !== 1) {
      searchQuery.page = newPage;
      searchSevice();
    }
  }
);
onMounted(() => {
  searchSevice();
});
</script>

<template>
      <main class="flex-1 p-6 overflow-y-auto bg-green-100">

  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Dịch Vụ</h1>
      <div class="flex gap-2">
        <button
          v-if="isAdmin"
          @click="openNewServiceModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm dịch vụ mới
        </button>
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>
    <!-- Search Bar -->
    <div class="lg:col-span-3">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <!-- Filter by service type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Loại dịch vụ</label
            >
            <select
              v-model="searchQuery.value"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả loại</option>
              <option value="CADDY">Thuê caddy</option>
              <option value="GOLF_CAR">Thuê xe điện</option>
              <option value="GOLF_CLUB">Thuê gậy</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <!-- Filter key -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tìm kiếm theo</label
            >
            <select
              v-model="searchQuery.key2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả</option>
              <option value="name">Tên dịch vụ</option>
              <option value="code">Mã dịch vụ</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>

          <!-- Input -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Từ khóa</label
            >
            <div class="relative">
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                type="text"
                v-model="searchQuery.value2"
                placeholder="Tên, mã dịch vụ..."
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <!-- Search Button -->
          <div class="flex items-end justify-end">
            <button
              @click="searchSevice"
              class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-sm rounded-md"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Services List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách dịch vụ</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã dịch vụ
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên dịch vụ
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Giá
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
              v-for="service in services"
              :key="service.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ service.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ service.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getCategoryText(service.type) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  service.type === "GOLF_CLUB"
                    ? "Giá tùy thuộc vào loại gậy"
                    : service.price + " VND"
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': service.status === 'ACTIVE',
                    'bg-red-100 text-red-800': service.status === 'INACTIVE',
                  }"
                >
                  {{ getStatusText(service.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewServiceDetails(service)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="isAdmin"
                    @click="editService(service)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    v-if="isAdmin"
                    @click="confirmDeleteService(service)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="services.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu dịch vụ
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
                Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}
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

    <!-- add service Modal -->
    <div
      v-if="showServiceModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            {{ isEditMode ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới" }}
          </h2>
          <button
            @click="closeServiceModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <!-- Ảnh dịch vụ -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Ảnh dịch vụ</label>
            <label for="service-image-upload" class="block cursor-pointer space-y-4">
              <div v-if="serviceForm.imageUrl" class="relative rounded-lg overflow-hidden border-2 border-green-200">
                <img
                  :src="serviceForm.imageUrl"
                  class="w-full h-40 object-cover"
                  alt="Ảnh dịch vụ"
                />
                <div class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span class="bg-white/90 hover:bg-white text-green-700 px-3 py-1.5 rounded-md text-sm font-medium">
                    Thay đổi ảnh
                  </span>
                </div>
              </div>
              <div v-else class="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-white">
                <div class="mx-auto w-12 h-12 text-green-400 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p class="text-sm text-gray-600 mb-2">Chọn ảnh dịch vụ</p>
                <p class="text-xs text-gray-400">PNG, JPG, GIF tối đa 10MB</p>
              </div>
              <input
                id="service-image-upload"
                type="file"
                accept="image/*"
                @change="onServiceImageChange"
                class="hidden"
              />
            </label>
          </div>
          <!-- Tên dịch vụ -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              v-model="serviceForm.name"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại dịch vụ</label
              >
              <select
                v-model="serviceForm.type"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="CADDY">Thuê caddy</option>
                <option value="GOLF_CAR">Thuê xe điện</option>
                <option value="GOLF_CLUB">Thuê gậy</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="serviceForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="INACTIVE">Tạm ngưng</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Giá (VND)
              </label>
              <input
                v-if="!(serviceForm.type === 'GOLF_CLUB')"
                type="number"
                v-model="serviceForm.price"
                required
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div
                v-else
                class="text-gray-500 italic px-3 py-2 border border-dashed border-gray-300 rounded-md bg-gray-50"
              >
                Giá tham khảo, vui lòng xem chi tiết từng loại gậy
              </div>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Mô tả</label
            >
            <textarea
              v-model="serviceForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeServiceModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="saveService"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Service Details Modal -->
    <div
      v-if="showDetailsModal"
      style="background-color: rgba(0, 0, 0, 0.5)"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Chi tiết dịch vụ</h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="flex flex-col md:flex-row items-center mb-4 gap-4">
            <div class="w-full md:w-1/3 flex-shrink-0">
              <div v-if="selectedService.imageUrl" class="rounded-lg overflow-hidden border border-green-200">
                <img :src="selectedService.imageUrl" alt="Ảnh dịch vụ" class="w-full h-28 object-cover" />
              </div>
              <div v-else class="w-full h-28 flex items-center justify-center bg-gray-100 text-gray-400 border border-green-100 rounded-lg">
                Không có ảnh
              </div>
            </div>
            <div class="flex-1 w-full">
              <div class="flex items-center">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedService.name }}
                </h3>
                <span class="ml-auto text-lg font-medium text-green-700">{{ formatCurrency(selectedService.price) }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Mã dịch vụ</h4>
              <p class="text-gray-900">{{ selectedService.code }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Loại dịch vụ
              </h4>
              <p class="text-gray-900">
                {{ getCategoryText(selectedService.type) }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
            <p class="text-gray-900">{{ selectedService.description }}</p>
          </div>

          <!-- thêm trạng thái, thời gian tạo, thời gian chỉnh sửa, người tạo, người chỉnh sửa -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Trạng thái</h4>
              <p class="text-gray-900">
                {{ getStatusText(selectedService.status) }}
              </p>
            </div>

            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Người tạo</h4>
              <p class="text-gray-900">{{ selectedService.createdBy }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Thời gian tạo
              </h4>
              <p class="text-gray-900">
                {{ formatLocalDateTime(selectedService.createdAt) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Người chỉnh sửa
              </h4>
              <p class="text-gray-900">{{ selectedService.updateBy }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Thời gian chỉnh sửa
              </h4>
              <p class="text-gray-900">
                {{ formatLocalDateTime(selectedService.updateAt) }}
              </p>
            </div>
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
            Bạn có chắc chắn muốn xóa dịch vụ này không?
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
            @click="deleteService"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </div>
      </main>
</template>
