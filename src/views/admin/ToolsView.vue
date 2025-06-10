<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">
          Quản Lý Trang Thiết Bị
        </h1>
        <div class="flex gap-2">
          <button
            @click="openNewToolModal"
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon class="w-4 h-4" /> Thêm thiết bị mới
          </button>
          <button
            @click="refreshData"
            class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
          >
            <RefreshCwIcon class="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div class="lg:col-span-3 mb-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại thiết bị</label
              >
              <select
                v-model="filters.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="SINGLE_CLUB">Gậy lẻ</option>
                <option value="CLUB_SET">Bộ gậy</option>
                <option value="BAG">Túi gậy</option>
                <option value="CAR">Xe điện</option>
                <option value="OTHER">Khác</option>
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
                <option value="AVAILABLE">Sẵn sàng</option>
                <option value="UNAVAILABLE">Không sẵn sàng</option>
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
                  placeholder="Tên, mã thiết bị..."
                  class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã thiết bị
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tên thiết bị
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nhà cung cấp
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số lượng
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
                v-for="tool in filteredTools"
                :key="tool.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ tool.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 mr-3">
                      <img
                        :src="URL_IMAGE + tool.imageUrl"
                        class="h-10 w-10 rounded-full object-cover"
                        alt="Tool thumbnail"
                      />
                    </div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ tool.name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getCategoryText(tool.type) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tool.provider }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ tool.quantity }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-green-100 text-green-800':
                        tool.status === 'available',
                      'bg-blue-100 text-blue-800': tool.status === 'in-use',
                      'bg-yellow-100 text-yellow-800':
                        tool.status === 'maintenance',
                      'bg-red-100 text-red-800': tool.status === 'broken',
                    }"
                  >
                    {{ getStatusText(tool.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewToolDetail(tool)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="editTool(tool)"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="confirmDeleteTool(tool)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTools.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu thiết bị
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

      <!-- Tool Modal -->
      <div
        v-if="showToolModal"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-green-800">
              {{ isEditMode ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới" }}
            </h2>
            <button
              @click="closeToolModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4">
            <!-- Image Upload & Preview -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ảnh thiết bị</label
              >
              <label
                for="tool-image-upload"
                class="block cursor-pointer space-y-4"
              >
                <div
                  v-if="toolForm.imageUrl"
                  class="relative rounded-lg overflow-hidden border-2 border-green-200 flex items-center justify-center bg-white"
                  style="
                    width: 100%;
                    aspect-ratio: 4/3;
                    min-height: 180px;
                    max-height: 260px;
                  "
                >
                  <img
                    :src="toolForm.imageUrl"
                    class="object-contain w-full h-full"
                    style="max-width: 100%; max-height: 100%"
                    alt="Ảnh thiết bị"
                  />
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span
                      class="bg-white/90 hover:bg-white text-green-700 px-3 py-1.5 rounded-md text-sm font-medium"
                      >Thay đổi ảnh</span
                    >
                  </div>
                </div>
                <div
                  v-else
                  class="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-white"
                >
                  <div class="mx-auto w-12 h-12 text-green-400 mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">Chọn ảnh thiết bị</p>
                  <p class="text-xs text-gray-400">PNG, JPG, GIF tối đa 10MB</p>
                </div>
                <input
                  id="tool-image-upload"
                  type="file"
                  accept="image/*"
                  @change="onToolImageChange"
                  class="hidden"
                />
              </label>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tên thiết bị</label
              >
              <input
                type="text"
                v-model="toolForm.name"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại thiết bị</label
                >
                <select
                  v-model="toolForm.type"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="SINGLE_CLUB">Gậy lẻ</option>
                  <option value="CLUB_SET">Bộ gậy</option>
                  <option value="CAR">Xe điện</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Trạng thái</label
                >
                <select
                  v-model="toolForm.status"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="AVAILABLE">Sẵn sàng</option>
                  <option value="UNAVAILABLE">Không sắn sàng</option>
                </select>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Số lượng</label
                >
                <input
                  type="number"
                  v-model="toolForm.quantity"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nhà cung cấp</label
                >
                <input
                  type="text"
                  v-model="toolForm.provider"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Mô tả</label
              >
              <textarea
                v-model="toolForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-2 border-t px-6 py-4">
            <button
              @click="closeToolModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="saveTool"
              class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tool Details Modal -->
      <div
        v-if="showDetailsModal"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-green-800">
              Chi tiết thiết bị
            </h2>
            <button
              @click="showDetailsModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4">
            <div class="flex flex-col md:flex-row gap-6 items-center mb-4">
              <div
                class="w-40 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-green-200 bg-gray-50 flex items-center justify-center"
              >
                <img
                  v-if="selectedTool.imageUrl"
                  :src="selectedTool.imageUrl"
                  class="w-full h-full object-contain"
                  style="background: #fff"
                  alt="Ảnh thiết bị"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-gray-400"
                >
                  Không có ảnh
                </div>
              </div>
              <div class="flex-1 w-full">
                <h3 class="text-lg font-bold text-gray-900 mb-1">
                  {{ selectedTool.name }}
                </h3>
                <div class="mb-1 text-sm text-gray-500">
                  Mã: {{ selectedTool.code }}
                </div>
                <div class="mb-1 text-sm text-gray-500">
                  Loại: {{ getCategoryText(selectedTool.type) }}
                </div>
                <div class="mb-1 text-sm text-gray-500">
                  Nhà cung cấp: {{ selectedTool.provider }}
                </div>
                <div class="mb-1 text-sm text-gray-500">
                  Số lượng: {{ selectedTool.quantity }}
                </div>
                <div class="mb-1 text-sm text-gray-500">
                  Trạng thái:
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-green-100 text-green-800':
                        selectedTool.status === 'available',
                      'bg-blue-100 text-blue-800':
                        selectedTool.status === 'in-use',
                      'bg-yellow-100 text-yellow-800':
                        selectedTool.status === 'maintenance',
                      'bg-red-100 text-red-800':
                        selectedTool.status === 'broken',
                    }"
                    >{{ getStatusText(selectedTool.status) }}</span
                  >
                </div>
                <div class="mb-1 text-sm text-gray-500">
                  Ngày tạo:
                  {{
                    selectedTool.createdAt
                      ? selectedTool.createdAt.split("T")[0]
                      : ""
                  }}
                </div>
              </div>
            </div>
            <div class="mb-2">
              <div class="font-semibold text-gray-700 mb-1">Mô tả</div>
              <div class="text-gray-600 text-sm whitespace-pre-line">
                {{ selectedTool.description || "Không có mô tả." }}
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
              v-if="isAdmin"
              @click="editTool(selectedTool)"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
            >
              Sửa
            </button>
            <button
              v-if="isAdmin"
              @click="confirmDeleteTool(selectedTool)"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
      <!-- Confirmation Modal -->s
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
              Bạn có chắc chắn muốn xóa thiết bị này không?
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
              @click="deleteTool"
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
} from "lucide-vue-next";
import { useToolStore } from "../../stores/tool";
import { storeToRefs } from "pinia";
import { checkAdminRole } from "../../utils/utils";
import { URL_IMAGE } from "../../api";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showToolModal = ref(false);
const showConfirmModal = ref(false);
const showDetailsModal = ref(false);
const isEditMode = ref(false);
const selectedToolId = ref(null);
const selectedTool = ref({});
const isAdmin = checkAdminRole();
const store = useToolStore();

// Image upload logic
const toolFile = ref(null);
const { toolList } = storeToRefs(store);
// Form and filters
const filters = reactive({
  type: "",
  category: "",
  status: "",
  location: "",
  search: "",
});

const toolForm = reactive({
  id: "",
  code: "",
  name: "",
  imageUrl: "",
  type: "",
  quantity: "",
  status: "available",
  rentPrice: 0,
  provider: "",
  supplier: "",
  createdAt: "",
});

// Computed properties
const filteredTools = computed(() => {
  let result = toolList.value;

  if (filters.type) {
    result = result.filter((tool) => tool.type === filters.type);
  }

  if (filters.status) {
    result = result.filter((tool) => tool.status === filters.status);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.id.toLowerCase().includes(searchLower) ||
        tool.code?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(toolList.value.length / itemsPerPage.value) || 1; // Ensure toolList is used
});

function getCategoryText(category) {
  switch (category) {
    case "SINGLE_CLUB":
      return "Gậy lẻ";
    case "CLUB_SET":
      return "Bộ gậy";
    case "BAG":
      return "Túi gậy";
    case "CAR":
      return "Xe điện";
    case "OTHER":
      return "Khác";
    default:
      return category;
  }
}

function onToolImageChange(e) {
  const selected = e.target.files[0];
  if (!selected) return;
  toolFile.value = selected;
  const reader = new FileReader();
  reader.onload = (evt) => {
    toolForm.imageUrl = evt.target.result;
  };
  reader.readAsDataURL(selected);
}

function getStatusText(status) {
  switch (status) {
    case "AVAILABLE":
      return "Sẵn sàng";
    case "UNAVAILABLE":
      return "Không sẵn sàng";

    default:
      return status;
  }
}

function refreshData() {
  store.getAllTools(); // Fetch fresh data from the server
}

function openNewToolModal() {
  isEditMode.value = false;
  resetToolForm();
  toolFile.value = null;
  showToolModal.value = true;
}

function closeToolModal() {
  showToolModal.value = false;
  resetToolForm();
  toolFile.value = null;
}

// Updated `resetToolForm` to include `createdAt` initialization.
function resetToolForm() {
  Object.assign(toolForm, {
    id: "",
    code: "",
    name: "",
    type: "",
    quantity: "",
    imageUrl: "",
    status: "available",
    rentPrice: 0,
    provider: "",
    createdAt: "", // Reset createdAt
    imageUrl: "",
  });
}
function viewToolDetail(tool) {
  selectedTool.value = { ...tool };
  showDetailsModal.value = true;
  selectedToolId.value = tool.id;
  if (tool.imageUrl && !tool.imageUrl.startsWith("data:image/")) {
    selectedTool.value.imageUrl = URL_IMAGE + tool.imageUrl;
  }
}

function editTool(tool) {
  showDetailsModal.value = false;
  isEditMode.value = true;
  selectedToolId.value = tool.id;
  selectedTool.value = JSON.parse(JSON.stringify(tool));
  Object.assign(toolForm, {
    ...selectedTool.value,
    createdAt: selectedTool.value.createdAt.split("T")[0], // Format for date input
    imageUrl: selectedTool.value.imageUrl
      ? URL_IMAGE + selectedTool.value.imageUrl
      : "",
  });
  toolFile.value = null;
  showToolModal.value = true;
}

// Updated the `saveTool` function to ensure proper handling of `createdAt` and other fields.
function saveTool() {
  const formData = new FormData();
  formData.append("name", toolForm.name);
  formData.append("type", toolForm.type);
  formData.append("code", toolForm.code);
  formData.append("quantity", toolForm.quantity);
  formData.append("status", toolForm.status);
  formData.append("rentPrice", toolForm.rentPrice);
  formData.append("provider", toolForm.provider);
  formData.append("description", toolForm.description || "");
  if (toolFile.value) {
    formData.append("image", toolFile.value);
  }
  if (isEditMode.value) {
    store.updateTool(selectedToolId.value, formData);
  } else {
    store.createTool(formData);
  }
  closeToolModal();
}

function confirmDeleteTool(tool) {
  selectedToolId.value = tool.id;
  showConfirmModal.value = true;
}

function deleteTool() {
  const index = toolList.value.findIndex((t) => t.id === selectedToolId.value);
  if (index !== -1) {
    toolList.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}
onMounted(async () => {
  await store.getAllTools();
});
</script>
