<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Người Dùng</h1>
      <div class="flex gap-2">
        <button
          @click="openNewUserModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm người dùng mới
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
                >Vai trò</label
              >
              <select
                v-model="filters.role"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
                <option value="receptionist">Lễ tân</option>
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
                <option value="inactive">Không hoạt động</option>
                <option value="locked">Đã khóa</option>
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
                  placeholder="Tên, email, SĐT..."
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
            Thống kê người dùng
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang hoạt động</div>
              <div class="text-xl font-semibold text-green-700">
                {{ getUsersCount("active") }}
              </div>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Không hoạt động</div>
              <div class="text-xl font-semibold text-red-700">
                {{ getUsersCount("inactive") }}
              </div>
            </div>
            <div class="bg-yellow-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đã khóa</div>
              <div class="text-xl font-semibold text-yellow-700">
                {{ getUsersCount("locked") }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Tổng người dùng</div>
              <div class="text-xl font-semibold text-blue-700">
                {{ users.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách người dùng</h2>
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
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ user.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3">
                    <img
                      :src="
                        user.avatar || '/placeholder.svg?height=40&width=40'
                      "
                      class="h-10 w-10 rounded-full object-cover"
                      alt="User avatar"
                    />
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ user.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-purple-100 text-purple-800': user.role === 'admin',
                    'bg-blue-100 text-blue-800': user.role === 'manager',
                    'bg-green-100 text-green-800': user.role === 'staff',
                    'bg-pink-100 text-pink-800': user.role === 'receptionist',
                    'bg-orange-100 text-orange-800': user.role === 'instructor',
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': user.status === 'active',
                    'bg-gray-100 text-gray-800': user.status === 'inactive',
                    'bg-red-100 text-red-800': user.status === 'locked',
                  }"
                >
                  {{ getStatusText(user.status) }}
                </span>
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
                    @click="editUser(user)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDeleteUser(user)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{ filteredUsers.length }}</span> trong
              số <span class="font-medium">{{ users.length }}</span> kết quả
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
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Họ và tên</label
            >
            <input
              type="text"
              v-model="userForm.name"
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
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
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
                <option value="admin">Quản trị viên</option>
                <option value="manager">Quản lý</option>
                <option value="staff">Nhân viên</option>
                <option value="receptionist">Lễ tân</option>
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
          <div
            v-if="!isEditMode"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Mật khẩu</label
              >
              <input
                type="password"
                v-model="userForm.password"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Xác nhận mật khẩu</label
              >
              <input
                type="password"
                v-model="userForm.confirmPassword"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div v-if="isEditMode" class="mb-4">
            <button
              @click="showChangePasswordForm = !showChangePasswordForm"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              {{ showChangePasswordForm ? "Hủy đổi mật khẩu" : "Đổi mật khẩu" }}
            </button>

            <div
              v-if="showChangePasswordForm"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
            >
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Mật khẩu mới</label
                >
                <input
                  type="password"
                  v-model="userForm.password"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Xác nhận mật khẩu mới</label
                >
                <input
                  type="password"
                  v-model="userForm.confirmPassword"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
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

          <div class="border-t pt-4 mt-4">
            <h3 class="text-sm font-medium text-gray-900 mb-3">Quyền hạn</h3>
            <div class="space-y-3">
              <div
                v-for="(module, moduleKey) in permissions"
                :key="moduleKey"
                class="border rounded-md p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-medium text-gray-700">
                    {{ getModuleText(moduleKey) }}
                  </h4>
                  <button
                    @click="toggleAllPermissions(moduleKey)"
                    class="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {{
                      allPermissionsSelected(moduleKey)
                        ? "Bỏ chọn tất cả"
                        : "Chọn tất cả"
                    }}
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="(permission, permKey) in module"
                    :key="permKey"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :id="`perm-${moduleKey}-${permKey}`"
                      v-model="userForm.permissions[moduleKey][permKey]"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      :for="`perm-${moduleKey}-${permKey}`"
                      class="ml-2 block text-sm text-gray-900"
                    >
                      {{ getPermissionText(permKey) }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

    <!-- User Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Chi tiết người dùng
          </h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center mb-6">
            <div class="h-20 w-20 flex-shrink-0 mr-4">
              <img
                :src="
                  selectedUser.avatar || '/placeholder.svg?height=80&width=80'
                "
                class="h-20 w-20 rounded-full object-cover"
                alt="User avatar"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ selectedUser.name }}
              </h3>
              <div class="mt-1 flex items-center">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full mr-2': true,
                    'bg-purple-100 text-purple-800':
                      selectedUser.role === 'admin',
                    'bg-blue-100 text-blue-800':
                      selectedUser.role === 'manager',
                    'bg-green-100 text-green-800':
                      selectedUser.role === 'staff',
                    'bg-pink-100 text-pink-800':
                      selectedUser.role === 'receptionist',
                    'bg-orange-100 text-orange-800':
                      selectedUser.role === 'instructor',
                  }"
                >
                  {{ getRoleText(selectedUser.role) }}
                </span>
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800':
                      selectedUser.status === 'active',
                    'bg-gray-100 text-gray-800':
                      selectedUser.status === 'inactive',
                    'bg-red-100 text-red-800': selectedUser.status === 'locked',
                  }"
                >
                  {{ getStatusText(selectedUser.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">ID</h4>
              <p class="text-gray-900">{{ selectedUser.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p class="text-gray-900">{{ selectedUser.email }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </h4>
              <p class="text-gray-900">
                {{ selectedUser.phone || "Không có" }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Ngày tạo</h4>
              <p class="text-gray-900">
                {{ formatDate(selectedUser.createdAt) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Lần đăng nhập cuối
              </h4>
              <p class="text-gray-900">
                {{ formatDateTime(selectedUser.lastLogin) || "Chưa đăng nhập" }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Cập nhật lần cuối
              </h4>
              <p class="text-gray-900">
                {{ formatDateTime(selectedUser.updatedAt) || "Chưa cập nhật" }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Ghi chú</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedUser.notes || "Không có ghi chú" }}
            </p>
          </div>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">Quyền hạn</h4>
            <div class="space-y-3">
              <div
                v-for="(module, moduleKey) in selectedUser.permissions"
                :key="moduleKey"
                class="border rounded-md p-3"
              >
                <h5 class="text-sm font-medium text-gray-700 mb-2">
                  {{ getModuleText(moduleKey) }}
                </h5>
                <div class="grid grid-cols-2 gap-2">
                  <div
                    v-for="(hasPermission, permKey) in module"
                    :key="permKey"
                    class="flex items-center"
                  >
                    <div
                      class="h-4 w-4 rounded border flex items-center justify-center"
                      :class="
                        hasPermission
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white border-gray-300'
                      "
                    >
                      <CheckIcon
                        v-if="hasPermission"
                        class="h-3 w-3 text-white"
                      />
                    </div>
                    <span class="ml-2 text-sm text-gray-900">{{
                      getPermissionText(permKey)
                    }}</span>
                  </div>
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
  CheckIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showUserModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const showChangePasswordForm = ref(false);
const isEditMode = ref(false);
const selectedUserId = ref(null);
const selectedUser = ref({});

// Form and filters
const filters = reactive({
  role: "",
  status: "",
  search: "",
});

// Permission structure
const permissions = {
  members: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  bookings: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  events: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  services: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  payments: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  reports: {
    view: true,
    export: true,
  },
  users: {
    view: true,
    create: true,
    edit: true,
    delete: true,
  },
  settings: {
    view: true,
    edit: true,
  },
};

const userForm = reactive({
  id: "",
  name: "",
  email: "",
  phone: "",
  role: "staff",
  status: "active",
  password: "",
  confirmPassword: "",
  avatar: "",
  notes: "",
  permissions: JSON.parse(JSON.stringify(permissions)),
});

// Mock data
const users = ref([
  {
    id: "USR001",
    name: "Nguyễn Quản Trị",
    email: "admin@golfcourse.com",
    phone: "0901234567",
    role: "admin",
    status: "active",
    createdAt: "2023-01-10",
    lastLogin: "2025-04-20T08:30:00",
    updatedAt: "2024-03-15T14:20:00",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Quản trị viên hệ thống",
    permissions: {
      members: { view: true, create: true, edit: true, delete: true },
      bookings: { view: true, create: true, edit: true, delete: true },
      events: { view: true, create: true, edit: true, delete: true },
      services: { view: true, create: true, edit: true, delete: true },
      payments: { view: true, create: true, edit: true, delete: true },
      reports: { view: true, export: true },
      users: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, edit: true },
    },
  },
  {
    id: "USR002",
    name: "Trần Quản Lý",
    email: "manager@golfcourse.com",
    phone: "0912345678",
    role: "manager",
    status: "active",
    createdAt: "2023-03-15",
    lastLogin: "2025-04-19T10:15:00",
    updatedAt: "2024-02-20T11:30:00",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Quản lý sân golf",
    permissions: {
      members: { view: true, create: true, edit: true, delete: false },
      bookings: { view: true, create: true, edit: true, delete: true },
      events: { view: true, create: true, edit: true, delete: false },
      services: { view: true, create: true, edit: true, delete: false },
      payments: { view: true, create: true, edit: true, delete: false },
      reports: { view: true, export: true },
      users: { view: true, create: false, edit: false, delete: false },
      settings: { view: true, edit: false },
    },
  },
  {
    id: "USR003",
    name: "Lê Thị Lễ Tân",
    email: "receptionist@golfcourse.com",
    phone: "0923456789",
    role: "receptionist",
    status: "active",
    createdAt: "2024-01-05",
    lastLogin: "2025-04-20T07:45:00",
    updatedAt: "2024-01-05T09:00:00",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Lễ tân tiếp đón khách hàng",
    permissions: {
      members: { view: true, create: true, edit: false, delete: false },
      bookings: { view: true, create: true, edit: true, delete: false },
      events: { view: true, create: false, edit: false, delete: false },
      services: { view: true, create: false, edit: false, delete: false },
      payments: { view: true, create: true, edit: false, delete: false },
      reports: { view: false, export: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
    },
  },
  {
    id: "USR004",
    name: "Phạm Văn Nhân Viên",
    email: "staff@golfcourse.com",
    phone: "0934567890",
    role: "staff",
    status: "active",
    createdAt: "2024-02-10",
    lastLogin: "2025-04-19T16:30:00",
    updatedAt: "2024-02-10T10:15:00",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Nhân viên phục vụ sân golf",
    permissions: {
      members: { view: true, create: false, edit: false, delete: false },
      bookings: { view: true, create: false, edit: false, delete: false },
      events: { view: true, create: false, edit: false, delete: false },
      services: { view: true, create: false, edit: false, delete: false },
      payments: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, export: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
    },
  },

  {
    id: "USR006",
    name: "Vũ Thị Nhân Viên",
    email: "vuthi@golfcourse.com",
    phone: "0956789012",
    role: "staff",
    status: "locked",
    createdAt: "2023-09-15",
    lastLogin: "2024-10-05T11:45:00",
    updatedAt: "2025-02-01T08:30:00",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Tài khoản bị khóa do vi phạm quy định",
    permissions: {
      members: { view: true, create: false, edit: false, delete: false },
      bookings: { view: true, create: false, edit: false, delete: false },
      events: { view: true, create: false, edit: false, delete: false },
      services: { view: true, create: false, edit: false, delete: false },
      payments: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, export: false },
      users: { view: false, create: false, edit: false, delete: false },
      settings: { view: false, edit: false },
    },
  },
]);

// Computed properties
const filteredUsers = computed(() => {
  let result = users.value;

  if (filters.role) {
    result = result.filter((user) => user.role === filters.role);
  }

  if (filters.status) {
    result = result.filter((user) => user.status === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(filters.search)
    );
  }

  // Sort by creation date (newest first)
  result = result.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(users.value.length / itemsPerPage.value) || 1;
});

// Methods
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return null;
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRoleText(role) {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "manager":
      return "Quản lý";
    case "staff":
      return "Nhân viên";
    case "receptionist":
      return "Lễ tân";
    default:
      return role;
  }
}

function getStatusText(status) {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "inactive":
      return "Không hoạt động";
    case "locked":
      return "Đã khóa";
    default:
      return status;
  }
}

function getModuleText(module) {
  switch (module) {
    case "members":
      return "Quản lý hội viên";
    case "bookings":
      return "Quản lý đặt sân";
    case "events":
      return "Quản lý sự kiện";
    case "services":
      return "Quản lý dịch vụ";
    case "payments":
      return "Quản lý thanh toán";
    case "reports":
      return "Báo cáo thống kê";
    case "users":
      return "Quản lý người dùng";
    case "settings":
      return "Cài đặt hệ thống";
    default:
      return module;
  }
}

function getPermissionText(permission) {
  switch (permission) {
    case "view":
      return "Xem";
    case "create":
      return "Thêm mới";
    case "edit":
      return "Chỉnh sửa";
    case "delete":
      return "Xóa";
    case "export":
      return "Xuất báo cáo";
    default:
      return permission;
  }
}

function getUsersCount(status) {
  return users.value.filter((user) => user.status === status).length;
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
}

function openNewUserModal() {
  isEditMode.value = false;
  resetUserForm();
  showUserModal.value = true;
  showChangePasswordForm.value = false;
}

function closeUserModal() {
  showUserModal.value = false;
  resetUserForm();
  showChangePasswordForm.value = false;
}

function resetUserForm() {
  Object.assign(userForm, {
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "staff",
    status: "active",
    password: "",
    confirmPassword: "",
    avatar: "",
    notes: "",
    permissions: JSON.parse(JSON.stringify(permissions)),
  });

  // Reset all permissions based on role
  if (userForm.role === "staff" || userForm.role === "instructor") {
    Object.keys(userForm.permissions).forEach((module) => {
      Object.keys(userForm.permissions[module]).forEach((perm) => {
        userForm.permissions[module][perm] = perm === "view";
      });
    });
  }
}

function viewUserDetails(user) {
  selectedUser.value = JSON.parse(JSON.stringify(user));
  showDetailsModal.value = true;
}

function editUser(user) {
  isEditMode.value = true;
  selectedUserId.value = user.id;
  Object.assign(userForm, JSON.parse(JSON.stringify(user)));
  userForm.password = "";
  userForm.confirmPassword = "";
  showUserModal.value = true;
  showChangePasswordForm.value = false;
}

function editFromDetails() {
  isEditMode.value = true;
  selectedUserId.value = selectedUser.value.id;
  Object.assign(userForm, JSON.parse(JSON.stringify(selectedUser.value)));
  userForm.password = "";
  userForm.confirmPassword = "";
  showDetailsModal.value = false;
  showUserModal.value = true;
  showChangePasswordForm.value = false;
}

function saveUser() {
  // Validate password match
  if (
    (isEditMode.value && showChangePasswordForm.value && userForm.password) ||
    !isEditMode.value
  ) {
    if (userForm.password !== userForm.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
  }

  if (isEditMode.value) {
    // Update existing user
    const index = users.value.findIndex((u) => u.id === selectedUserId.value);
    if (index !== -1) {
      const updatedUser = { ...userForm };
      delete updatedUser.confirmPassword;

      // Only update password if it was changed
      if (!showChangePasswordForm.value || !updatedUser.password) {
        delete updatedUser.password;
      }

      updatedUser.updatedAt = new Date().toISOString();
      users.value[index] = updatedUser;
    }
  } else {
    // Create new user
    const newUser = {
      ...userForm,
      id: `USR${String(users.value.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString(),
    };
    delete newUser.confirmPassword;
    users.value.push(newUser);
  }

  closeUserModal();
}

function confirmDeleteUser(user) {
  selectedUserId.value = user.id;
  showConfirmModal.value = true;
}

function deleteUser() {
  const index = users.value.findIndex((u) => u.id === selectedUserId.value);
  if (index !== -1) {
    users.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}

function toggleAllPermissions(moduleKey) {
  const allSelected = allPermissionsSelected(moduleKey);

  // Toggle all permissions in the module
  Object.keys(userForm.permissions[moduleKey]).forEach((permKey) => {
    userForm.permissions[moduleKey][permKey] = !allSelected;
  });
}

function allPermissionsSelected(moduleKey) {
  return Object.values(userForm.permissions[moduleKey]).every(
    (value) => value === true
  );
}

onMounted(() => {
  // Initialize component
  console.log("User Management component mounted");
});
</script>
