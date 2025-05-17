<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Tài Khoản</h1>
      <button
        @click="openNewUserModal"
        class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
      >
        <PlusIcon class="w-4 h-4" /> Thêm tài khoản mới
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Vai trò</label
          >
          <select
            v-model="searchQuery.value"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="STAFF">Nhân viên</option>
            <option value="GOLFER">Golfer</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Tìm kiếm</label
          >
          <div class="flex gap-2">
            <!-- Select key -->
            <select
              v-model="searchQuery.key2"
              class="w-1/4 border border-gray-300 rounded-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            >
              <option disabled value="">Chọn trường</option>
              <option value="email">Email</option>
              <option value="phone">Số điện thoại</option>
              <option value="fullName">Họ tên</option>
            </select>

            <!-- Input value -->
            <div class="relative w-2/3">
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                type="text"
                v-model="searchQuery.value2"
                placeholder="Nhập từ khóa"
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>

            <!-- Nút tìm kiếm nhỏ -->
            <button
              type="button"
              @click="onSearch"
              class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition duration-200"
            >
              Tìm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tên
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
          <tr v-for="user in listAccount" :key="user.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.fullName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.role }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.email }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ user.phone }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <span
                :class="{
                  'text-green-600': user.active,
                  'text-red-600': !user.active,
                }"
              >
                {{ user.active ? "Hoạt động" : "Không hoạt động" }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="editUser(user)"
                class="text-blue-600 hover:text-blue-900"
              >
                Sửa
              </button>
              <button
                @click="deleteUser(user)"
                class="text-red-600 hover:text-red-900 ml-4"
              >
                Xóa
              </button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">
              Không có dữ liệu
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

    <!-- Modal Add/Edit -->
    <div
      v-if="showAddUserModal || showEditUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="bg-white rounded-lg w-full max-w-md p-6">
        <h2 class="text-xl font-semibold mb-4">
          {{ showAddUserModal ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản" }}
        </h2>
        <div class="space-y-4">
          <input
            v-model="modalUser.fullName"
            placeholder="Họ và tên"
            class="w-full border px-3 py-2 rounded-md"
          />
          <input
            v-model="modalUser.email"
            placeholder="Email"
            class="w-full border px-3 py-2 rounded-md"
          />
          <input
            v-model="modalUser.phone"
            placeholder="Số điện thoại"
            class="w-full border px-3 py-2 rounded-md"
          />
          <input
            v-if="showAddUserModal"
            v-model="modalUser.password"
            type="password"
            placeholder="Mật khẩu"
            class="w-full border px-3 py-2 rounded-md"
          />
          <select
            v-model="modalUser.role"
            class="w-full border px-3 py-2 rounded-md"
            :disabled="showEditUserModal"
          >
            <option value="ADMIN">Quản trị viên</option>
            <option value="STAFF">Nhân viên</option>
            <option value="GOLFER">Golfer</option>
          </select>
          <select
            v-model="modalUser.active"
            class="w-full border px-3 py-2 rounded-md"
          >
            <option :value="true">Hoạt động</option>
            <option :value="false">Không hoạt động</option>
          </select>
        </div>
        <div class="mt-6 flex justify-end gap-4">
          <button
            @click="closeModal"
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            @click="saveUser"
            class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {{ showAddUserModal ? "Thêm mới" : "Lưu thay đổi" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { PlusIcon } from "lucide-vue-next";
import { useUserStore } from "../stores/user";
import { storeToRefs } from "pinia";

const accountStore = useUserStore();
const currentPage = ref(1);
const itemsPerPage = ref(10);
const selectedUserId = ref(null);
const searchQuery = reactive({
  page: 1,
  size: 10,
  key: "role",
  value: "",
  key2: "",
  value2: "",
});

const { users, pagination } = storeToRefs(accountStore);
const listAccount = computed(() => users.value);
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const modalUser = reactive({
  fullName: "",
  email: "",
  phone: "",
  password: "",
  role: "STAFF",
  active: true,
});

const openNewUserModal = () => {
  modalUser.fullName = "";
  modalUser.email = "";
  modalUser.password = "";
  modalUser.phone = "";
  modalUser.role = "STAFF";
  modalUser.active = true;
  showAddUserModal.value = true;
};

const editUser = (user) => {
  Object.assign(modalUser, user);
  selectedUserId.value = user.id;
  showEditUserModal.value = true;
};

const closeModal = () => {
  showAddUserModal.value = false;
  showEditUserModal.value = false;
};

const saveUser = () => {
  const userData = {
    ...modalUser,
  };
  if (showEditUserModal.value && selectedUserId.value) {
    accountStore.updateUser(selectedUserId.value, userData);
  } else {
    if (userData.role === "STAFF") accountStore.createStaff(userData);
  }

  closeModal();
};

//viet ham update
const refreshData = async () => {
  searchQuery.page = currentPage.value;
  searchQuery.size = itemsPerPage.value;
  searchQuery.key = searchQuery.key;
  searchQuery.value = searchQuery.value;
  searchQuery.key2 = searchQuery.key2;
  searchQuery.value2 = searchQuery.value2;
  // Await the result and update users if needed
  const result = await accountStore.searchUsers(searchQuery);
  if (result && Array.isArray(result)) {
    users.value = result;
  }
};

const deleteUser = (user) => {
  users.value = users.value.filter((u) => u.id !== user.id);
};

const onSearch = () => {
  // currentPage.value = 1;
  refreshData();
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
onMounted(async () => {
  // Fetch initial data
  await refreshData();
});
</script>
