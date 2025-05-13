<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Quản Lý Sự Kiện</h1>
      <div class="flex gap-2">
        <button
          @click="openNewEventModal"
          class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
        >
          <PlusIcon class="w-4 h-4" /> Thêm sự kiện mới
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
                >Loại sự kiện</label
              >
              <select
                v-model="filters.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="tournament">Giải đấu</option>
                <option value="corporate">Sự kiện doanh nghiệp</option>
                <option value="private">Sự kiện tư nhân</option>
                <option value="charity">Sự kiện từ thiện</option>
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
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Thời gian</label
              >
              <select
                v-model="filters.timeframe"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tất cả thời gian</option>
                <option value="upcoming">Sắp tới</option>
                <option value="past">Đã qua</option>
                <option value="thisMonth">Tháng này</option>
                <option value="nextMonth">Tháng sau</option>
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
                  placeholder="Tên, mã sự kiện..."
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
            Thống kê sự kiện
          </h2>
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-green-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Sắp diễn ra</div>
              <div class="text-xl font-semibold text-green-700">
                {{ getEventsCount("upcoming") }}
              </div>
            </div>
            <div class="bg-blue-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đang diễn ra</div>
              <div class="text-xl font-semibold text-blue-700">
                {{ getEventsCount("ongoing") }}
              </div>
            </div>
            <div class="bg-gray-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đã hoàn thành</div>
              <div class="text-xl font-semibold text-gray-700">
                {{ getEventsCount("completed") }}
              </div>
            </div>
            <div class="bg-red-50 p-3 rounded-md">
              <div class="text-xs text-gray-500">Đã hủy</div>
              <div class="text-xl font-semibold text-red-700">
                {{ getEventsCount("cancelled") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Events List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách sự kiện</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mã sự kiện
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tên sự kiện
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Loại
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày bắt đầu
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ngày kết thúc
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Số người
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
              v-for="event in filteredEvents"
              :key="event.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ event.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3">
                    <img
                      :src="
                        event.image || '/placeholder.svg?height=40&width=40'
                      "
                      class="h-10 w-10 rounded-full object-cover"
                      alt="Event thumbnail"
                    />
                  </div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ event.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getEventTypeText(event.type) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(event.startDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(event.endDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ event.participants }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': event.status === 'upcoming',
                    'bg-blue-100 text-blue-800': event.status === 'ongoing',
                    'bg-gray-100 text-gray-800': event.status === 'completed',
                    'bg-red-100 text-red-800': event.status === 'cancelled',
                  }"
                >
                  {{ getStatusText(event.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewEventDetails(event)"
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="editEvent(event)"
                    class="text-blue-500 hover:text-blue-700"
                  >
                    <EditIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="confirmDeleteEvent(event)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEvents.length === 0">
              <td
                colspan="8"
                class="px-6 py-4 text-center text-sm text-gray-500"
              >
                Không có dữ liệu sự kiện
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
              <span class="font-medium">{{ filteredEvents.length }}</span> trong
              số <span class="font-medium">{{ events.length }}</span> kết quả
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

    <!-- Event Modal -->
    <div
      v-if="showEventModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            {{ isEditMode ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới" }}
          </h2>
          <button
            @click="closeEventModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Tên sự kiện</label
            >
            <input
              type="text"
              v-model="eventForm.name"
              required
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại sự kiện</label
              >
              <select
                v-model="eventForm.type"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="tournament">Giải đấu</option>
                <option value="corporate">Sự kiện doanh nghiệp</option>
                <option value="private">Sự kiện tư nhân</option>
                <option value="charity">Sự kiện từ thiện</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="eventForm.status"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="completed">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ngày bắt đầu</label
              >
              <input
                type="date"
                v-model="eventForm.startDate"
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
                v-model="eventForm.endDate"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giờ bắt đầu</label
              >
              <input
                type="time"
                v-model="eventForm.startTime"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Giờ kết thúc</label
              >
              <input
                type="time"
                v-model="eventForm.endTime"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Số người tham gia</label
              >
              <input
                type="number"
                v-model="eventForm.participants"
                required
                min="1"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Sân</label
              >
              <select
                v-model="eventForm.courseId"
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option
                  v-for="course in courses"
                  :key="course.id"
                  :value="course.id"
                >
                  {{ course.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Người tổ chức</label
            >
            <input
              type="text"
              v-model="eventForm.organizer"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Liên hệ</label
            >
            <input
              type="text"
              v-model="eventForm.contact"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Hình ảnh URL</label
            >
            <input
              type="text"
              v-model="eventForm.image"
              placeholder="https://example.com/image.jpg"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Mô tả</label
            >
            <textarea
              v-model="eventForm.description"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="eventForm.notes"
              rows="2"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
          <div class="mb-4">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="isPrivate"
                v-model="eventForm.isPrivate"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label for="isPrivate" class="ml-2 block text-sm text-gray-900"
                >Sự kiện riêng tư</label
              >
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="closeEventModal"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="saveEvent"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            {{ isEditMode ? "Cập nhật" : "Thêm mới" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Chi tiết sự kiện</h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="flex items-center mb-4">
            <div class="h-16 w-16 flex-shrink-0 mr-4">
              <img
                :src="
                  selectedEvent.image || '/placeholder.svg?height=64&width=64'
                "
                class="h-16 w-16 rounded-full object-cover"
                alt="Event thumbnail"
              />
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                {{ selectedEvent.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ getEventTypeText(selectedEvent.type) }}
              </p>
            </div>
            <span
              :class="{
                'ml-auto px-2 py-1 text-xs font-medium rounded-full': true,
                'bg-green-100 text-green-800':
                  selectedEvent.status === 'upcoming',
                'bg-blue-100 text-blue-800': selectedEvent.status === 'ongoing',
                'bg-gray-100 text-gray-800':
                  selectedEvent.status === 'completed',
                'bg-red-100 text-red-800': selectedEvent.status === 'cancelled',
              }"
            >
              {{ getStatusText(selectedEvent.status) }}
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Mã sự kiện</h4>
              <p class="text-gray-900">{{ selectedEvent.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Sân</h4>
              <p class="text-gray-900">
                {{ getCourseNameById(selectedEvent.courseId) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày bắt đầu
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedEvent.startDate) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Ngày kết thúc
              </h4>
              <p class="text-gray-900">
                {{ formatDate(selectedEvent.endDate) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Giờ bắt đầu
              </h4>
              <p class="text-gray-900">{{ selectedEvent.startTime }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Giờ kết thúc
              </h4>
              <p class="text-gray-900">{{ selectedEvent.endTime }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Số người tham gia
              </h4>
              <p class="text-gray-900">{{ selectedEvent.participants }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">
                Người tổ chức
              </h4>
              <p class="text-gray-900">
                {{ selectedEvent.organizer || "Không có" }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Liên hệ</h4>
            <p class="text-gray-900">
              {{ selectedEvent.contact || "Không có" }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Mô tả</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedEvent.description || "Không có mô tả" }}
            </p>
          </div>

          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Ghi chú</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedEvent.notes || "Không có ghi chú" }}
            </p>
          </div>

          <div class="mb-4">
            <div class="flex items-center">
              <LockIcon class="h-4 w-4 text-gray-500 mr-2" />
              <span class="text-sm text-gray-700">{{
                selectedEvent.isPrivate
                  ? "Sự kiện riêng tư"
                  : "Sự kiện công khai"
              }}</span>
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
            Bạn có chắc chắn muốn xóa sự kiện này không?
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
            @click="deleteEvent"
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
  LockIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showEventModal = ref(false);
const showDetailsModal = ref(false);
const showConfirmModal = ref(false);
const isEditMode = ref(false);
const selectedEventId = ref(null);
const selectedEvent = ref({});

// Form and filters
const filters = reactive({
  type: "",
  status: "",
  timeframe: "all",
  search: "",
});

const eventForm = reactive({
  id: "",
  name: "",
  type: "tournament",
  status: "upcoming",
  startDate: "",
  endDate: "",
  startTime: "08:00",
  endTime: "17:00",
  participants: 0,
  courseId: "",
  organizer: "",
  contact: "",
  image: "",
  description: "",
  notes: "",
  isPrivate: false,
});

// Mock data
const courses = ref([
  { id: "1", name: "Sân A - 18 hố" },
  { id: "2", name: "Sân B - 9 hố" },
  { id: "3", name: "Sân C - 18 hố" },
]);

const events = ref([
  {
    id: "EV001",
    name: "Giải Golf Mùa Xuân",
    type: "tournament",
    status: "upcoming",
    startDate: "2025-05-15",
    endDate: "2025-05-16",
    startTime: "07:00",
    endTime: "17:00",
    participants: 64,
    courseId: "1",
    organizer: "Hiệp hội Golf Việt Nam",
    contact: "contact@vga.com",
    image: "/placeholder.svg?height=40&width=40",
    description:
      "Giải đấu golf thường niên mùa xuân với sự tham gia của các golfer chuyên nghiệp.",
    notes: "Cần chuẩn bị khu vực lễ trao giải",
    isPrivate: false,
  },
  {
    id: "EV002",
    name: "Sự kiện doanh nghiệp ABC",
    type: "corporate",
    status: "upcoming",
    startDate: "2025-05-20",
    endDate: "2025-05-20",
    startTime: "08:00",
    endTime: "16:00",
    participants: 32,
    courseId: "2",
    organizer: "Công ty ABC",
    contact: "event@abc.com",
    image: "/placeholder.svg?height=40&width=40",
    description: "Sự kiện giao lưu golf của công ty ABC.",
    notes: "Yêu cầu dịch vụ ăn uống đầy đủ",
    isPrivate: true,
  },
  {
    id: "EV003",
    name: "Giải đấu từ thiện",
    type: "charity",
    status: "ongoing",
    startDate: "2025-04-22",
    endDate: "2025-04-23",
    startTime: "07:30",
    endTime: "17:30",
    participants: 48,
    courseId: "1",
    organizer: "Quỹ từ thiện XYZ",
    contact: "charity@xyz.org",
    image: "/placeholder.svg?height=40&width=40",
    description: "Giải đấu gây quỹ từ thiện cho trẻ em vùng cao.",
    notes: "Cần bố trí khu vực quyên góp",
    isPrivate: false,
  },
  {
    id: "EV004",
    name: "Tiệc cưới & Golf",
    type: "private",
    status: "completed",
    startDate: "2025-04-10",
    endDate: "2025-04-10",
    startTime: "09:00",
    endTime: "20:00",
    participants: 24,
    courseId: "3",
    organizer: "Gia đình Nguyễn Văn A",
    contact: "nguyenvana@email.com",
    image: "/placeholder.svg?height=40&width=40",
    description: "Sự kiện kết hợp giữa tiệc cưới và chơi golf.",
    notes: "Đã thanh toán đầy đủ",
    isPrivate: true,
  },
  {
    id: "EV005",
    name: "Giải Golf Quốc tế",
    type: "tournament",
    status: "cancelled",
    startDate: "2025-06-05",
    endDate: "2025-06-07",
    startTime: "06:30",
    endTime: "18:00",
    participants: 96,
    courseId: "1",
    organizer: "Liên đoàn Golf Quốc tế",
    contact: "international@golf.org",
    image: "/placeholder.svg?height=40&width=40",
    description:
      "Giải đấu golf quốc tế với sự tham gia của các golfer từ nhiều quốc gia.",
    notes: "Hủy do tình hình dịch bệnh",
    isPrivate: false,
  },
]);

// Computed properties
const filteredEvents = computed(() => {
  let result = events.value;

  if (filters.type) {
    result = result.filter((event) => event.type === filters.type);
  }

  if (filters.status) {
    result = result.filter((event) => event.status === filters.status);
  }

  if (filters.timeframe) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.timeframe) {
      case "upcoming":
        result = result.filter((event) => new Date(event.startDate) >= today);
        break;
      case "past":
        result = result.filter((event) => new Date(event.endDate) < today);
        break;
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
          (event) =>
            new Date(event.startDate) >= thisMonthStart &&
            new Date(event.startDate) <= thisMonthEnd
        );
        break;
      case "nextMonth":
        const nextMonthStart = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );
        const nextMonthEnd = new Date(
          today.getFullYear(),
          today.getMonth() + 2,
          0
        );
        result = result.filter(
          (event) =>
            new Date(event.startDate) >= nextMonthStart &&
            new Date(event.startDate) <= nextMonthEnd
        );
        break;
    }
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.id.toLowerCase().includes(searchLower) ||
        event.organizer?.toLowerCase().includes(searchLower)
    );
  }

  // Sort by start date
  result = result.sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(events.value.length / itemsPerPage.value) || 1;
});

// Methods
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getEventTypeText(type) {
  switch (type) {
    case "tournament":
      return "Giải đấu";
    case "corporate":
      return "Sự kiện doanh nghiệp";
    case "private":
      return "Sự kiện tư nhân";
    case "charity":
      return "Sự kiện từ thiện";
    case "other":
      return "Khác";
    default:
      return type;
  }
}

function getStatusText(status) {
  switch (status) {
    case "upcoming":
      return "Sắp diễn ra";
    case "ongoing":
      return "Đang diễn ra";
    case "completed":
      return "Đã hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

function getCourseNameById(id) {
  const course = courses.value.find((c) => c.id === id);
  return course ? course.name : "Không xác định";
}

function getEventsCount(status) {
  return events.value.filter((event) => event.status === status).length;
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
}

function openNewEventModal() {
  isEditMode.value = false;
  resetEventForm();
  showEventModal.value = true;
}

function closeEventModal() {
  showEventModal.value = false;
  resetEventForm();
}

function resetEventForm() {
  const today = new Date().toISOString().split("T")[0];
  Object.assign(eventForm, {
    id: "",
    name: "",
    type: "tournament",
    status: "upcoming",
    startDate: today,
    endDate: today,
    startTime: "08:00",
    endTime: "17:00",
    participants: 0,
    courseId: courses.value.length > 0 ? courses.value[0].id : "",
    organizer: "",
    contact: "",
    image: "",
    description: "",
    notes: "",
    isPrivate: false,
  });
}

function viewEventDetails(event) {
  selectedEvent.value = JSON.parse(JSON.stringify(event));
  showDetailsModal.value = true;
}

function editEvent(event) {
  isEditMode.value = true;
  selectedEventId.value = event.id;
  Object.assign(eventForm, JSON.parse(JSON.stringify(event)));
  showEventModal.value = true;
}

function editFromDetails() {
  isEditMode.value = true;
  selectedEventId.value = selectedEvent.value.id;
  Object.assign(eventForm, JSON.parse(JSON.stringify(selectedEvent.value)));
  showDetailsModal.value = false;
  showEventModal.value = true;
}

function saveEvent() {
  if (isEditMode.value) {
    // Update existing event
    const index = events.value.findIndex((e) => e.id === selectedEventId.value);
    if (index !== -1) {
      events.value[index] = { ...eventForm };
    }
  } else {
    // Create new event
    const newEvent = {
      ...eventForm,
      id: `EV${String(events.value.length + 1).padStart(3, "0")}`,
    };
    events.value.push(newEvent);
  }

  closeEventModal();
}

function confirmDeleteEvent(event) {
  selectedEventId.value = event.id;
  showConfirmModal.value = true;
}

function deleteEvent() {
  const index = events.value.findIndex((e) => e.id === selectedEventId.value);
  if (index !== -1) {
    events.value.splice(index, 1);
  }
  showConfirmModal.value = false;
}

onMounted(() => {
  // Initialize component
  console.log("Event Management component mounted");
});
</script>
