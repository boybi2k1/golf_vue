<template>
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
              <option value="GOLF_CLUB">Gậy golf</option>
              <option value="GOLF_CART">Xe điện</option>
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
                Giá thuê
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
                      :src="tool.image || '/placeholder.svg?height=40&width=40'"
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ tool.rentPrice }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': tool.status === 'available',
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
                    @click="viewToolDetails(tool)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="editTool(tool)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{ filteredTools.length }}</span> trong
              số <span class="font-medium">{{ toolList.length }}</span> kết quả
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
                <option value="GOLF_CLUB">Gậy golf</option>
                <option value="GOLF_CART">Xe điện</option>
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
                >Giá thuê (VND)</label
              >
              <input
                type="number"
                v-model="toolForm.rentPrice"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showToolModal = ref(false);
const showConfirmModal = ref(false);
const showActionsModal = ref(false);
const isEditMode = ref(false);
const selectedToolId = ref(null);
const selectedTool = ref({});

const store = useToolStore();
const { toolList } = storeToRefs(store);
console.log("toolList", toolList.value);
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
    case "GOLF_CLUB":
      return "Gậy golf";
    case "GOLF_CART":
      return "Xe điện";
    case "OTHER":
      return "Khác";
    default:
      return category;
  }
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
  showToolModal.value = true;
}

function closeToolModal() {
  showToolModal.value = false;
  resetToolForm();
}

// Updated `resetToolForm` to include `createdAt` initialization.
function resetToolForm() {
  Object.assign(toolForm, {
    id: "",
    code: "",
    name: "",
    type: "",
    quantity: "",
    status: "available",
    rentPrice: 0,
    provider: "",
    createdAt: "", // Reset createdAt
  });
}

// Updated `viewToolDetails` to ensure `createdAt` is properly assigned.
function viewToolDetails(tool) {
  selectedTool.value = JSON.parse(JSON.stringify(tool));
  Object.assign(toolForm, {
    ...selectedTool.value,
    createdAt: selectedTool.value.createdAt.split("T")[0], // Format for date input
  });
  showToolModal.value = true;
  console.log("selectedTool", selectedTool.value);
}

function editTool(tool) {
  isEditMode.value = true;
  selectedToolId.value = tool.id;
  selectedTool.value = JSON.parse(JSON.stringify(tool));
  Object.assign(toolForm, {
    ...selectedTool.value,
    createdAt: selectedTool.value.createdAt.split("T")[0], // Format for date input
  });
  showToolModal.value = true;
}

// Updated the `saveTool` function to ensure proper handling of `createdAt` and other fields.
function saveTool() {
  if (isEditMode.value) {
    // Update existing tool
    store.updateTool(selectedToolId.value, {
      ...toolForm,
      createdAt: new Date(toolForm.createdAt).toISOString(), // Ensure ISO format
    });
  } else {
    // Create new tool
    store.createTool({
      ...toolForm,
      createdAt: new Date().toISOString(), // Set current date for new tools
    });
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
