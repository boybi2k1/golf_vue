<template>
    <div class="bg-green-50 min-h-screen p-4">
      <div class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-green-800">Đặt Lịch Sân Golf</h1>
        <div class="flex gap-2">
          <button 
            @click="openNewBookingModal" 
            class="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md"
          >
            <PlusIcon class="w-4 h-4" /> Đặt lịch mới
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
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sân Golf</label>
            <select 
              v-model="filters.courseId"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả sân</option>
              <option v-for="course in courses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
            <input 
              type="date" 
              v-model="filters.date"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select 
              v-model="filters.status"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div class="relative">
              <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                v-model="filters.search" 
                placeholder="Tên, SĐT, Email..." 
                class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>
  
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đặt lịch</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sân</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số người</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="booking in filteredBookings" :key="booking.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ booking.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ booking.customerName }}</div>
                    <div class="text-sm text-gray-500">{{ booking.phone }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getCourseNameById(booking.courseId) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(booking.date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ booking.time }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ booking.players }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-yellow-100 text-yellow-800': booking.status === 'pending',
                      'bg-green-100 text-green-800': booking.status === 'confirmed',
                      'bg-blue-100 text-blue-800': booking.status === 'completed',
                      'bg-red-100 text-red-800': booking.status === 'cancelled'
                    }"
                  >
                    {{ getStatusText(booking.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewBookingDetails(booking)" class="text-gray-500 hover:text-gray-700">
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button @click="editBooking(booking)" class="text-blue-500 hover:text-blue-700">
                      <EditIcon class="w-5 h-5" />
                    </button>
                    <button @click="confirmDeleteBooking(booking)" class="text-red-500 hover:text-red-700">
                      <Trash2Icon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredBookings.length === 0">
                <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu đặt lịch
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Hiển thị <span class="font-medium">{{ filteredBookings.length }}</span> trong số <span class="font-medium">{{ bookings.length }}</span> kết quả
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px " aria-label="Pagination">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
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
  
      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="fixed inset-0 flex items-center justify-center z-50":style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-green-800">{{ isEditMode ? 'Chỉnh sửa đặt lịch' : 'Đặt lịch mới' }}</h2>
            <button @click="closeBookingModal" class="text-gray-500 hover:text-gray-700">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Sân Golf</label>
              <select 
                v-model="bookingForm.courseId" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option v-for="course in courses" :key="course.id" :value="course.id">
                  {{ course.name }}
                </option>
              </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                <input 
                  type="date" 
                  v-model="bookingForm.date" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Giờ</label>
                <select 
                  v-model="bookingForm.time" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option v-for="time in timeSlots" :key="time" :value="time">
                    {{ time }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tên khách hàng</label>
              <input 
                type="text" 
                v-model="bookingForm.customerName" 
                required
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input 
                  type="tel" 
                  v-model="bookingForm.phone" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  v-model="bookingForm.email"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Số người chơi</label>
                <input 
                  type="number" 
                  v-model="bookingForm.players" 
                  min="1" 
                  max="4" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  v-model="bookingForm.status" 
                  required
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea 
                v-model="bookingForm.notes" 
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
          </div>
          <div class="flex justify-end space-x-2 border-t px-6 py-4">
            <button 
              @click="closeBookingModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              @click="saveBooking"
              class="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md text-sm font-medium"
            >
              {{ isEditMode ? 'Cập nhật' : 'Đặt lịch' }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Confirmation Modal -->
      <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
          <div class="flex justify-between items-center border-b px-6 py-4">
            <h2 class="text-xl font-semibold text-gray-900">Xác nhận</h2>
            <button @click="showConfirmModal = false" class="text-gray-500 hover:text-gray-700">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="px-6 py-4 flex flex-col items-center">
            <AlertTriangleIcon class="w-12 h-12 text-yellow-500 mb-4" />
            <p class="text-gray-900 text-center mb-2">Bạn có chắc chắn muốn xóa lịch đặt này không?</p>
            <p class="text-gray-500 text-center text-sm">Hành động này không thể hoàn tác.</p>
          </div>
          <div class="flex justify-end space-x-2 border-t px-6 py-4">
            <button 
              @click="showConfirmModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button 
              @click="deleteBooking"
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
  import { ref, reactive, computed, onMounted } from 'vue'
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
    AlertTriangleIcon
  } from 'lucide-vue-next'
  
  // State
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const showBookingModal = ref(false)
  const showConfirmModal = ref(false)
  const isEditMode = ref(false)
  const selectedBookingId = ref(null)
  
  // Form and filters
  const bookingForm = reactive({
    id: '',
    courseId: '',
    date: '',
    time: '',
    customerName: '',
    phone: '',
    email: '',
    players: 1,
    status: 'pending',
    notes: ''
  })
  
  const filters = reactive({
    courseId: '',
    date: new Date().toISOString().split('T')[0],
    status: '',
    search: ''
  })
  
  // Mock data
  const courses = ref([
    { id: '1', name: 'Sân A - 18 hố' },
    { id: '2', name: 'Sân B - 9 hố' },
    { id: '3', name: 'Sân C - 18 hố' }
  ])
  
  const bookings = ref([
    { 
      id: 'BK001', 
      courseId: '1', 
      date: '2025-04-23', 
      time: '07:00', 
      customerName: 'Nguyễn Văn A', 
      phone: '0901234567', 
      email: 'nguyenvana@example.com', 
      players: 4, 
      status: 'confirmed',
      notes: 'Khách VIP, chuẩn bị xe điện'
    },
    { 
      id: 'BK002', 
      courseId: '1', 
      date: '2025-04-23', 
      time: '08:30', 
      customerName: 'Trần Thị B', 
      phone: '0909876543', 
      email: 'tranthib@example.com', 
      players: 2, 
      status: 'pending',
      notes: ''
    },
    { 
      id: 'BK003', 
      courseId: '2', 
      date: '2025-04-23', 
      time: '09:00', 
      customerName: 'Lê Văn C', 
      phone: '0912345678', 
      email: 'levanc@example.com', 
      players: 3, 
      status: 'completed',
      notes: 'Đã thanh toán trước'
    },
    { 
      id: 'BK004', 
      courseId: '3', 
      date: '2025-04-23', 
      time: '14:00', 
      customerName: 'Phạm Thị D', 
      phone: '0987654321', 
      email: 'phamthid@example.com', 
      players: 4, 
      status: 'cancelled',
      notes: 'Hủy do thời tiết xấu'
    }
  ])
  
  // Time slots
  const timeSlots = ref([
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ])
  
  // Computed properties
  const filteredBookings = computed(() => {
    let result = bookings.value
  
    if (filters.courseId) {
      result = result.filter(booking => booking.courseId === filters.courseId)
    }
  
    if (filters.date) {
      result = result.filter(booking => booking.date === filters.date)
    }
  
    if (filters.status) {
      result = result.filter(booking => booking.status === filters.status)
    }
  
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(booking => 
        booking.customerName.toLowerCase().includes(searchLower) ||
        booking.phone.includes(filters.search) ||
        booking.email.toLowerCase().includes(searchLower)
      )
    }
  
    // Pagination
    const startIndex = (currentPage.value - 1) * itemsPerPage.value
    return result.slice(startIndex, startIndex + itemsPerPage.value)
  })
  
  const totalPages = computed(() => {
    return Math.ceil(bookings.value.length / itemsPerPage.value) || 1
  })
  
  // Methods
  function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }
  
  function getCourseNameById(id) {
    const course = courses.value.find(c => c.id === id)
    return course ? course.name : ''
  }
  
  function getStatusText(status) {
    switch (status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }
  
  function refreshData() {
    // In a real app, this would fetch fresh data from the server
    console.log('Refreshing data...')
  }
  
  function openNewBookingModal() {
    isEditMode.value = false
    resetBookingForm()
    bookingForm.date = filters.date
    showBookingModal.value = true
  }
  
  function closeBookingModal() {
    showBookingModal.value = false
    resetBookingForm()
  }
  
  function resetBookingForm() {
    Object.assign(bookingForm, {
      id: '',
      courseId: courses.value[0].id,
      date: filters.date,
      time: '07:00',
      customerName: '',
      phone: '',
      email: '',
      players: 1,
      status: 'pending',
      notes: ''
    })
  }
  
  function viewBookingDetails(booking) {
    isEditMode.value = true
    selectedBookingId.value = booking.id
    Object.assign(bookingForm, { ...booking })
    showBookingModal.value = true
  }
  
  function editBooking(booking) {
    viewBookingDetails(booking)
  }
  
  function saveBooking() {
    if (isEditMode.value) {
      // Update existing booking
      const index = bookings.value.findIndex(b => b.id === selectedBookingId.value)
      if (index !== -1) {
        bookings.value[index] = { ...bookingForm }
      }
    } else {
      // Create new booking
      const newBooking = { 
        ...bookingForm,
        id: `BK${String(bookings.value.length + 1).padStart(3, '0')}`
      }
      bookings.value.push(newBooking)
    }
    
    closeBookingModal()
  }
  
  function confirmDeleteBooking(booking) {
    selectedBookingId.value = booking.id
    showConfirmModal.value = true
  }
  
  function deleteBooking() {
    const index = bookings.value.findIndex(b => b.id === selectedBookingId.value)
    if (index !== -1) {
      bookings.value.splice(index, 1)
    }
    showConfirmModal.value = false
  }
  
  onMounted(() => {
    // Initialize with current date
    filters.date = new Date().toISOString().split('T')[0]
  })
  </script>