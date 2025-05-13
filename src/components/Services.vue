<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Dịch Vụ</h1>
      <div class="flex gap-2">
        <button
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

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Filters -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại dịch vụ</label
              >
              <select
                v-model="filters.category"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="lesson">Học đánh golf</option>
                <option value="rental">Cho thuê thiết bị</option>
                <option value="food">Ẩm thực</option>
                <option value="spa">Spa & Massage</option>
                <option value="transport">Đưa đón</option>
                <option value="other">Khác</option>
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
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="seasonal">Theo mùa</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tìm kiếm</label
              >
              <div class="relative">
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  v-model="filters.search"
                  placeholder="Tên, mã dịch vụ..."
                  class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-sm font-medium text-gray-900 mb-3">
            Thống kê dịch vụ
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang hoạt động</div>
              <div class="text-xl font-semibold text-green-700">
                {{ getServicesCount("active") }}
              </div>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Tạm ngưng</div>
              <div class="text-xl font-semibold text-red-700">
                {{ getServicesCount("inactive") }}
              </div>
            </div>
            <div class="bg-yellow-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Theo mùa</div>
              <div class="text-xl font-semibold text-yellow-700">
                {{ getServicesCount("seasonal") }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Tổng doanh thu</div>
              <div class="text-xl font-semibold text-blue-700">
                {{ formatCurrency(getTotalRevenue()) }}
              </div>
            </div>
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
                Thời gian
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Lượt đặt
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
              v-for="service in filteredServices"
              :key="service.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ service.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3">
                    <img
                      :src="
                        service.image || '/placeholder.svg?height=40&width=40'
                      "
                      class="h-10 w-10 rounded-full object-cover"
                      alt="Service thumbnail"
                    />
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ service.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getCategoryText(service.category) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatCurrency(service.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ service.duration }} phút
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': service.status === 'active',
                    'bg-red-100 text-red-800': service.status === 'inactive',
                    'bg-yellow-100 text-yellow-800':
                      service.status === 'seasonal',
                  }"
                >
                  {{ getStatusText(service.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ service.bookings }}
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
                    @click="editService(service)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDeleteService(service)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredServices.length === 0">
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{ filteredServices.length }}</span>
              trong số
              <span class="font-medium">{{ services.length }}</span> kết quả
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

    <!-- Service Modal -->
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
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tên dịch vụ</label
            >
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
                v-model="serviceForm.category"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="lesson">Học đánh golf</option>
                <option value="rental">Cho thuê thiết bị</option>
                <option value="food">Ẩm thực</option>
                <option value="spa">Spa & Massage</option>
                <option value="transport">Đưa đón</option>
                <option value="other">Khác</option>
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
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Tạm ngưng</option>
                <option value="seasonal">Theo mùa</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giá (VND)</label
              >
              <input
                type="number"
                v-model="serviceForm.price"
                required
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Thời gian (phút)</label
              >
              <input
                type="number"
                v-model="serviceForm.duration"
                required
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Hình ảnh URL</label
            >
            <input
              type="text"
              v-model="serviceForm.image"
              placeholder="https://example.com/image.jpg"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
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
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Thông tin chi tiết</label
            >
            <textarea
              v-model="serviceForm.details"
              rows="4"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
          <div class="mb-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="isAvailableOnline"
                v-model="serviceForm.isAvailableOnline"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                for="isAvailableOnline"
                class="ml-2 block text-sm text-gray-900"
                >Có thể đặt trực tuyến</label
              >
            </div>
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
          <div
            class="relative h-48 mb-4 bg-gray-200 rounded-md overflow-hidden"
          >
            <img
              :src="
                selectedService.image || '/placeholder.svg?height=192&width=640'
              "
              class="w-full h-full object-cover"
              alt="Service thumbnail"
            />
            <div
              :class="{
                'absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-green-100 text-green-800':
                  selectedService.status === 'active',
                'bg-red-100 text-red-800':
                  selectedService.status === 'inactive',
                'bg-yellow-100 text-yellow-800':
                  selectedService.status === 'seasonal',
              }"
            >
              {{ getStatusText(selectedService.status) }}
            </div>
          </div>

          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ selectedService.name }}
            </h3>
            <span class="text-lg font-medium text-green-700">{{
              formatCurrency(selectedService.price)
            }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Mã dịch vụ</h4>
              <p class="text-gray-900">{{ selectedService.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Loại dịch vụ
              </h4>
              <p class="text-gray-900">
                {{ getCategoryText(selectedService.category) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Thời gian</h4>
              <p class="text-gray-900">{{ selectedService.duration }} phút</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Lượt đặt</h4>
              <p class="text-gray-900">{{ selectedService.bookings }} lượt</p>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
            <p class="text-gray-900">{{ selectedService.description }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">
              Thông tin chi tiết
            </h4>
            <p
              class="text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-line"
            >
              {{ selectedService.details || "Không có thông tin chi tiết" }}
            </p>
          </div>

          <div class="mb-4">
            <div class="flex items-center">
              <GlobeIcon class="h-4 w-4 text-gray-500 mr-2" />
              <span class="text-sm text-gray-700">{{
                selectedService.isAvailableOnline
                  ? "Có thể đặt trực tuyến"
                  : "Không thể đặt trực tuyến"
              }}</span>
            </div>
          </div>

          <div class="border-t pt-4 mt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thống kê dịch vụ
            </h4>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-50 p-3 rounded-md">
                <div class="text-xs text-gray-500">Doanh thu</div>
                <div class="text-lg font-semibold text-green-700">
                  {{ formatCurrency(selectedService.revenue) }}
                </div>
              </div>
              <div class="bg-gray-50 p-3 rounded-md">
                <div class="text-xs text-gray-500">Đánh giá trung bình</div>
                <div class="flex items-center">
                  <StarIcon class="h-5 w-5 text-yellow-500" />
                  <span class="ml-1 text-lg font-semibold text-gray-900"
                    >{{ selectedService.rating }}/5</span
                  >
                </div>
              </div>
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
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
  GlobeIcon,
  StarIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showServiceModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedServiceId = ref(null);
const selectedService = ref({});

// Form and filters
const filters = reactive({
  category: "",
  status: "",
  search: "",
});

const serviceForm = reactive({
  id: "",
  name: "",
  category: "lesson",
  status: "active",
  price: 0,
  duration: 60,
  image: "",
  description: "",
  details: "",
  isAvailableOnline: true,
  bookings: 0,
  revenue: 0,
  rating: 0,
});

// Mock data
const services = ref([
  {
    id: "SV001",
    name: "Khóa học golf cơ bản",
    category: "lesson",
    status: "active",
    price: 1500000,
    duration: 60,
    image: "/placeholder.svg?height=160&width=320",
    description: "Khóa học golf cơ bản dành cho người mới bắt đầu.",
    details:
      "Khóa học bao gồm:\n- Hướng dẫn kỹ thuật cơ bản\n- Tư vấn chọn gậy\n- Thực hành tại sân tập\n- Tài liệu học tập",
    isAvailableOnline: true,
    bookings: 45,
    revenue: 67500000,
    rating: 4.7,
  },
  {
    id: "SV002",
    name: "Thuê bộ gậy golf",
    category: "rental",
    status: "active",
    price: 800000,
    duration: 240,
    image: "/placeholder.svg?height=160&width=320",
    description: "Cho thuê bộ gậy golf cao cấp theo giờ hoặc theo ngày.",
    details:
      "Bộ gậy đầy đủ bao gồm:\n- Driver\n- Fairway woods\n- Irons\n- Wedges\n- Putter\n- Túi đựng gậy",
    isAvailableOnline: true,
    bookings: 120,
    revenue: 96000000,
    rating: 4.5,
  },

  {
    id: "SV003",
    name: "Đưa đón sân bay - sân golf",
    category: "transport",
    status: "active",
    price: 1200000,
    duration: 60,
    image: "/placeholder.svg?height=160&width=320",
    description:
      "Dịch vụ đưa đón cao cấp từ sân bay đến sân golf và ngược lại.",
    details:
      "Xe sang trọng, tài xế chuyên nghiệp, có thể đặt trước. Phục vụ 24/7, bao gồm dịch vụ mang vác hành lý và thiết bị golf.",
    isAvailableOnline: true,
    bookings: 62,
    revenue: 74400000,
    rating: 4.6,
  },
]);

// Computed properties
const filteredServices = computed(() => {
  let result = services.value;

  if (filters.category) {
    result = result.filter((service) => service.category === filters.category);
  }

  if (filters.status) {
    result = result.filter((service) => service.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        service.id.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(services.value.length / itemsPerPage.value) || 1;
});

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function getCategoryText(category) {
  switch (category) {
    case "lesson":
      return "Học đánh golf";
    case "rental":
      return "Cho thuê thiết bị";
    case "food":
      return "Ẩm thực";
    case "spa":
      return "Spa & Massage";
    case "transport":
      return "Đưa đón";
    case "other":
      return "Khác";
    default:
      return category;
  }
}

function getStatusText(status) {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "inactive":
      return "Tạm ngưng";
    case "seasonal":
      return "Theo mùa";
    default:
      return status;
  }
}

function getServicesCount(status) {
  return services.value.filter((service) => service.status === status).length;
}

function getTotalRevenue() {
  return services.value.reduce((total, service) => total + service.revenue, 0);
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
    category: "lesson",
    status: "active",
    price: 0,
    duration: 60,
    image: "",
    description: "",
    details: "",
    isAvailableOnline: true,
    bookings: 0,
    revenue: 0,
    rating: 0,
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
  if (isEditMode.value) {
    // Update existing service
    const index = services.value.findIndex(
      (s) => s.id === selectedServiceId.value
    );
    if (index !== -1) {
      // Preserve statistics
      const bookings = services.value[index].bookings;
      const revenue = services.value[index].revenue;
      const rating = services.value[index].rating;

      services.value[index] = {
        ...serviceForm,
        bookings,
        revenue,
        rating,
      };
    }
  } else {
    // Create new service
    const newService = {
      ...serviceForm,
      id: `SV${String(services.value.length + 1).padStart(3, "0")}`,
      bookings: 0,
      revenue: 0,
      rating: 0,
    };
    services.value.push(newService);
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

onMounted(() => {
  // Initialize component
  console.log("Services Management component mounted");
});
</script>
