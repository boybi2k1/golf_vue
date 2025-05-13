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

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Filters -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại thiết bị</label
              >
              <select
                v-model="filters.category"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="golf-club">Gậy golf</option>
                <option value="golf-cart">Xe điện</option>
                <option value="maintenance">Thiết bị bảo trì</option>
                <option value="accessories">Phụ kiện</option>
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
                <option value="available">Sẵn sàng</option>
                <option value="in-use">Đang sử dụng</option>
                <option value="maintenance">Đang bảo trì</option>
                <option value="broken">Hỏng</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Vị trí</label
              >
              <select
                v-model="filters.location"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả vị trí</option>
                <option value="clubhouse">Nhà câu lạc bộ</option>
                <option value="pro-shop">Pro Shop</option>
                <option value="maintenance-shed">Kho bảo trì</option>
                <option value="course">Trên sân</option>
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

      <!-- Stats -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-sm font-medium text-gray-900 mb-3">
            Thống kê thiết bị
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Sẵn sàng</div>
              <div class="text-xl font-semibold text-green-700">
                {{ getToolsCount("available") }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang sử dụng</div>
              <div class="text-xl font-semibold text-blue-700">
                {{ getToolsCount("in-use") }}
              </div>
            </div>
            <div class="bg-yellow-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang bảo trì</div>
              <div class="text-xl font-semibold text-yellow-700">
                {{ getToolsCount("maintenance") }}
              </div>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Hỏng</div>
              <div class="text-xl font-semibold text-red-700">
                {{ getToolsCount("broken") }}
              </div>
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
                Vị trí
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trạng thái
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày mua
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Bảo trì tiếp theo
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
                {{ tool.id }}
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
                {{ getCategoryText(tool.category) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getLocationText(tool.location) }}
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(tool.purchaseDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  :class="{
                    'text-red-600 font-medium': isMaintenanceOverdue(
                      tool.nextMaintenance
                    ),
                    'text-yellow-600 font-medium': isMaintenanceSoon(
                      tool.nextMaintenance
                    ),
                  }"
                >
                  {{ formatDate(tool.nextMaintenance) }}
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
              số <span class="font-medium">{{ tools.length }}</span> kết quả
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
                v-model="toolForm.category"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="golf-club">Gậy golf</option>
                <option value="golf-cart">Xe điện</option>
                <option value="maintenance">Thiết bị bảo trì</option>
                <option value="accessories">Phụ kiện</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Vị trí</label
              >
              <select
                v-model="toolForm.location"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="clubhouse">Nhà câu lạc bộ</option>
                <option value="pro-shop">Pro Shop</option>
                <option value="maintenance-shed">Kho bảo trì</option>
                <option value="course">Trên sân</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="toolForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="available">Sẵn sàng</option>
                <option value="in-use">Đang sử dụng</option>
                <option value="maintenance">Đang bảo trì</option>
                <option value="broken">Hỏng</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số serial</label
              >
              <input
                type="text"
                v-model="toolForm.serialNumber"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày mua</label
              >
              <input
                type="date"
                v-model="toolForm.purchaseDate"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Bảo trì tiếp theo</label
              >
              <input
                type="date"
                v-model="toolForm.nextMaintenance"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giá mua (VND)</label
              >
              <input
                type="number"
                v-model="toolForm.purchasePrice"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Nhà cung cấp</label
              >
              <input
                type="text"
                v-model="toolForm.supplier"
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
              v-model="toolForm.image"
              placeholder="https://example.com/image.jpg"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
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
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Lịch sử bảo trì</label
            >
            <div
              class="border border-gray-200 rounded-md p-3 max-h-40 overflow-y-auto"
            >
              <div
                v-if="toolForm.maintenanceHistory.length === 0"
                class="text-sm text-gray-500 text-center py-2"
              >
                Chưa có lịch sử bảo trì
              </div>
              <div v-else class="space-y-2">
                <div
                  v-for="(record, index) in toolForm.maintenanceHistory"
                  :key="index"
                  class="text-sm border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                >
                  <div class="flex justify-between">
                    <span class="font-medium">{{
                      formatDate(record.date)
                    }}</span>
                    <span>{{ record.type }}</span>
                  </div>
                  <p class="text-gray-600">{{ record.notes }}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="isEditMode && toolForm.status === 'in-use'"
            class="mb-4 p-3 bg-blue-50 rounded-md"
          >
            <h3 class="text-sm font-medium text-blue-800 mb-2">
              Thông tin sử dụng
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-gray-600">Người mượn:</span>
                <span class="ml-1">{{
                  toolForm.usageInfo?.borrower || "N/A"
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Thời gian mượn:</span>
                <span class="ml-1">{{
                  formatDateTime(toolForm.usageInfo?.borrowTime) || "N/A"
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Dự kiến trả:</span>
                <span class="ml-1">{{
                  formatDate(toolForm.usageInfo?.expectedReturn) || "N/A"
                }}</span>
              </div>
              <div>
                <span class="text-gray-600">Ghi chú:</span>
                <span class="ml-1">{{
                  toolForm.usageInfo?.notes || "Không có"
                }}</span>
              </div>
            </div>
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

    <!-- Quick Actions Modal -->
    <div
      v-if="showActionsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Thao tác nhanh</h2>
          <button
            @click="showActionsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <div class="flex items-center">
              <div class="h-12 w-12 flex-shrink-0 mr-3">
                <img
                  :src="
                    selectedTool.image || '/placeholder.svg?height=48&width=48'
                  "
                  class="h-12 w-12 rounded-full object-cover"
                  alt="Tool thumbnail"
                />
              </div>
              <div>
                <div class="text-lg font-medium text-gray-900">
                  {{ selectedTool.name }}
                </div>
                <div class="text-sm text-gray-500">{{ selectedTool.id }}</div>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button
              v-if="selectedTool.status === 'available'"
              @click="openCheckoutModal"
              class="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-md"
            >
              <div class="flex items-center">
                <LogOutIcon class="w-5 h-5 text-blue-600 mr-2" />
                <span class="text-blue-800">Cho mượn thiết bị</span>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-blue-600" />
            </button>

            <button
              v-if="selectedTool.status === 'in-use'"
              @click="checkInTool"
              class="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-md"
            >
              <div class="flex items-center">
                <LogInIcon class="w-5 h-5 text-green-600 mr-2" />
                <span class="text-green-800">Trả thiết bị</span>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-green-600" />
            </button>

            <button
              v-if="selectedTool.status !== 'maintenance'"
              @click="sendToMaintenance"
              class="w-full flex items-center justify-between p-3 bg-yellow-50 hover:bg-yellow-100 rounded-md"
            >
              <div class="flex items-center">
                <WrenchIcon class="w-5 h-5 text-yellow-600 mr-2" />
                <span class="text-yellow-800">Gửi đi bảo trì</span>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-yellow-600" />
            </button>

            <button
              v-if="selectedTool.status === 'maintenance'"
              @click="completeMaintenance"
              class="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-md"
            >
              <div class="flex items-center">
                <CheckCircleIcon class="w-5 h-5 text-green-600 mr-2" />
                <span class="text-green-800">Hoàn thành bảo trì</span>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-green-600" />
            </button>

            <button
              v-if="selectedTool.status !== 'broken'"
              @click="markAsBroken"
              class="w-full flex items-center justify-between p-3 bg-red-50 hover:bg-red-100 rounded-md"
            >
              <div class="flex items-center">
                <AlertTriangleIcon class="w-5 h-5 text-red-600 mr-2" />
                <span class="text-red-800">Đánh dấu hỏng</span>
              </div>
              <ChevronRightIcon class="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showActionsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div
      v-if="showCheckoutModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Cho mượn thiết bị
          </h2>
          <button
            @click="showCheckoutModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <div class="text-sm font-medium text-gray-900">
              {{ selectedTool.name }}
            </div>
            <div class="text-sm text-gray-500">{{ selectedTool.id }}</div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Người mượn</label
            >
            <input
              type="text"
              v-model="checkoutForm.borrower"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Dự kiến trả</label
            >
            <input
              type="date"
              v-model="checkoutForm.expectedReturn"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="checkoutForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showCheckoutModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="processCheckout"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>

    <!-- Maintenance Modal -->
    <div
      v-if="showMaintenanceModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Gửi đi bảo trì</h2>
          <button
            @click="showMaintenanceModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <div class="text-sm font-medium text-gray-900">
              {{ selectedTool.name }}
            </div>
            <div class="text-sm text-gray-500">{{ selectedTool.id }}</div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Loại bảo trì</label
            >
            <select
              v-model="maintenanceForm.type"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="routine">Bảo trì định kỳ</option>
              <option value="repair">Sửa chữa</option>
              <option value="inspection">Kiểm tra</option>
              <option value="upgrade">Nâng cấp</option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Dự kiến hoàn thành</label
            >
            <input
              type="date"
              v-model="maintenanceForm.expectedCompletion"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="maintenanceForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showMaintenanceModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="processMaintenance"
            class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm font-medium"
          >
            Xác nhận
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
  LogInIcon,
  LogOutIcon,
  WrenchIcon,
  CheckCircleIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showToolModal = ref(false);
const showConfirmModal = ref(false);
const showActionsModal = ref(false);
const showCheckoutModal = ref(false);
const showMaintenanceModal = ref(false);
const isEditMode = ref(false);
const selectedToolId = ref(null);
const selectedTool = ref({});

// Form and filters
const filters = reactive({
  category: "",
  status: "",
  location: "",
  search: "",
});

const toolForm = reactive({
  id: "",
  name: "",
  category: "golf-club",
  location: "clubhouse",
  status: "available",
  serialNumber: "",
  purchaseDate: "",
  nextMaintenance: "",
  purchasePrice: 0,
  supplier: "",
  image: "",
  description: "",
  maintenanceHistory: [],
  usageInfo: null,
});

const checkoutForm = reactive({
  borrower: "",
  expectedReturn: "",
  notes: "",
});

const maintenanceForm = reactive({
  type: "routine",
  expectedCompletion: "",
  notes: "",
});

// Mock data
const tools = ref([
  {
    id: "TL001",
    name: "Bộ gậy golf Titleist",
    category: "golf-club",
    location: "pro-shop",
    status: "available",
    serialNumber: "TS12345",
    purchaseDate: "2024-01-15",
    nextMaintenance: "2025-01-15",
    purchasePrice: 25000000,
    supplier: "Titleist Vietnam",
    image: "/placeholder.svg?height=40&width=40",
    description: "Bộ gậy golf Titleist AP2 mới, bao gồm đầy đủ các loại gậy.",
    maintenanceHistory: [],
  },
  {
    id: "TL002",
    name: "Xe điện Club Car",
    category: "golf-cart",
    location: "course",
    status: "in-use",
    serialNumber: "CC78901",
    purchaseDate: "2023-05-20",
    nextMaintenance: "2024-05-20",
    purchasePrice: 150000000,
    supplier: "Club Car Vietnam",
    image: "/placeholder.svg?height=40&width=40",
    description: "Xe điện Club Car 2 chỗ ngồi, màu trắng.",
    maintenanceHistory: [
      {
        date: "2023-11-20",
        type: "routine",
        notes: "Kiểm tra và thay dầu định kỳ",
      },
    ],
    usageInfo: {
      borrower: "Nguyễn Văn A",
      borrowTime: "2025-04-22T07:30:00",
      expectedReturn: "2025-04-22T12:00:00",
      notes: "Sử dụng cho khách VIP",
    },
  },
  {
    id: "TL003",
    name: "Máy cắt cỏ Toro",
    category: "maintenance",
    location: "maintenance-shed",
    status: "maintenance",
    serialNumber: "TR45678",
    purchaseDate: "2022-08-10",
    nextMaintenance: "2024-08-10",
    purchasePrice: 80000000,
    supplier: "Toro Vietnam",
    image: "/placeholder.svg?height=40&width=40",
    description: "Máy cắt cỏ Toro Greensmaster 1600, dùng cho green.",
    maintenanceHistory: [
      {
        date: "2023-08-10",
        type: "routine",
        notes: "Bảo dưỡng định kỳ hàng năm",
      },
      {
        date: "2024-04-15",
        type: "repair",
        notes: "Sửa chữa động cơ",
      },
    ],
  },
  {
    id: "TL004",
    name: "Bộ gậy golf Callaway",
    category: "golf-club",
    location: "pro-shop",
    status: "available",
    serialNumber: "CW34567",
    purchaseDate: "2024-02-05",
    nextMaintenance: "2025-02-05",
    purchasePrice: 30000000,
    supplier: "Callaway Vietnam",
    image: "/placeholder.svg?height=40&width=40",
    description: "Bộ gậy golf Callaway Mavrik, bao gồm đầy đủ các loại gậy.",
    maintenanceHistory: [],
  },
  {
    id: "TL005",
    name: "Xe điện EZGO",
    category: "golf-cart",
    location: "course",
    status: "broken",
    serialNumber: "EZ23456",
    purchaseDate: "2022-03-15",
    nextMaintenance: "2024-03-15",
    purchasePrice: 120000000,
    supplier: "EZGO Vietnam",
    image: "/placeholder.svg?height=40&width=40",
    description: "Xe điện EZGO 4 chỗ ngồi, màu xanh lá.",
    maintenanceHistory: [
      {
        date: "2023-03-15",
        type: "routine",
        notes: "Bảo dưỡng định kỳ hàng năm",
      },
      {
        date: "2024-04-10",
        type: "repair",
        notes: "Sửa chữa hệ thống điện",
      },
    ],
  },
]);

// Computed properties
const filteredTools = computed(() => {
  let result = tools.value;

  if (filters.category) {
    result = result.filter((tool) => tool.category === filters.category);
  }

  if (filters.status) {
    result = result.filter((tool) => tool.status === filters.status);
  }

  if (filters.location) {
    result = result.filter((tool) => tool.location === filters.location);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchLower) ||
        tool.id.toLowerCase().includes(searchLower) ||
        tool.serialNumber?.toLowerCase().includes(searchLower)
    );
  }

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(tools.value.length / itemsPerPage.value) || 1;
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
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCategoryText(category) {
  switch (category) {
    case "golf-club":
      return "Gậy golf";
    case "golf-cart":
      return "Xe điện";
    case "maintenance":
      return "Thiết bị bảo trì";
    case "accessories":
      return "Phụ kiện";
    case "other":
      return "Khác";
    default:
      return category;
  }
}

function getLocationText(location) {
  switch (location) {
    case "clubhouse":
      return "Nhà câu lạc bộ";
    case "pro-shop":
      return "Pro Shop";
    case "maintenance-shed":
      return "Kho bảo trì";
    case "course":
      return "Trên sân";
    default:
      return location;
  }
}

function getStatusText(status) {
  switch (status) {
    case "available":
      return "Sẵn sàng";
    case "in-use":
      return "Đang sử dụng";
    case "maintenance":
      return "Đang bảo trì";
    case "broken":
      return "Hỏng";
    default:
      return status;
  }
}

function getToolsCount(status) {
  return tools.value.filter((tool) => tool.status === status).length;
}

function isMaintenanceOverdue(date) {
  if (!date) return false;
  const today = new Date();
  const maintenanceDate = new Date(date);
  return maintenanceDate < today;
}

function isMaintenanceSoon(date) {
  if (!date) return false;
  const today = new Date();
  const maintenanceDate = new Date(date);
  const diffTime = maintenanceDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= 30;
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
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

function resetToolForm() {
  Object.assign(toolForm, {
    id: "",
    name: "",
    category: "golf-club",
    location: "clubhouse",
    status: "available",
    serialNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    nextMaintenance: "",
    purchasePrice: 0,
    supplier: "",
    image: "",
    description: "",
    maintenanceHistory: [],
    usageInfo: null,
  });
}

function viewToolDetails(tool) {
  selectedTool.value = JSON.parse(JSON.stringify(tool));
  showActionsModal.value = true;
}

function editTool(tool) {
  isEditMode.value = true;
  selectedToolId.value = tool.id;
  Object.assign(toolForm, JSON.parse(JSON.stringify(tool)));
  showToolModal.value = true;
}

function saveTool() {
  if (isEditMode.value) {
    // Update existing tool
    const index = tools.value.findIndex((t) => t.id === selectedToolId.value);
    if (index !== -1) {
      tools.value[index] = { ...toolForm };
    }
  } else {
    // Create new tool
    const newTool = {
      ...toolForm,
      id: `TL${String(tools.value.length + 1).padStart(3, "0")}`,
    };
    tools.value.push(newTool);
  }

  closeToolModal();
}

function confirmDeleteTool(tool) {
  selectedToolId.value = tool.id;
  showConfirmModal.value = true;
}

function deleteTool() {
  const index = tools.value.findIndex((t) => t.id === selectedToolId.value);
  if (index !== -1) {
    tools.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}

function openCheckoutModal() {
  checkoutForm.borrower = "";
  checkoutForm.expectedReturn = new Date(
    new Date().setDate(new Date().getDate() + 1)
  )
    .toISOString()
    .split("T")[0];
  checkoutForm.notes = "";
  showActionsModal.value = false;
  showCheckoutModal.value = true;
}

function processCheckout() {
  const index = tools.value.findIndex((t) => t.id === selectedTool.value.id);
  if (index !== -1) {
    tools.value[index].status = "in-use";
    tools.value[index].usageInfo = {
      borrower: checkoutForm.borrower,
      borrowTime: new Date().toISOString(),
      expectedReturn: checkoutForm.expectedReturn,
      notes: checkoutForm.notes,
    };
  }
  showCheckoutModal.value = false;
}

function checkInTool() {
  const index = tools.value.findIndex((t) => t.id === selectedTool.value.id);
  if (index !== -1) {
    tools.value[index].status = "available";
    tools.value[index].usageInfo = null;
  }
  showActionsModal.value = false;
}

function sendToMaintenance() {
  maintenanceForm.type = "routine";
  maintenanceForm.expectedCompletion = new Date(
    new Date().setDate(new Date().getDate() + 7)
  )
    .toISOString()
    .split("T")[0];
  maintenanceForm.notes = "";
  showActionsModal.value = false;
  showMaintenanceModal.value = true;
}

function processMaintenance() {
  const index = tools.value.findIndex((t) => t.id === selectedTool.value.id);
  if (index !== -1) {
    tools.value[index].status = "maintenance";
    if (!tools.value[index].maintenanceHistory) {
      tools.value[index].maintenanceHistory = [];
    }
    tools.value[index].maintenanceHistory.push({
      date: new Date().toISOString().split("T")[0],
      type: maintenanceForm.type,
      notes: maintenanceForm.notes,
    });
    tools.value[index].nextMaintenance = maintenanceForm.expectedCompletion;
  }
  showMaintenanceModal.value = false;
}

function completeMaintenance() {
  const index = tools.value.findIndex((t) => t.id === selectedTool.value.id);
  if (index !== -1) {
    tools.value[index].status = "available";
    // Update next maintenance date to 6 months from now
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 6);
    tools.value[index].nextMaintenance = nextDate.toISOString().split("T")[0];
  }
  showActionsModal.value = false;
}

function markAsBroken() {
  const index = tools.value.findIndex((t) => t.id === selectedTool.value.id);
  if (index !== -1) {
    tools.value[index].status = "broken";
  }
  showActionsModal.value = false;
}

onMounted(() => {
  // Initialize component
  console.log("Tools Management component mounted");
});
</script>
