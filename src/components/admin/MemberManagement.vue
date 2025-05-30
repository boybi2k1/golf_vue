<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Hội Viên</h1>
      <div class="flex gap-2">
        <!-- <button
          @click="openNewMemberModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm hội viên mới
        </button> -->
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="mb-4">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex flex-col md:flex-row md:items-end md:space-x-4 gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Loại hội viên</label
            >
            <select
              v-model="searchFilters.type"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả loại</option>
              <option value="STANDARD">Tiêu chuẩn</option>
              <option value="PREMIUM">Cao cấp</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Trạng thái</label
            >
            <select
              v-model="searchFilters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="INACTIVE">Không hoạt động</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tiêu chí tìm kiếm</label
            >
            <select
              v-model="searchFilters.key"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả</option>
              <option value="fullName">Tên hội viên</option>
              <option value="code">Mã hội viên</option>
              <option value="phone">Số điện thoại</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Từ khóa</label
            >
            <div class="relative">
              <SearchIcon
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              />
              <input
                type="text"
                v-model="searchFilters.value"
                :placeholder="`Nhập ${searchFilters.key}`"
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="flex-shrink-0 flex items-end">
            <button
              @click="searchMemberships"
              class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <SearchIcon class="w-4 h-4" /> Tìm kiếm
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="membershipStore.loading"
      class="flex justify-center items-center p-8"
    >
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"
      ></div>
    </div>

    <!-- Members List -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách hội viên</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã hội viên
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Hội viên
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại hội viên
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày gia nhập
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày hết hạn
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
              v-for="member in memberships"
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ member.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3">
                    <template v-if="member.avatar">
                      <img :src="member.avatar" :alt="member.fullName" class="w-10 h-10 rounded-full object-cover border border-gray-300" />
                    </template>
                    <template v-else>
                      <div
                        class="flex items-center justify-center w-10 h-10 text-xl font-semibold text-gray-500 bg-gray-200 rounded-full"
                      >
                        {{ member.fullName?.charAt(0) }}
                      </div>
                    </template>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ member.fullName }}
                    </div>
                    <div class="text-sm text-gray-500">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.membershipTypeName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(member.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(member.endDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': member.status === 'ACTIVE',
                    'bg-red-100 text-red-800': member.status === 'EXPIRED',
                    'bg-yellow-100 text-yellow-800':
                      member.status === 'PENDING',
                    'bg-gray-100 text-gray-800': member.status === 'INACTIVE',
                    'bg-orange-100 text-orange-800':
                      member.status === 'CANCELLED',
                    'bg-blue-100 text-blue-800': member.status === 'PAID',
                  }"
                >
                  {{ getStatusText(member.status) }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium relative"
              >
                <div class="flex space-x-2">
                  <button
                    @click="toggleActionDropdown(member.id)"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none"
                    title="Thao tác"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                      <circle cx="5" cy="12" r="2" />
                    </svg>
                  </button>
                  <!-- Dropdown menu -->
                  <div
                    v-if="actionDropdownId === member.id"
                    class="absolute right-0 z-10 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg"
                    @click.away="actionDropdownId = null"
                  >
                    <button
                      @click="
                        viewMemberDetails(member);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
                    >
                      <EyeIcon class="w-4 h-4" /> Xem chi tiết
                    </button>
                    <button
                      @click="
                        editMember(member);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 flex items-center gap-2"
                    >
                      <EditIcon class="w-4 h-4" /> Chỉnh sửa
                    </button>
                    <button
                      v-if="member.status === 'PENDING'"
                      @click="
                        confirmMembership(member.id);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600 flex items-center gap-2"
                    >
                      <CheckIcon class="w-4 h-4" /> Xác nhận đăng ký
                    </button>
                    <button
                      v-if="member.status === 'ACTIVE'"
                      @click="
                        lockMembership(member.id);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-orange-600 flex items-center gap-2"
                    >
                      <LockIcon class="w-4 h-4" /> Tạm khóa
                    </button>
                    <button
                      v-if="member.status === 'EXPIRED'"
                      @click="
                        renewMembership(member.id);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-purple-600 flex items-center gap-2"
                    >
                      <RefreshCwIcon class="w-4 h-4" /> Gia hạn
                    </button>
                    <button
                      @click="
                        confirmDeleteMember(member);
                        actionDropdownId = null;
                      "
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2"
                    >
                      <Trash2Icon class="w-4 h-4" /> Xóa
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="membershipStore.memberships.length === 0">
              <td
                colspan="7"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu hội viên
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{
                membershipStore.memberships.length
              }}</span>
              trong số
              <span class="font-medium">{{
                membershipStore.pagination.totalElements
              }}</span>
              kết quả
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="previousPage"
                :disabled="pagination.page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <span
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
                Trang {{ pagination.currentPage }} / {{ pagination.totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="pagination.page === pagination.totalPages"
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

    <!-- New/Edit Member Modal -->
    <div
      v-if="showMemberModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isEditMode ? "Chỉnh sửa hội viên" : "Thêm hội viên mới" }}
          </h2>
          <button
            @click="closeMemberModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <form @submit.prevent="saveMember">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Họ tên</label
                >
                <input
                  type="text"
                  v-model="memberForm.fullName"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Email</label
                >
                <input
                  type="email"
                  v-model="memberForm.email"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Số điện thoại</label
                >
                <input
                  type="text"
                  v-model="memberForm.phone"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại hội viên</label
                >
                <select
                  v-model="memberForm.membershipTypeId"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option disabled value="">Chọn loại hội viên</option>
                  <option
                    v-for="type in membershipTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Ngày bắt đầu</label
                >
                <input
                  type="date"
                  v-model="memberForm.startDate"
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
                  v-model="memberForm.endDate"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div v-if="isEditMode">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Trạng thái</label
                >
                <select
                  v-model="memberForm.status"
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="EXPIRED">Hết hạn</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end space-x-2 mt-6">
              <button
                type="button"
                @click="closeMemberModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
              >
                {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Member Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div
        class="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between px-6 py-4 bg-gray-100 border-b"
        >
          <h2 class="text-2xl font-bold text-gray-800">Chi tiết hội viên</h2>
          <button
            @click="closeDetailsModal"
            class="text-gray-400 hover:text-gray-600"
          >
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <!-- Member Overview -->
          <div class="flex items-center space-x-6 mb-6">
            <div
              class="flex items-center justify-center w-24 h-24 text-xl font-semibold text-gray-500 bg-gray-200 rounded-full"
            >
              {{ selectedMember.fullName?.charAt(0) }}
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-gray-900">
                {{ selectedMember.fullName }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ selectedMember.membershipTypeName }}
              </p>
              <span
                class="inline-block px-3 py-1 mt-2 text-xs font-medium rounded-full"
                :class="{
                  'bg-green-100 text-green-800':
                    selectedMember.status === 'ACTIVE',
                  'bg-red-100 text-red-800':
                    selectedMember.status === 'EXPIRED',
                  'bg-yellow-100 text-yellow-800':
                    selectedMember.status === 'PENDING',
                  'bg-gray-100 text-gray-800':
                    selectedMember.status === 'INACTIVE',
                  'bg-orange-100 text-orange-800':
                    selectedMember.status === 'CANCELLED',
                  'bg-blue-100 text-blue-800': selectedMember.status === 'PAID',
                }"
              >
                {{ getStatusText(selectedMember.status) }}
              </span>
            </div>
          </div>

          <!-- Member Info Grid -->
          <div
            class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700"
          >
            <div>
              <p class="mb-1 font-medium text-gray-500">Mã hội viên</p>
              <p class="font-semibold text-gray-900">
                {{ selectedMember.code }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Email</p>
              <p class="text-gray-900">{{ selectedMember.email }}</p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Số điện thoại</p>
              <p class="text-gray-900">{{ selectedMember.phone }}</p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Ngày gia nhập</p>
              <p class="text-gray-900">
                {{ formatDate(selectedMember.startDate) }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Ngày hết hạn</p>
              <p class="text-gray-900">
                {{ formatDate(selectedMember.endDate) }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Thời gian tạo</p>
              <p class="text-gray-900">
                {{ formatDateTime(selectedMember.createdAt) }}
              </p>
            </div>
            <div>
              <p class="mb-1 font-medium text-gray-500">Thời gian cập nhật</p>
              <p class="text-gray-900">
                {{ formatDateTime(selectedMember.updatedAt) }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap justify-center gap-3 mt-8">
            <button
              v-if="selectedMember.status === 'PENDING'"
              @click="confirmMembership(selectedMember.id)"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <CheckIcon class="w-4 h-4" /> Xác nhận đăng ký
            </button>
            <button
              v-if="selectedMember.status === 'ACTIVE'"
              @click="lockMembership(selectedMember.id)"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
            >
              <LockIcon class="w-4 h-4" /> Tạm khóa
            </button>
            <button
              v-if="selectedMember.status === 'EXPIRED'"
              @click="renewMembership(selectedMember.id)"
              class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <RefreshCwIcon class="w-4 h-4" /> Gia hạn
            </button>
            <button
              @click="closeDetailsModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
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
            Bạn có chắc chắn muốn xóa hội viên này không?
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
            @click="deleteMember"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>

    <!-- Notification toast -->
    <div
      v-if="notification.show"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg z-50"
      :class="{
        'bg-green-500 text-white': notification.type === 'success',
        'bg-red-500 text-white': notification.type === 'error',
        'bg-blue-500 text-white': notification.type === 'info',
      }"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from "vue";
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
  LockIcon,
} from "lucide-vue-next";
import { useMembershipStore } from "../../stores/membership";
import { storeToRefs } from "pinia";
import { useMembershipTypeStore } from "../../stores/membership_type";

// Store and state
const membershipStore = useMembershipStore();
const membershipTypeStore = useMembershipTypeStore();
const showMemberModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedMember = ref({});
const memberToDelete = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const actionDropdownId = ref(null);

function toggleActionDropdown(id) {
  actionDropdownId.value = actionDropdownId.value === id ? null : id;
}
// Form data
const { memberships, pagination } = storeToRefs(membershipStore);
const { membershipTypes } = storeToRefs(membershipTypeStore);
const memberForm = reactive({
  id: "",
  userId: "",
  code: "",
  fullName: "",
  email: "",
  phone: "",
  membershipTypeId: "",
  membershipTypeName: "",
  startDate: "",
  endDate: "",
  status: "PENDING",
});

// Search filters
const searchFilters = reactive({
  key: "",
  value: "",
  type: "",
  status: "",
  page: currentPage.value,
  size: itemsPerPage.value,
});

// Notification toast
const notification = reactive({
  show: false,
  message: "",
  type: "success", // success | error | info
});

// Đổi trang
function previousPage() {
  if (currentPage.value > 1) currentPage.value--;
}
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}
watch(currentPage, () => {
  // Có thể gọi lại API nếu dùng backend phân trang
});

// Format ngày
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN");
}
function formatDateTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("vi-VN");
}

// Hiển thị trạng thái
function getStatusText(status) {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "INACTIVE":
      return "Không hoạt động";
    case "EXPIRED":
      return "Hết hạn";
    case "PENDING":
      return "Chờ duyệt";
    case "CANCELLED":
      return "Đã hủy";
    case "PAID":
      return "Đã thanh toán";
    default:
      return status;
  }
}

// Modal thao tác

function editMember(member) {
  isEditMode.value = true;
  Object.assign(memberForm, member);
  showMemberModal.value = true;
}
function closeMemberModal() {
  showMemberModal.value = false;
}
function viewMemberDetails(member) {
  selectedMember.value = { ...member };
  showDetailsModal.value = true;
}
function closeDetailsModal() {
  showDetailsModal.value = false;
}

// Xác nhận/xử lý trạng thái
async function confirmMembership(id) {
  // Gọi API xác nhận hoặc cập nhật local
  await membershipStore.confirmMembership(id).then(() => {
    const member = membershipStore.memberships.find((m) => m.id === id);
    if (member) {
      member.status = "ACTIVE";
      showNotification("Đã xác nhận hội viên!", "success");
    }
  });
}
function lockMembership(id) {
  const member = membershipStore.memberships.find((m) => m.id === id);
  if (member) {
    member.status = "INACTIVE";
    showNotification("Đã tạm khóa hội viên!", "info");
  }
}
function renewMembership(id) {
  const member = membershipStore.memberships.find((m) => m.id === id);
  if (member) {
    member.status = "ACTIVE";
    showNotification("Đã gia hạn hội viên!", "success");
  }
}
function confirmDeleteMember(member) {
  memberToDelete.value = member;
  showConfirmModal.value = true;
}
function deleteMember() {
  const idx = membershipStore.memberships.findIndex(
    (m) => m.id === memberToDelete.value.id
  );
  if (idx !== -1) {
    membershipStore.memberships.splice(idx, 1);
    showNotification("Đã xóa hội viên!", "success");
  }
  showConfirmModal.value = false;
}

// Thông báo
function showNotification(message, type = "success") {
  notification.message = message;
  notification.type = type;
  notification.show = true;
  setTimeout(() => (notification.show = false), 2000);
}

// Tìm kiếm
function searchMemberships() {
  currentPage.value = 1;
  membershipStore.searchMembership(searchFilters);
}

// Làm mới
function refreshData() {
  searchFilters.key = "";
  searchFilters.value = "";
  searchFilters.type = "";
  searchFilters.status = "";
  searchFilters.page = 1;
  membershipStore.searchMembership(searchFilters);
}

// Lifecycle
onMounted(async () => {
  // Nếu dùng API thì gọi API lấy danh sách hội viên ở đây
  Promise.all([await membershipTypeStore.getAllMembershipTypes()]).then(() => {
    refreshData();
  });
});
</script>
