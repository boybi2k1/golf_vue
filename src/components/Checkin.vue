<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Check-In Sân Golf</h1>
      <div class="flex gap-2">
        <button
          @click="refreshData"
          class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
        >
          <RefreshCwIcon class="w-4 h-4" /> Làm mới
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-4 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Sân Golf</label
          >
          <select
            v-model="filters.courseId"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Tất cả sân</option>
            <option
              v-for="course in courses"
              :key="course.id"
              :value="course.id"
            >
              {{ course.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Ngày</label
          >
          <input
            type="date"
            v-model="filters.date"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Trạng thái</label
          >
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ check-in</option>
            <option value="checked-in">Đã check-in</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="no-show">Không đến</option>
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
              placeholder="Tên, SĐT, Mã đặt lịch..."
              class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Upcoming Bookings -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">
              Lịch đặt sân hôm nay
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Giờ
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mã đặt lịch
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Khách hàng
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sân
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
                  v-for="booking in filteredBookings"
                  :key="booking.id"
                  class="hover:bg-gray-50"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                  >
                    {{ booking.time }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ booking.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ booking.customerName }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ booking.phone }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getCourseNameById(booking.courseId) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ booking.players }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="{
                        'px-2 py-1 text-xs font-medium rounded-full': true,
                        'bg-yellow-100 text-yellow-800':
                          booking.checkInStatus === 'pending',
                        'bg-green-100 text-green-800':
                          booking.checkInStatus === 'checked-in',
                        'bg-blue-100 text-blue-800':
                          booking.checkInStatus === 'completed',
                        'bg-red-100 text-red-800':
                          booking.checkInStatus === 'no-show',
                      }"
                    >
                      {{ getStatusText(booking.checkInStatus) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        v-if="booking.checkInStatus === 'pending'"
                        @click="checkIn(booking)"
                        class="text-green-600 hover:text-green-900"
                      >
                        <LogInIcon class="w-5 h-5" />
                      </button>
                      <button
                        v-if="booking.checkInStatus === 'checked-in'"
                        @click="completeRound(booking)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        <CheckCircleIcon class="w-5 h-5" />
                      </button>
                      <button
                        v-if="booking.checkInStatus === 'pending'"
                        @click="markNoShow(booking)"
                        class="text-red-600 hover:text-red-900"
                      >
                        <XCircleIcon class="w-5 h-5" />
                      </button>
                      <button
                        @click="viewBookingDetails(booking)"
                        class="text-gray-600 hover:text-gray-900"
                      >
                        <EyeIcon class="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredBookings.length === 0">
                  <td
                    colspan="7"
                    class="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Không có lịch đặt sân nào
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
                  <span class="font-medium">{{ filteredBookings.length }}</span>
                  trong số
                  <span class="font-medium">{{ bookings.length }}</span> kết quả
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
      </div>

      <!-- Check-in Form -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Check-in nhanh</h2>
          </div>
          <div class="p-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Mã đặt lịch</label
              >
              <div class="flex">
                <input
                  type="text"
                  v-model="quickCheckIn.bookingId"
                  placeholder="Nhập mã đặt lịch"
                  class="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <button
                  @click="findBooking"
                  class="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-r-md"
                >
                  <SearchIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              v-if="quickCheckIn.booking"
              class="border border-gray-200 rounded-md p-4 mb-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h3 class="font-medium text-gray-900">
                    {{ quickCheckIn.booking.customerName }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ quickCheckIn.booking.phone }}
                  </p>
                </div>
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-yellow-100 text-yellow-800':
                      quickCheckIn.booking.checkInStatus === 'pending',
                    'bg-green-100 text-green-800':
                      quickCheckIn.booking.checkInStatus === 'checked-in',
                    'bg-blue-100 text-blue-800':
                      quickCheckIn.booking.checkInStatus === 'completed',
                    'bg-red-100 text-red-800':
                      quickCheckIn.booking.checkInStatus === 'no-show',
                  }"
                >
                  {{ getStatusText(quickCheckIn.booking.checkInStatus) }}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span class="text-gray-500">Sân:</span>
                  <span class="ml-1 text-gray-900">{{
                    getCourseNameById(quickCheckIn.booking.courseId)
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Giờ:</span>
                  <span class="ml-1 text-gray-900">{{
                    quickCheckIn.booking.time
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Ngày:</span>
                  <span class="ml-1 text-gray-900">{{
                    formatDate(quickCheckIn.booking.date)
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-500">Số người:</span>
                  <span class="ml-1 text-gray-900">{{
                    quickCheckIn.booking.players
                  }}</span>
                </div>
              </div>

              <div v-if="quickCheckIn.booking.checkInStatus === 'pending'">
                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Caddy</label
                  >
                  <select
                    v-model="quickCheckIn.caddyId"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn caddy</option>
                    <option
                      v-for="caddy in availableCaddies"
                      :key="caddy.id"
                      :value="caddy.id"
                    >
                      {{ caddy.name }} - {{ caddy.id }}
                    </option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Xe điện</label
                  >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id="needsCart"
                      v-model="quickCheckIn.needsCart"
                      class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label
                      for="needsCart"
                      class="ml-2 block text-sm text-gray-900"
                      >Cần xe điện</label
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ghi chú</label
                  >
                  <textarea
                    v-model="quickCheckIn.notes"
                    rows="2"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>

                <button
                  @click="processQuickCheckIn"
                  class="w-full bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
                >
                  Check-in
                </button>
              </div>

              <div
                v-else-if="quickCheckIn.booking.checkInStatus === 'checked-in'"
                class="flex justify-between"
              >
                <button
                  @click="processQuickComplete"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mr-2"
                >
                  Hoàn thành
                </button>
                <button
                  @click="viewBookingDetails(quickCheckIn.booking)"
                  class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Chi tiết
                </button>
              </div>

              <div v-else class="text-center py-2">
                <p class="text-gray-500">Không thể check-in cho lịch đặt này</p>
              </div>
            </div>

            <div
              v-if="!quickCheckIn.booking"
              class="border border-gray-200 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center"
            >
              <ClipboardCheckIcon class="h-12 w-12 text-gray-400 mb-2" />
              <h3 class="text-sm font-medium text-gray-900">
                Nhập mã đặt lịch để check-in
              </h3>
              <p class="text-xs text-gray-500 mt-1">
                Hoặc tìm kiếm lịch đặt trong danh sách bên trái
              </p>
            </div>

            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-900 mb-2">
                Thống kê hôm nay
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <div class="bg-green-50 p-3 rounded-md">
                  <div class="text-xs text-gray-500">Đã check-in</div>
                  <div class="text-xl font-semibold text-green-700">
                    {{ getCheckInCount("checked-in") }}
                  </div>
                </div>
                <div class="bg-yellow-50 p-3 rounded-md">
                  <div class="text-xs text-gray-500">Chờ check-in</div>
                  <div class="text-xl font-semibold text-yellow-700">
                    {{ getCheckInCount("pending") }}
                  </div>
                </div>
                <div class="bg-blue-50 p-3 rounded-md">
                  <div class="text-xs text-gray-500">Đã hoàn thành</div>
                  <div class="text-xl font-semibold text-blue-700">
                    {{ getCheckInCount("completed") }}
                  </div>
                </div>
                <div class="bg-red-50 p-3 rounded-md">
                  <div class="text-xs text-gray-500">Không đến</div>
                  <div class="text-xl font-semibold text-red-700">
                    {{ getCheckInCount("no-show") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 flex items-center justify-center z-50"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Chi tiết đặt lịch
          </h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">
                Mã đặt lịch
              </h3>
              <p class="text-gray-900">{{ selectedBooking.id }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Trạng thái</h3>
              <span
                :class="{
                  'px-2 py-1 text-xs font-medium rounded-full': true,
                  'bg-yellow-100 text-yellow-800':
                    selectedBooking.checkInStatus === 'pending',
                  'bg-green-100 text-green-800':
                    selectedBooking.checkInStatus === 'checked-in',
                  'bg-blue-100 text-blue-800':
                    selectedBooking.checkInStatus === 'completed',
                  'bg-red-100 text-red-800':
                    selectedBooking.checkInStatus === 'no-show',
                }"
              >
                {{ getStatusText(selectedBooking.checkInStatus) }}
              </span>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Khách hàng</h3>
              <p class="text-gray-900">{{ selectedBooking.customerName }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </h3>
              <p class="text-gray-900">{{ selectedBooking.phone }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p class="text-gray-900">
                {{ selectedBooking.email || "Không có" }}
              </p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">
                Số người chơi
              </h3>
              <p class="text-gray-900">{{ selectedBooking.players }}</p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Sân</h3>
              <p class="text-gray-900">
                {{ getCourseNameById(selectedBooking.courseId) }}
              </p>
            </div>
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-1">Ngày & Giờ</h3>
              <p class="text-gray-900">
                {{ formatDate(selectedBooking.date) }}
                {{ selectedBooking.time }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-500 mb-1">
              Ghi chú đặt lịch
            </h3>
            <p class="text-gray-900 bg-gray-50 p-2 rounded">
              {{ selectedBooking.notes || "Không có ghi chú" }}
            </p>
          </div>

          <div v-if="selectedBooking.checkInInfo" class="border-t pt-4 mt-4">
            <h3 class="text-md font-medium text-gray-900 mb-2">
              Thông tin check-in
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">
                  Thời gian check-in
                </h3>
                <p class="text-gray-900">
                  {{ formatDateTime(selectedBooking.checkInInfo.checkInTime) }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">
                  Nhân viên check-in
                </h3>
                <p class="text-gray-900">
                  {{ selectedBooking.checkInInfo.staffName }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Caddy</h3>
                <p class="text-gray-900">
                  {{
                    getCaddyNameById(selectedBooking.checkInInfo.caddyId) ||
                    "Không có"
                  }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">Xe điện</h3>
                <p class="text-gray-900">
                  {{ selectedBooking.checkInInfo.needsCart ? "Có" : "Không" }}
                </p>
              </div>
            </div>

            <div class="mb-4">
              <h3 class="text-sm font-medium text-gray-500 mb-1">
                Ghi chú check-in
              </h3>
              <p class="text-gray-900 bg-gray-50 p-2 rounded">
                {{ selectedBooking.checkInInfo.notes || "Không có ghi chú" }}
              </p>
            </div>
          </div>

          <div
            v-if="
              selectedBooking.checkInStatus === 'completed' &&
              selectedBooking.completionInfo
            "
            class="border-t pt-4 mt-4"
          >
            <h3 class="text-md font-medium text-gray-900 mb-2">
              Thông tin hoàn thành
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">
                  Thời gian hoàn thành
                </h3>
                <p class="text-gray-900">
                  {{
                    formatDateTime(
                      selectedBooking.completionInfo.completionTime
                    )
                  }}
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500 mb-1">
                  Thời gian chơi
                </h3>
                <p class="text-gray-900">
                  {{ selectedBooking.completionInfo.playTime }} phút
                </p>
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
            v-if="selectedBooking.checkInStatus === 'pending'"
            @click="checkInFromDetails"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            Check-in
          </button>
          <button
            v-if="selectedBooking.checkInStatus === 'checked-in'"
            @click="completeFromDetails"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            Hoàn thành
          </button>
        </div>
      </div>
    </div>

    <!-- Check-in Modal -->
    <div
      v-if="showCheckInModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">Check-in</h2>
          <button
            @click="showCheckInModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="mb-4">
            <div class="text-sm font-medium text-gray-900">
              {{ selectedBooking.customerName }}
            </div>
            <div class="text-sm text-gray-500">
              {{ getCourseNameById(selectedBooking.courseId) }} -
              {{ selectedBooking.time }}
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Caddy</label
            >
            <select
              v-model="checkInForm.caddyId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chọn caddy</option>
              <option
                v-for="caddy in availableCaddies"
                :key="caddy.id"
                :value="caddy.id"
              >
                {{ caddy.name }} - {{ caddy.id }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Xe điện</label
            >
            <div class="flex items-center">
              <input
                type="checkbox"
                id="checkInNeedsCart"
                v-model="checkInForm.needsCart"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label
                for="checkInNeedsCart"
                class="ml-2 block text-sm text-gray-900"
                >Cần xe điện</label
              >
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Ghi chú</label
            >
            <textarea
              v-model="checkInForm.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showCheckInModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            @click="processCheckIn"
            class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
          >
            Check-in
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  RefreshCwIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  XIcon,
  LogInIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardCheckIcon,
  AlertTriangleIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDetailsModal = ref(false);
const showCheckInModal = ref(false);
const selectedBooking = ref({});

// Form and filters
const filters = reactive({
  courseId: "",
  date: new Date().toISOString().split("T")[0],
  status: "",
  search: "",
});

const checkInForm = reactive({
  caddyId: "",
  needsCart: false,
  notes: "",
});

const quickCheckIn = reactive({
  bookingId: "",
  booking: null,
  caddyId: "",
  needsCart: false,
  notes: "",
});

// Mock data
const courses = ref([
  { id: "1", name: "Sân A - 18 hố" },
  { id: "2", name: "Sân B - 9 hố" },
  { id: "3", name: "Sân C - 18 hố" },
]);

const availableCaddies = ref([
  { id: "CD001", name: "Nguyễn Văn A", status: "available" },
  { id: "CD002", name: "Trần Thị B", status: "available" },
  { id: "CD003", name: "Lê Văn C", status: "available" },
  { id: "CD004", name: "Phạm Thị D", status: "available" },
  { id: "CD005", name: "Hoàng Văn E", status: "busy" },
]);

const bookings = ref([
  {
    id: "BK001",
    courseId: "1",
    date: "2025-04-23",
    time: "07:00",
    customerName: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@example.com",
    players: 4,
    status: "confirmed",
    checkInStatus: "checked-in",
    notes: "Khách VIP, chuẩn bị xe điện",
    checkInInfo: {
      checkInTime: "2025-04-23T06:45:00",
      staffName: "Admin",
      caddyId: "CD001",
      needsCart: true,
      notes: "Khách đến sớm 15 phút",
    },
  },
  {
    id: "BK002",
    courseId: "1",
    date: "2025-04-23",
    time: "08:30",
    customerName: "Trần Thị B",
    phone: "0909876543",
    email: "tranthib@example.com",
    players: 2,
    status: "confirmed",
    checkInStatus: "pending",
    notes: "",
  },
  {
    id: "BK003",
    courseId: "2",
    date: "2025-04-23",
    time: "09:00",
    customerName: "Lê Văn C",
    phone: "0912345678",
    email: "levanc@example.com",
    players: 3,
    status: "confirmed",
    checkInStatus: "completed",
    notes: "Đã thanh toán trước",
    checkInInfo: {
      checkInTime: "2025-04-23T08:50:00",
      staffName: "Admin",
      caddyId: "CD002",
      needsCart: true,
      notes: "",
    },
    completionInfo: {
      completionTime: "2025-04-23T12:30:00",
      playTime: 220,
    },
  },
  {
    id: "BK004",
    courseId: "3",
    date: "2025-04-23",
    time: "14:00",
    customerName: "Phạm Thị D",
    phone: "0987654321",
    email: "phamthid@example.com",
    players: 4,
    status: "confirmed",
    checkInStatus: "no-show",
    notes: "Hủy do thời tiết xấu",
  },
  {
    id: "BK005",
    courseId: "2",
    date: "2025-04-23",
    time: "15:30",
    customerName: "Hoàng Văn E",
    phone: "0978123456",
    email: "hoangvane@example.com",
    players: 2,
    status: "confirmed",
    checkInStatus: "pending",
    notes: "Khách mới",
  },
]);

// Computed properties
const filteredBookings = computed(() => {
  let result = bookings.value;

  if (filters.courseId) {
    result = result.filter((booking) => booking.courseId === filters.courseId);
  }

  if (filters.date) {
    result = result.filter((booking) => booking.date === filters.date);
  }

  if (filters.status) {
    result = result.filter(
      (booking) => booking.checkInStatus === filters.status
    );
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (booking) =>
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.phone.includes(filters.search) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.email.toLowerCase().includes(searchLower)
    );
  }

  // Sort by time
  result = result.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(bookings.value.length / itemsPerPage.value) || 1;
});

// Methods
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCourseNameById(id) {
  const course = courses.value.find((c) => c.id === id);
  return course ? course.name : "";
}

function getCaddyNameById(id) {
  if (!id) return "";
  const caddy = availableCaddies.value.find((c) => c.id === id);
  return caddy ? caddy.name : "";
}

function getStatusText(status) {
  switch (status) {
    case "pending":
      return "Chờ check-in";
    case "checked-in":
      return "Đã check-in";
    case "completed":
      return "Đã hoàn thành";
    case "no-show":
      return "Không đến";
    default:
      return status;
  }
}

function getCheckInCount(status) {
  return bookings.value.filter(
    (b) => b.checkInStatus === status && b.date === filters.date
  ).length;
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
}

function viewBookingDetails(booking) {
  selectedBooking.value = JSON.parse(JSON.stringify(booking));
  showDetailsModal.value = true;
}

function checkIn(booking) {
  selectedBooking.value = JSON.parse(JSON.stringify(booking));
  checkInForm.caddyId = "";
  checkInForm.needsCart = false;
  checkInForm.notes = "";
  showCheckInModal.value = true;
}

function processCheckIn() {
  const index = bookings.value.findIndex(
    (b) => b.id === selectedBooking.value.id
  );
  if (index !== -1) {
    bookings.value[index].checkInStatus = "checked-in";
    bookings.value[index].checkInInfo = {
      checkInTime: new Date().toISOString(),
      staffName: "Admin",
      caddyId: checkInForm.caddyId,
      needsCart: checkInForm.needsCart,
      notes: checkInForm.notes,
    };
  }
  showCheckInModal.value = false;
}

function completeRound(booking) {
  const index = bookings.value.findIndex((b) => b.id === booking.id);
  if (index !== -1) {
    bookings.value[index].checkInStatus = "completed";
    bookings.value[index].completionInfo = {
      completionTime: new Date().toISOString(),
      playTime: Math.floor(Math.random() * 100) + 180, // Random play time between 180-280 minutes
    };
  }
}

function markNoShow(booking) {
  const index = bookings.value.findIndex((b) => b.id === booking.id);
  if (index !== -1) {
    bookings.value[index].checkInStatus = "no-show";
  }
}

function findBooking() {
  if (!quickCheckIn.bookingId) return;

  const booking = bookings.value.find(
    (b) =>
      b.id.toLowerCase() === quickCheckIn.bookingId.toLowerCase() &&
      b.date === filters.date
  );

  if (booking) {
    quickCheckIn.booking = JSON.parse(JSON.stringify(booking));
    quickCheckIn.caddyId = "";
    quickCheckIn.needsCart = false;
    quickCheckIn.notes = "";
  } else {
    quickCheckIn.booking = null;
    alert("Không tìm thấy lịch đặt sân với mã này cho ngày hôm nay!");
  }
}

function processQuickCheckIn() {
  if (!quickCheckIn.booking) return;

  const index = bookings.value.findIndex(
    (b) => b.id === quickCheckIn.booking.id
  );
  if (index !== -1) {
    bookings.value[index].checkInStatus = "checked-in";
    bookings.value[index].checkInInfo = {
      checkInTime: new Date().toISOString(),
      staffName: "Admin",
      caddyId: quickCheckIn.caddyId,
      needsCart: quickCheckIn.needsCart,
      notes: quickCheckIn.notes,
    };

    // Update the quick check-in form
    quickCheckIn.booking = JSON.parse(JSON.stringify(bookings.value[index]));
  }
}

function processQuickComplete() {
  if (!quickCheckIn.booking) return;

  const index = bookings.value.findIndex(
    (b) => b.id === quickCheckIn.booking.id
  );
  if (index !== -1) {
    bookings.value[index].checkInStatus = "completed";
    bookings.value[index].completionInfo = {
      completionTime: new Date().toISOString(),
      playTime: Math.floor(Math.random() * 100) + 180, // Random play time between 180-280 minutes
    };

    // Update the quick check-in form
    quickCheckIn.booking = JSON.parse(JSON.stringify(bookings.value[index]));
  }
}

function checkInFromDetails() {
  checkInForm.caddyId = "";
  checkInForm.needsCart = false;
  checkInForm.notes = "";
  showDetailsModal.value = false;
  showCheckInModal.value = true;
}

function completeFromDetails() {
  const index = bookings.value.findIndex(
    (b) => b.id === selectedBooking.value.id
  );
  if (index !== -1) {
    bookings.value[index].checkInStatus = "completed";
    bookings.value[index].completionInfo = {
      completionTime: new Date().toISOString(),
      playTime: Math.floor(Math.random() * 100) + 180, // Random play time between 180-280 minutes
    };
  }
  showDetailsModal.value = false;
}

onMounted(() => {
  // Initialize with current date
  filters.date = new Date().toISOString().split("T")[0];
});
</script>
