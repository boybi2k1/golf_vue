<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Hội Viên</h1>
      <div class="flex gap-2">
        <button
          @click="openNewMemberModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm hội viên mới
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
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại hội viên</label
              >
              <select
                v-model="filters.membershipType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="standard">Tiêu chuẩn</option>
                <option value="premium">Cao cấp</option>
                <option value="vip">VIP</option>
                <option value="family">Gia đình</option>
                <option value="corporate">Doanh nghiệp</option>
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
                <option value="expired">Hết hạn</option>
                <option value="pending">Chờ duyệt</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Thời gian gia nhập</label
              >
              <select
                v-model="filters.joinPeriod"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả thời gian</option>
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="thisYear">Năm nay</option>
                <option value="lastYear">Năm trước</option>
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
                  placeholder="Tên, mã hội viên, SĐT..."
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
            Thống kê hội viên
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang hoạt động</div>
              <div class="text-xl font-semibold text-green-700">
                {{ getMembersCount("active") }}
              </div>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Hết hạn</div>
              <div class="text-xl font-semibold text-red-700">
                {{ getMembersCount("expired") }}
              </div>
            </div>
            <div class="bg-yellow-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Chờ duyệt</div>
              <div class="text-xl font-semibold text-yellow-700">
                {{ getMembersCount("pending") }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Tổng hội viên</div>
              <div class="text-xl font-semibold text-blue-700">
                {{ members.length }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Members List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
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
                Handicap
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
              v-for="member in filteredMembers"
              :key="member.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ member.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3">
                    <img
                      :src="
                        member.avatar || '/placeholder.svg?height=40&width=40'
                      "
                      class="h-10 w-10 rounded-full object-cover"
                      alt="Member avatar"
                    />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ member.name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ member.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getMembershipTypeText(member.membershipType) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(member.joinDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(member.expiryDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ member.handicap || "N/A" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': member.status === 'active',
                    'bg-red-100 text-red-800': member.status === 'expired',
                    'bg-yellow-100 text-yellow-800':
                      member.status === 'pending',
                    'bg-gray-100 text-gray-800': member.status === 'suspended',
                  }"
                >
                  {{ getStatusText(member.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewMemberDetails(member)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="editMember(member)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDeleteMember(member)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu hội viên
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
              <span class="font-medium">{{ filteredMembers.length }}</span>
              trong số <span class="font-medium">{{ members.length }}</span> kết
              quả
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

    <!-- Member Modal -->
    <div
      v-if="showMemberModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
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
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Họ và tên</label
            >
            <input
              type="text"
              v-model="memberForm.name"
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
                type="tel"
                v-model="memberForm.phone"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại hội viên</label
              >
              <select
                v-model="memberForm.membershipType"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="standard">Tiêu chuẩn</option>
                <option value="premium">Cao cấp</option>
                <option value="vip">VIP</option>
                <option value="family">Gia đình</option>
                <option value="corporate">Doanh nghiệp</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="memberForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="active">Đang hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="pending">Chờ duyệt</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày gia nhập</label
              >
              <input
                type="date"
                v-model="memberForm.joinDate"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày hết hạn</label
              >
              <input
                type="date"
                v-model="memberForm.expiryDate"
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
                v-model="memberForm.birthDate"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giới tính</label
              >
              <select
                v-model="memberForm.gender"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Handicap</label
              >
              <input
                type="number"
                v-model="memberForm.handicap"
                min="0"
                max="54"
                step="0.1"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phí hội viên (VND)</label
              >
              <input
                type="number"
                v-model="memberForm.fee"
                min="0"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Địa chỉ</label
            >
            <input
              type="text"
              v-model="memberForm.address"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Avatar URL</label
            >
            <input
              type="text"
              v-model="memberForm.avatar"
              placeholder="https://example.com/avatar.jpg"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="memberForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeMemberModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="saveMember"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Member Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Chi tiết hội viên
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
                  selectedMember.avatar || '/placeholder.svg?height=80&width=80'
                "
                class="h-20 w-20 rounded-full object-cover"
                alt="Member avatar"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ selectedMember.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ getMembershipTypeText(selectedMember.membershipType) }}
              </p>
              <div class="mt-1">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800':
                      selectedMember.status === 'active',
                    'bg-red-100 text-red-800':
                      selectedMember.status === 'expired',
                    'bg-yellow-100 text-yellow-800':
                      selectedMember.status === 'pending',
                    'bg-gray-100 text-gray-800':
                      selectedMember.status === 'suspended',
                  }"
                >
                  {{ getStatusText(selectedMember.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Mã hội viên
              </h4>
              <p class="text-gray-900">{{ selectedMember.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Email</h4>
              <p class="text-gray-900">{{ selectedMember.email }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </h4>
              <p class="text-gray-900">{{ selectedMember.phone }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Ngày sinh</h4>
              <p class="text-gray-900">
                {{ formatDate(selectedMember.birthDate) || "Không có" }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Giới tính</h4>
              <p class="text-gray-900">
                {{ getGenderText(selectedMember.gender) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Handicap</h4>
              <p class="text-gray-900">
                {{ selectedMember.handicap || "N/A" }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày gia nhập
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedMember.joinDate) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày hết hạn
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedMember.expiryDate) }}
              </p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Địa chỉ</h4>
            <p class="text-gray-900">
              {{ selectedMember.address || "Không có" }}
            </p>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Ghi chú</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedMember.notes || "Không có ghi chú" }}
            </p>
          </div>

          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-900 mb-3">
              Lịch sử hoạt động
            </h4>
            <div class="space-y-3">
              <div
                v-for="(activity, index) in selectedMember.activities"
                :key="index"
                class="flex items-start"
              >
                <div
                  class="flex-shrink-0 h-4 w-4 rounded-full mt-0.5"
                  :class="getActivityColor(activity.type)"
                ></div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">
                    {{ activity.description }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDateTime(activity.date) }}
                  </p>
                </div>
              </div>
              <div
                v-if="
                  !selectedMember.activities ||
                  selectedMember.activities.length === 0
                "
                class="text-sm text-gray-500 italic"
              >
                Không có hoạt động nào
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

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showMemberModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedMemberId = ref(null);
const selectedMember = ref({});

// Form and filters
const filters = reactive({
  membershipType: "",
  status: "",
  joinPeriod: "",
  search: "",
});

const memberForm = reactive({
  id: "",
  name: "",
  email: "",
  phone: "",
  membershipType: "standard",
  status: "active",
  joinDate: "",
  expiryDate: "",
  birthDate: "",
  gender: "male",
  handicap: null,
  fee: 0,
  address: "",
  avatar: "",
  notes: "",
  activities: [],
});

// Mock data
const members = ref([
  {
    id: "MEM001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    membershipType: "vip",
    status: "active",
    joinDate: "2023-01-15",
    expiryDate: "2025-01-15",
    birthDate: "1985-05-20",
    gender: "male",
    handicap: 12.5,
    fee: 25000000,
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Hội viên VIP, ưu tiên đặt sân vào cuối tuần",
    activities: [
      {
        type: "booking",
        description: "Đặt sân 18 hố",
        date: "2025-04-15T08:30:00",
      },
      {
        type: "payment",
        description: "Thanh toán phí hội viên",
        date: "2025-01-10T14:20:00",
      },
      {
        type: "tournament",
        description: "Tham gia giải đấu mùa xuân",
        date: "2024-03-22T07:00:00",
      },
    ],
  },
  {
    id: "MEM002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    membershipType: "standard",
    status: "active",
    joinDate: "2024-02-10",
    expiryDate: "2025-02-10",
    birthDate: "1990-08-15",
    gender: "female",
    handicap: 18.2,
    fee: 10000000,
    address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "",
    activities: [
      {
        type: "booking",
        description: "Đặt sân 9 hố",
        date: "2025-04-10T14:00:00",
      },
      {
        type: "lesson",
        description: "Đăng ký khóa học nâng cao",
        date: "2025-03-05T10:00:00",
      },
    ],
  },
  {
    id: "MEM003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    membershipType: "premium",
    status: "expired",
    joinDate: "2022-05-20",
    expiryDate: "2024-05-20",
    birthDate: "1978-12-03",
    gender: "male",
    handicap: 8.7,
    fee: 15000000,
    address: "789 Đường Hai Bà Trưng, Quận 3, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Cần liên hệ để gia hạn thẻ hội viên",
    activities: [
      {
        type: "booking",
        description: "Đặt sân 18 hố",
        date: "2024-05-01T09:30:00",
      },
      {
        type: "tournament",
        description: "Tham gia giải đấu từ thiện",
        date: "2024-04-22T07:30:00",
      },
      {
        type: "service",
        description: "Sử dụng dịch vụ spa",
        date: "2024-04-15T16:00:00",
      },
    ],
  },
  {
    id: "MEM004",
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0934567890",
    membershipType: "family",
    status: "active",
    joinDate: "2023-08-05",
    expiryDate: "2025-08-05",
    birthDate: "1982-04-25",
    gender: "female",
    handicap: 22.1,
    fee: 30000000,
    address: "101 Đường Nguyễn Du, Quận 1, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Hội viên gia đình, bao gồm 4 thành viên",
    activities: [
      {
        type: "booking",
        description: "Đặt sân 18 hố cho gia đình",
        date: "2025-04-18T08:00:00",
      },
      {
        type: "payment",
        description: "Thanh toán phí thuê thiết bị",
        date: "2025-04-18T07:45:00",
      },
    ],
  },
  {
    id: "MEM005",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    membershipType: "corporate",
    status: "pending",
    joinDate: "2025-04-01",
    expiryDate: "2026-04-01",
    birthDate: "1975-11-10",
    gender: "male",
    handicap: 15.3,
    fee: 50000000,
    address: "202 Đường Điện Biên Phủ, Quận 3, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Đại diện công ty XYZ, chờ xác nhận thanh toán",
    activities: [],
  },
  {
    id: "MEM006",
    name: "Vũ Thị F",
    email: "vuthif@email.com",
    phone: "0956789012",
    membershipType: "standard",
    status: "suspended",
    joinDate: "2023-03-15",
    expiryDate: "2025-03-15",
    birthDate: "1988-07-22",
    gender: "female",
    handicap: 25.8,
    fee: 10000000,
    address: "303 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM",
    avatar: "/placeholder.svg?height=80&width=80",
    notes: "Tạm khóa do vi phạm nội quy sân golf",
    activities: [
      {
        type: "admin",
        description: "Tạm khóa tư cách hội viên",
        date: "2025-03-20T11:30:00",
      },
      {
        type: "booking",
        description: "Đặt sân 9 hố",
        date: "2025-03-18T15:00:00",
      },
    ],
  },
]);

// Computed properties
const filteredMembers = computed(() => {
  let result = members.value;

  if (filters.membershipType) {
    result = result.filter(
      (member) => member.membershipType === filters.membershipType
    );
  }

  if (filters.status) {
    result = result.filter((member) => member.status === filters.status);
  }

  if (filters.joinPeriod) {
    const today = new Date();

    switch (filters.joinPeriod) {
      case "thisMonth":
        const thisMonthStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );
        const thisMonthEnd = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        result = result.filter(
          (member) =>
            new Date(member.joinDate) >= thisMonthStart &&
            new Date(member.joinDate) <= thisMonthEnd
        );
        break;
      case "lastMonth":
        const lastMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        result = result.filter(
          (member) =>
            new Date(member.joinDate) >= lastMonthStart &&
            new Date(member.joinDate) <= lastMonthEnd
        );
        break;
      case "thisYear":
        const thisYearStart = new Date(today.getFullYear(), 0, 1);
        const thisYearEnd = new Date(today.getFullYear(), 11, 31);
        result = result.filter(
          (member) =>
            new Date(member.joinDate) >= thisYearStart &&
            new Date(member.joinDate) <= thisYearEnd
        );
        break;
      case "lastYear":
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        result = result.filter(
          (member) =>
            new Date(member.joinDate) >= lastYearStart &&
            new Date(member.joinDate) <= lastYearEnd
        );
        break;
    }
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (member) =>
        member.name.toLowerCase().includes(searchLower) ||
        member.id.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.phone.includes(filters.search)
    );
  }

  // Sort by join date (newest first)
  result = result.sort((a, b) => {
    return new Date(b.joinDate) - new Date(a.joinDate);
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(members.value.length / itemsPerPage.value) || 1;
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
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getMembershipTypeText(type) {
  switch (type) {
    case "standard":
      return "Tiêu chuẩn";
    case "premium":
      return "Cao cấp";
    case "vip":
      return "VIP";
    case "family":
      return "Gia đình";
    case "corporate":
      return "Doanh nghiệp";
    default:
      return type;
  }
}

function getStatusText(status) {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "expired":
      return "Hết hạn";
    case "pending":
      return "Chờ duyệt";
    case "suspended":
      return "Tạm khóa";
    default:
      return status;
  }
}

function getGenderText(gender) {
  switch (gender) {
    case "male":
      return "Nam";
    case "female":
      return "Nữ";
    case "other":
      return "Khác";
    default:
      return "Không xác định";
  }
}

function getActivityColor(type) {
  switch (type) {
    case "booking":
      return "bg-blue-500";
    case "payment":
      return "bg-green-500";
    case "tournament":
      return "bg-purple-500";
    case "lesson":
      return "bg-yellow-500";
    case "service":
      return "bg-indigo-500";
    case "admin":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getMembersCount(status) {
  return members.value.filter((member) => member.status === status).length;
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
}

function openNewMemberModal() {
  isEditMode.value = false;
  resetMemberForm();
  showMemberModal.value = true;
}

function closeMemberModal() {
  showMemberModal.value = false;
  resetMemberForm();
}

function resetMemberForm() {
  const today = new Date().toISOString().split("T")[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  Object.assign(memberForm, {
    id: "",
    name: "",
    email: "",
    phone: "",
    membershipType: "standard",
    status: "active",
    joinDate: today,
    expiryDate: nextYear.toISOString().split("T")[0],
    birthDate: "",
    gender: "male",
    handicap: null,
    fee: 0,
    address: "",
    avatar: "",
    notes: "",
    activities: [],
  });
}

function viewMemberDetails(member) {
  selectedMember.value = JSON.parse(JSON.stringify(member));
  showDetailsModal.value = true;
}

function editMember(member) {
  isEditMode.value = true;
  selectedMemberId.value = member.id;
  Object.assign(memberForm, JSON.parse(JSON.stringify(member)));
  showMemberModal.value = true;
}

function editFromDetails() {
  isEditMode.value = true;
  selectedMemberId.value = selectedMember.value.id;
  Object.assign(memberForm, JSON.parse(JSON.stringify(selectedMember.value)));
  showDetailsModal.value = false;
  showMemberModal.value = true;
}

function saveMember() {
  if (isEditMode.value) {
    // Update existing member
    const index = members.value.findIndex(
      (m) => m.id === selectedMemberId.value
    );
    if (index !== -1) {
      // Preserve activities
      const activities = members.value[index].activities;

      members.value[index] = {
        ...memberForm,
        activities,
      };
    }
  } else {
    // Create new member
    const newMember = {
      ...memberForm,
      id: `MEM${String(members.value.length + 1).padStart(3, "0")}`,
      activities: [],
    };
    members.value.push(newMember);
  }

  closeMemberModal();
}

function confirmDeleteMember(member) {
  selectedMemberId.value = member.id;
  showConfirmModal.value = true;
}

function deleteMember() {
  const index = members.value.findIndex((m) => m.id === selectedMemberId.value);
  if (index !== -1) {
    members.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}

onMounted(() => {
  // Initialize component
  console.log("Member Management component mounted");
});
</script>
