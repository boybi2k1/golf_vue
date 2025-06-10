<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  PlusIcon,
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EditIcon,
  Trash2Icon,
  XIcon,
  AlertTriangleIcon,
  Guitar,
  SearchIcon,
} from "lucide-vue-next";
import { useStaffStore } from "../../stores/staff";
import { useGuestStore } from "../../stores/guest";
import { storeToRefs } from "pinia";
import { checkAdminRole } from "../../utils/utils";
const isAdmin = checkAdminRole();
// State
const currentPageStaff = ref(1);
const currentPageGolfer = ref(1);
const itemsPerPage = ref(10);
const showUserModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const activeTab = ref("staff");
const staffStore = useStaffStore();
const guestStore = useGuestStore();

const { staffList } = storeToRefs(staffStore);
const { guests } = storeToRefs(guestStore);
const paginationStaff = computed(() => {
  staffStore.pagination;
});
const paginationGolfer = computed(() => {
  guestStore.pagination;
});

const data = computed(() => {
  return activeTab.value === "staff" ? staffList.value : guests.value;
});
const pagination = computed(() => {
  if (activeTab.value === "staff") {
    return (
      paginationStaff.value || {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 1,
      }
    );
  } else {
    return (
      paginationGolfer.value || {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 1,
      }
    );
  }
});

const searchQuery = reactive({
  page:
    activeTab.value === "staff"
      ? currentPageStaff.value
      : currentPageGolfer.value,
  size: itemsPerPage.value,
  key: "role",
  value: "",
  key2: "",
  value2: "",
});
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
// Fetch data
const fetchStaff = async () => {
  await staffStore.searchStaff(searchQuery);
};
const fetchGuest = async () => {
  await guestStore.searchGuest(searchQuery);
};

const getRoleText = (role) => {
  const roles = {
    MANAGER: "Quản lý",
    STAFF: "Nhân viên",
    GUEST: "Khách hàng",
    RECEPTIONIST: "Lễ tân",
    CADDY: "Caddy",
  };
  return roles[role] || role;
};
const getStatusText = (status) => {
  const statuses = {
    active: "Đang hoạt động",
    inactive: "Không hoạt động",
    locked: "Đã khóa",
  };
  return statuses[status] || status;
};

const userForm = reactive({
  id: null,
  fullName: "",
  email: "",
  phone: "",
  role: "staff",
  status: "active",
  avatar: "",
  notes: "",
});
function openNewUserModal() {
  isEditMode.value = false;
  showUserModal.value = true;
}
function closeUserModal() {
  showUserModal.value = false;
  userForm.id = null;
  userForm.fullName = "";
  userForm.email = "";
  userForm.phone = "";
  userForm.role = "staff";
  userForm.status = "active";
  userForm.avatar = "";
  userForm.notes = "";
}
function saveUser() {
  staffStore.createStaff(userForm);

  closeUserModal();
}
const onSearchGolfer = () => {
  searchQuery.page = 1;
  fetchGuest();
};
onMounted(() => {
  fetchStaff();
  fetchGuest();
});
</script>
<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">Quản Lý Người Dùng</h1>
        <div class="flex gap-2">
          <button
            v-if="activeTab === 'staff'"
            @click="openNewUserModal"
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon class="w-4 h-4" /> Thêm nhân viên
          </button>
          <button
            @click="refreshData"
            class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
          >
            <RefreshCwIcon class="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div v-if="isAdmin" class="mb-4 flex gap-2">
        <button
          :class="[
            'px-4 py-2 rounded-t-lg font-semibold',
            activeTab === 'staff'
              ? 'bg-green-600 text-white'
              : 'bg-white text-green-700 border border-b-0 border-green-200',
          ]"
          @click="activeTab = 'staff'"
        >
          Nhân viên
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-t-lg font-semibold',
            activeTab === 'golfer'
              ? 'bg-green-600 text-white'
              : 'bg-white text-green-700 border border-b-0 border-green-200',
          ]"
          @click="activeTab = 'golfer'"
        >
          Khách hàng
        </button>
      </div>

      <!-- Filters -->
      <div class="lg:col-span-3 mb-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <!-- Vai trò -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Vai trò</label
              >
              <select
                v-model="searchQuery.value"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả vai trò</option>
                <option v-if="activeTab === 'staff'" value="manager">
                  Quản lý
                </option>
                <option v-if="activeTab === 'staff'" value="staff">
                  Nhân viên
                </option>
                <option v-if="activeTab === 'staff'" value="receptionist">
                  Lễ tân
                </option>
                <option v-if="activeTab === 'golfer'" value="golfer">
                  Golfer
                </option>
              </select>
            </div>

            <!-- Tìm kiếm -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tìm kiếm theo</label
              >
              <select
                v-model="searchQuery.key2"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả</option>
                <option value="name">Tên</option>
                <option value="email">Email</option>
                <option value="phone">Số điện thoại</option>
              </select>
            </div>

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
                  class="w-full border border-gray-300 rounded-md pl-5 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
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

      <!-- Users List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Danh sách {{ activeTab === "staff" ? "nhân viên" : "khách hàng" }}
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Người dùng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Vai trò
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số điện thoại
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày tạo
                </th>

                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in data" :key="user.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 mr-3">
                      <template v-if="user.avatar">
                        <img
                          :src="user.avatar"
                          class="h-10 w-10 rounded-full object-cover"
                          alt="User avatar"
                        />
                      </template>
                      <template v-else>
                        <div
                          class="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg select-none"
                        >
                          {{
                            (user.name || user.fullName || user.email || "")
                              .charAt(0)
                              .toUpperCase()
                          }}
                        </div>
                      </template>
                    </div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.name || user.fullName || user.email }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-purple-100 text-purple-800': user.role === 'MANAGER',
                      'bg-blue-100 text-blue-800': user.role === 'RECEPTIONIST',
                      'bg-green-100 text-green-800': user.role === 'CADDY',
                      'bg-pink-100 text-pink-800': user.role === 'GOLFER',
                      'bg-orange-100 text-orange-800': user.role === 'GUEST',
                    }"
                  >
                    {{ getRoleText(user.role) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ user.phone }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.createdAt) }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewUserDetails(user)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="editUser(user)"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button
                      v-if="isAdmin"
                      @click="confirmDeleteUser(user)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <Trash2Icon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="data.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu người dùng
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

      <!-- User Modal -->
      <div
        v-if="showUserModal"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div
          class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-green-800">
              {{ isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới" }}
            </h2>
            <button
              @click="closeUserModal"
              class="text-gray-500 hover:text-gray-700"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="px-6 py-4">
            <!-- Staff Form -->
            <template v-if="activeTab === 'staff'">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Họ và tên</label
                >
                <input
                  type="text"
                  v-model="userForm.fullName"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    type="email"
                    v-model="userForm.email"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    type="tel"
                    v-model="userForm.phone"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ngày sinh</label
                  >
                  <input
                    type="date"
                    v-model="userForm.dob"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giới tính</label
                  >
                  <select
                    v-model="userForm.gender"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Địa chỉ</label
                >
                <input
                  type="text"
                  v-model="userForm.address"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Vai trò</label
                  >
                  <select
                    v-model="userForm.role"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="MANAGER">Quản lý</option>
                    <option value="STAFF">Nhân viên</option>
                    <option value="RECEPTIONIST">Lễ tân</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Trạng thái</label
                  >
                  <select
                    v-model="userForm.status"
                    required
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="locked">Đã khóa</option>
                  </select>
                </div>
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Avatar URL</label
                >
                <input
                  type="text"
                  v-model="userForm.avatar"
                  placeholder="https://example.com/avatar.jpg"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Ghi chú</label
                >
                <textarea
                  v-model="userForm.notes"
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                ></textarea>
              </div>
            </template>
          </div>

          <div class="flex justify-end space-x-2 border-t px-6 py-4">
            <button
              @click="closeUserModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="saveUser"
              class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
            >
              {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
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
              Bạn có chắc chắn muốn xóa người dùng này không?
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
              @click="deleteUser"
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
