<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">Quản Lý Sân Golf</h1>
        <div class="flex gap-2">
          <button
            v-if="isAdmin"
            @click="openNewCourseModal"
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon class="w-4 h-4" /> Thêm sân mới
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Trạng thái</label
            >
            <select
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="MAINTENACE">Đang bảo trì</option>
              <option value="CLOSED">Tạm đóng cửa</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Số hố</label
            >
            <select
              v-model="filters.holes"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả</option>
              <option value="9">9 hố</option>
              <option value="18">18 hố</option>
              <option value="27">27 hố</option>
              <option value="36">36 hố</option>
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
                placeholder="Tên sân, địa điểm..."
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"
        ></div>
      </div>
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã sân
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tên sân
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Địa điểm
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số hố
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Độ dài (yards)
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
                v-for="course in filteredCourses"
                :key="course.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ course.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-14 w-24 flex-shrink-0 mr-3">
                      <img
                        :src="URL_IMAGE + course.imageUrl"
                        class="h-14 w-24 rounded object-cover border border-gray-200"
                        alt="Ảnh sân golf"
                        v-if="course.imageUrl"
                      />
                      <div
                        v-else
                        class="h-14 w-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded border border-gray-200 text-xs"
                      >
                        Không có ảnh
                      </div>
                    </div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ course.name }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ course.location }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ course.holes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ course.length }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-green-100 text-green-800': course.status === 'ACTIVE',
                      'bg-yellow-100 text-yellow-800':
                        course.status === 'MAINTENANCE',
                      'bg-red-100 text-red-800': course.status === 'CLOSED',
                    }"
                  >
                    {{ getStatusText(course.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewCourseDetails(course)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="editCourse(course)"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="confirmDeleteCourse(course)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredCourses.length === 0">
                <td
                  colspan="7"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu sân golf
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
          ></div>
        </div>
      </div>
      <!-- Course Modal -->
      <div
        v-if="showCourseModal"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px)"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <!-- Header -->
          <div
            class="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50"
          >
            <h2 class="text-xl font-semibold text-green-800">
              {{ isEditMode ? "Chỉnh sửa sân golf" : "Thêm sân golf mới" }}
            </h2>
            <button
              @click="closeCourseModal"
              class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-white/80 transition-colors"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-6 space-y-5">
            <!-- Hình ảnh sân golf - Đã đưa lên đầu và cải thiện thiết kế -->
            <div
              class="border-2 border-dashed border-green-200 rounded-lg p-5 bg-green-50/30"
            >
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Hình ảnh sân golf
              </label>
              <!-- Bọc tất cả trong label để click ở đâu cũng chọn file -->
              <label for="file-upload" class="block cursor-pointer space-y-4">
                <!-- Image Preview -->
                <div
                  v-if="courseForm.imageUrl"
                  class="relative rounded-lg overflow-hidden border-2 border-green-200"
                >
                  <img
                    :src="courseForm.imageUrl"
                    class="w-full h-48 object-cover"
                    alt="Ảnh xem trước"
                  />
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span
                      class="bg-white/90 hover:bg-white text-green-700 px-3 py-1.5 rounded-md text-sm font-medium"
                    >
                      Thay đổi ảnh
                    </span>
                  </div>
                </div>
                <!-- Upload Placeholder -->
                <div
                  v-else
                  class="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-white"
                >
                  <div class="mx-auto w-12 h-12 text-green-400 mb-3">
                    <!-- SVG icon -->
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
                  <p class="text-sm text-gray-600 mb-2">
                    Chọn hình ảnh sân golf
                  </p>
                  <p class="text-xs text-gray-400">PNG, JPG, GIF tối đa 10MB</p>
                </div>
                <!-- File Input -->
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  @change="onImageChange"
                  class="hidden"
                />
              </label>
            </div>

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Tên sân -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tên sân <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="courseForm.name"
                  required
                  placeholder="Nhập tên sân golf"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <!-- Địa điểm -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="courseForm.location"
                  required
                  placeholder="Nhập địa điểm"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <!-- Course Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Số hố -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Số hố <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="courseForm.holes"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="9">9 hố</option>
                  <option value="18">18 hố</option>
                  <option value="27">27 hố</option>
                  <option value="36">36 hố</option>
                </select>
              </div>

              <!-- Độ dài -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Độ dài (yards) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  v-model="courseForm.length"
                  required
                  placeholder="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <!-- Thời gian -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian (phút) <span class="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  v-model="courseForm.duration"
                  required
                  placeholder="0"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <!-- Trạng thái -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái <span class="text-red-500">*</span>
              </label>
              <select
                v-model="courseForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="MAINTENANCE">Đang bảo trì</option>
                <option value="CLOSED">Tạm đóng cửa</option>
              </select>
            </div>

            <!-- Mô tả -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                v-model="courseForm.description"
                rows="4"
                placeholder="Nhập mô tả về sân golf..."
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end space-x-3 border-t px-6 py-4 bg-gray-50">
            <button
              @click="closeCourseModal"
              class="px-5 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="saveCourse"
              class="px-5 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
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
              Bạn có chắc chắn muốn xóa sân golf này không?
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
              @click="deleteCourse"
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
import { ref, reactive, computed, onMounted, inject } from "vue";
import {
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  XIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";
import { useGolfCourseStore } from "../../stores/golf_course"; // Nhớ cập nhật đúng đường dẫn tới store của bạn
import { storeToRefs } from "pinia";
import { checkAdminRole } from "../../utils/utils";
import { URL_IMAGE } from "../../api";

const isAdmin = checkAdminRole();
const showToast = inject("showToast"); // Inject hàm hiển thị thông báo từ App.vue
// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showCourseModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedCourseId = ref(null);
const file = ref(null);
// Form and filters
const courseForm = reactive({
  id: "",
  code: "",
  name: "",
  location: "",
  holds: "",
  length: 0,
  status: "ACTIVE",
  imageUrl: "",
  duration: 0,
  description: "",
});

// Hàm xử lý khi người dùng chọn ảnh
function onImageChange(e) {
  const selected = e.target.files[0];
  if (!selected) return;
  file.value = selected;

  // Nếu muốn hiển thị preview
  const reader = new FileReader();
  reader.onload = (evt) => {
    courseForm.imageUrl = evt.target.result; // dùng để preview
  };
  reader.readAsDataURL(selected);
}

const filters = reactive({
  status: "",
  holes: "",
  search: "",
});

// Tạo store
const store = useGolfCourseStore();
const { golfCourses, loading } = storeToRefs(store); // Lấy danh sách sân golf từ store

// Computed properties
const filteredCourses = computed(() => {
  const result = golfCourses.value || [];

  if (filters.status) {
    result = result.filter((course) => course.status === filters.status);
  }

  if (filters.holes) {
    result = result.filter(
      (course) => course.holes.toString() === filters.holes
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (course) =>
        course.name.toLowerCase().includes(searchLower) ||
        course.location.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

// Methods
function getStatusText(status) {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "MAINTENANCE":
      return "Đang bảo trì";
    case "CLOSED":
      return "Tạm đóng cửa";
    default:
      return status;
  }
}

function refreshData() {
  store.getAllGolfCourses(); // Refresh dữ liệu từ API
}

function openNewCourseModal() {
  isEditMode.value = false;
  resetCourseForm();
  showCourseModal.value = true;
}

function closeCourseModal() {
  showCourseModal.value = false;
  resetCourseForm();
}

function resetCourseForm() {
  Object.assign(courseForm, {
    id: "",
    code: "",
    name: "",
    location: "",
    imageUrl: "",
    holes: "18",
    length: 0,
    status: "active",
    image: "",
    duration: 0,
    description: "",
  });
}

function viewCourseDetails(course) {
  isEditMode.value = true;
  selectedCourseId.value = course.id;
  Object.assign(courseForm, JSON.parse(JSON.stringify(course)));
  courseForm.imageUrl = URL_IMAGE + course.imageUrl; // Đặt đường dẫn ảnh
  showCourseModal.value = true;
}

function editCourse(course) {
  viewCourseDetails(course);
}

function saveCourse() {
  const formData = new FormData();
  formData.append("code", courseForm.code);
  formData.append("name", courseForm.name);
  formData.append("location", courseForm.location);
  formData.append("holes", courseForm.holes);
  formData.append("length", courseForm.length);
  formData.append("status", courseForm.status);
  formData.append("duration", courseForm.duration);
  formData.append("description", courseForm.description);

  // Gửi file ảnh (nếu có)
  if (file.value) {
    formData.append("image", file.value);
  }

  if (isEditMode.value) {
    store.updateGolfCourse(courseForm.id, formData);
  } else {
    store.createGolfCourse(formData);
  }

  closeCourseModal();
}

function confirmDeleteCourse(course) {
  selectedCourseId.value = course.id;
  showConfirmModal.value = true;
}

function deleteCourse() {
  store.deleteGolfCourse(selectedCourseId.value);
  showToast("Xóa sân thành công!") // Xóa sân golf thông qua store
  showConfirmModal.value = false;
}

onMounted(async () => {
  await store.getAllGolfCourses();
});
</script>
