<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-white min-h-screen">
      <!-- Header section -->
      <div class="bg-green-600 p-6 text-white">
        <h1 class="text-2xl font-bold">Sự kiện Golf</h1>
        <p class="mt-2">Khám phá các sự kiện và ưu đãi hấp dẫn</p>
      </div>

      <!-- Filter section -->
      <div class="bg-white p-4 shadow-md mb-6">
        <div class="container mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Thời gian</label
              >
              <select
                v-model="filters.timeRange"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">Tất cả</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
                <option value="past">Đã kết thúc</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại sự kiện</label
              >
              <select
                v-model="filters.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="PROMOTION">Khuyến mãi</option>
                <option value="TOURNAMENT">Giải đấu</option>
                <option value="TRAINING">Đào tạo</option>
                <option value="SPECIAL">Sự kiện đặc biệt</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại dịch vụ</label
              >
              <select
                v-model="filters.serviceType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả dịch vụ</option>
                <option value="TEE_TIME">Tee Time</option>
                <option value="CADDIE">Caddie</option>
                <option value="TOOL">Dụng cụ</option>
                <option value="COURSE">Sân golf</option>
                <option value="ALL">Tất cả dịch vụ</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Đối tượng</label
              >
              <select
                v-model="filters.targetUserType"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả đối tượng</option>
                <option value="MEMBER">Thành viên</option>
                <option value="GUEST">Khách</option>
                <option value="STAFF">Nhân viên</option>
                <option value="ALL">Tất cả</option>
              </select>
            </div>
          </div>
          <div class="mt-4 flex justify-end">
            <button
              @click="applyFilters"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      </div>

      <!-- Events list -->
      <div class="container mx-auto px-4 mb-8">
        <h2 class="text-xl font-bold mb-4">Sự kiện sắp diễn ra</h2>

        <div v-if="filteredEvents.length === 0" class="text-center py-8">
          <CalendarXIcon class="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p class="text-gray-500">
            Không tìm thấy sự kiện nào phù hợp với bộ lọc
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="event in filteredEvents"
            :key="event.id"
            class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div class="relative">
              <img
                :src="getEventImage(event)"
                :alt="event.title"
                class="w-full h-48 object-cover"
              />
              <div class="absolute top-0 right-0 m-2 flex flex-col gap-2">
                <span
                  v-if="event.discountPercent"
                  class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                >
                  -{{ event.discountPercent }}%
                </span>
                <span
                  :class="{
                    'text-xs font-bold px-2 py-1 rounded-full': true,
                    'bg-green-500 text-white': event.status === 'ACTIVE',
                    'bg-gray-500 text-white': event.status === 'INACTIVE',
                  }"
                >
                  {{ getStatusLabel(event.status) }}
                </span>
              </div>
              <div
                class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4"
              >
                <div class="flex items-center text-white">
                  <CalendarIcon class="w-4 h-4 mr-1" />
                  <span class="text-sm">{{ formatDate(event.startDate) }}</span>
                </div>
              </div>
            </div>

            <div class="p-4">
              <div class="flex items-center mb-2">
                <span
                  :class="{
                    'px-2 py-0.5 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800': event.type === 'TOURNAMENT',
                    'bg-blue-100 text-blue-800': event.type === 'PROMOTION',
                    'bg-purple-100 text-purple-800': event.type === 'SPECIAL',
                    'bg-amber-100 text-amber-800': event.type === 'TRAINING',
                  }"
                >
                  {{ getEventTypeLabel(event.type) }}
                </span>
                <span
                  v-if="event.serviceType"
                  class="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                >
                  {{ getServiceTypeLabel(event.serviceType) }}
                </span>
              </div>

              <h3 class="font-bold text-lg mb-2">{{ event.title }}</h3>

              <div class="flex items-center mb-2 text-gray-600">
                <MapPinIcon class="w-4 h-4 mr-1" />
                <span class="text-sm">{{
                  getGolfCourseName(event.golfCourseId)
                }}</span>
              </div>

              <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                {{ event.description }}
              </p>

              <div class="flex justify-between items-center">
                <div class="flex items-center">
                  <UsersIcon class="w-4 h-4 mr-1 text-gray-500" />
                  <span class="text-sm text-gray-600">{{
                    getTargetUserTypeLabel(event.targetUserType)
                  }}</span>
                </div>
                <button
                  @click="viewEventDetails(event)"
                  class="text-green-600 hover:text-green-700 font-medium"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Event detail modal -->
      <div
        v-if="showEventModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <div class="relative">
            <img
              :src="getEventImage(selectedEvent)"
              :alt="selectedEvent.title"
              class="w-full h-64 object-cover"
            />
            <button
              @click="closeEventModal"
              class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
            >
              <XIcon class="w-6 h-6" />
            </button>
            <div class="absolute top-4 left-4 flex gap-2">
              <span
                v-if="selectedEvent.discountPercent"
                class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
              >
                -{{ selectedEvent.discountPercent }}%
              </span>
              <span
                :class="{
                  'text-xs font-bold px-2 py-1 rounded-full': true,
                  'bg-green-500 text-white': selectedEvent.status === 'ACTIVE',
                  'bg-gray-500 text-white': selectedEvent.status === 'INACTIVE',
                }"
              >
                {{ getStatusLabel(selectedEvent.status) }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <div class="flex items-center mb-4 flex-wrap gap-2">
              <span
                :class="{
                  'px-2 py-0.5 text-xs font-medium rounded-full': true,
                  'bg-green-100 text-green-800':
                    selectedEvent.type === 'TOURNAMENT',
                  'bg-blue-100 text-blue-800':
                    selectedEvent.type === 'PROMOTION',
                  'bg-purple-100 text-purple-800':
                    selectedEvent.type === 'SPECIAL',
                  'bg-amber-100 text-amber-800':
                    selectedEvent.type === 'TRAINING',
                }"
              >
                {{ getEventTypeLabel(selectedEvent.type) }}
              </span>
              <span
                v-if="selectedEvent.serviceType"
                class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
              >
                {{ getServiceTypeLabel(selectedEvent.serviceType) }}
              </span>
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800"
              >
                {{ getTargetUserTypeLabel(selectedEvent.targetUserType) }}
              </span>
            </div>

            <h2 class="text-2xl font-bold mb-4">{{ selectedEvent.title }}</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 class="font-medium text-gray-700 mb-2">
                  Thông tin sự kiện
                </h3>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <CalendarIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium">Thời gian</p>
                      <p class="text-gray-600">
                        {{
                          formatDateRange(
                            selectedEvent.startDate,
                            selectedEvent.endDate
                          )
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <MapPinIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium">Sân golf</p>
                      <p class="text-gray-600">
                        {{ getGolfCourseName(selectedEvent.golfCourseId) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <TagIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium">Loại dịch vụ</p>
                      <p class="text-gray-600">
                        {{ getServiceTypeLabel(selectedEvent.serviceType) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <UsersIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium">Đối tượng áp dụng</p>
                      <p class="text-gray-600">
                        {{
                          getTargetUserTypeLabel(selectedEvent.targetUserType)
                        }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="selectedEvent.discountPercent"
                    class="flex items-start"
                  >
                    <PercentIcon class="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <p class="font-medium">Giảm giá</p>
                      <p class="text-gray-600">
                        {{ selectedEvent.discountPercent }}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 class="font-medium text-gray-700 mb-2">Mô tả sự kiện</h3>
                <p class="text-gray-600 whitespace-pre-line">
                  {{ selectedEvent.description }}
                </p>

                <div class="mt-6">
                  <button
                    v-if="selectedEvent.status === 'ACTIVE'"
                    @click="registerInterest(selectedEvent)"
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
                  >
                    Đăng ký tham gia
                  </button>
                  <p v-else class="text-center text-gray-500 italic mt-4">
                    Sự kiện này hiện không khả dụng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration interest modal -->
      <div
        v-if="showRegistrationModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div
            class="p-4 border-b border-gray-200 flex justify-between items-center"
          >
            <h3 class="text-lg font-medium text-gray-900">Đăng ký quan tâm</h3>
            <button
              @click="closeRegistrationModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>

          <div class="p-4">
            <form @submit.prevent="submitRegistration">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Họ và tên</label
                  >
                  <input
                    v-model="registrationForm.name"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    v-model="registrationForm.email"
                    type="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    v-model="registrationForm.phone"
                    type="tel"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ghi chú</label
                  >
                  <textarea
                    v-model="registrationForm.notes"
                    rows="3"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  ></textarea>
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="submit"
                  class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
                >
                  Xác nhận đăng ký
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Success modal -->
      <div
        v-if="showSuccessModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-lg shadow-lg w-full max-w-md text-center p-6"
        >
          <div
            class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4"
          >
            <CheckIcon class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Đăng ký thành công!
          </h3>
          <p class="text-gray-600 mb-6">
            Cảm ơn bạn đã đăng ký quan tâm đến sự kiện. Chúng tôi sẽ liên hệ với
            bạn sớm nhất có thể.
          </p>
          <button
            @click="closeSuccessModal"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  MapPin as MapPinIcon,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  X as XIcon,
  Check as CheckIcon,
  CalendarX as CalendarXIcon,
  Tag as TagIcon,
  Percent as PercentIcon,
} from "lucide-vue-next";

// State
const events = ref([]);
const filters = ref({
  timeRange: "upcoming",
  type: "",
  serviceType: "",
  targetUserType: "",
});
const showEventModal = ref(false);
const showRegistrationModal = ref(false);
const showSuccessModal = ref(false);
const selectedEvent = ref({});
const registrationForm = ref({
  name: "",
  email: "",
  phone: "",
  notes: "",
});

// Computed
const filteredEvents = computed(() => {
  const now = new Date();

  return events.value
    .filter((event) => {
      // Filter by time range
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const isUpcoming = startDate > now;
      const isOngoing = startDate <= now && endDate >= now;
      const isPast = endDate < now;

      if (filters.value.timeRange === "upcoming" && !isUpcoming) return false;
      if (filters.value.timeRange === "ongoing" && !isOngoing) return false;
      if (filters.value.timeRange === "past" && !isPast) return false;

      // Filter by event type
      if (filters.value.type && event.type !== filters.value.type) return false;

      // Filter by service type
      if (
        filters.value.serviceType &&
        event.serviceType !== filters.value.serviceType &&
        event.serviceType !== "ALL"
      )
        return false;

      // Filter by target user type
      if (
        filters.value.targetUserType &&
        event.targetUserType !== filters.value.targetUserType &&
        event.targetUserType !== "ALL"
      )
        return false;

      // Only show active events by default
      if (event.status !== "ACTIVE" && filters.value.timeRange !== "past")
        return false;

      return true;
    })
    .slice(0, 6); // Limit to 6 events
});

// Methods
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateRange(startDateString, endDateString) {
  if (!startDateString || !endDateString) return "";

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const startFormatted = startDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const endFormatted = endDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  if (startFormatted === endFormatted) {
    return startFormatted;
  }

  return `${startFormatted} - ${endFormatted}`;
}

function getEventTypeLabel(type) {
  const typeMap = {
    TOURNAMENT: "Giải đấu",
    PROMOTION: "Khuyến mãi",
    TRAINING: "Đào tạo",
    SPECIAL: "Sự kiện đặc biệt",
  };
  return typeMap[type] || type;
}

function getServiceTypeLabel(serviceType) {
  const serviceTypeMap = {
    TEE_TIME: "Tee Time",
    CADDIE: "Caddie",
    TOOL: "Dụng cụ",
    COURSE: "Sân golf",
    ALL: "Tất cả dịch vụ",
  };
  return serviceTypeMap[serviceType] || serviceType;
}

function getTargetUserTypeLabel(targetUserType) {
  const targetUserTypeMap = {
    MEMBER: "Thành viên",
    GUEST: "Khách",
    STAFF: "Nhân viên",
    ALL: "Tất cả đối tượng",
  };
  return targetUserTypeMap[targetUserType] || targetUserType;
}

function getStatusLabel(status) {
  const statusMap = {
    ACTIVE: "Đang diễn ra",
    INACTIVE: "Tạm dừng",
  };
  return statusMap[status] || status;
}

function getGolfCourseName(golfCourseId) {
  const golfCourseMap = {
    GC001: "Kings Island Golf Resort",
    GC002: "Vinpearl Golf Nam Hội An",
    GC003: "BRG Da Nang Golf Resort",
    GC004: "The Bluffs Ho Tram Strip",
    GC005: "Long Thanh Golf Club",
  };
  return golfCourseMap[golfCourseId] || golfCourseId;
}

function getEventImage(event) {
  // In a real app, this would return the actual image URL for the event
  // For now, we'll use placeholder images based on the event type
  const typeImageMap = {
    TOURNAMENT: "/placeholder.svg?height=400&width=600&text=Giải+đấu",
    PROMOTION: "/placeholder.svg?height=400&width=600&text=Khuyến+mãi",
    TRAINING: "/placeholder.svg?height=400&width=600&text=Đào+tạo",
    SPECIAL: "/placeholder.svg?height=400&width=600&text=Sự+kiện+đặc+biệt",
  };
  return typeImageMap[event.type] || "/placeholder.svg?height=400&width=600";
}

function applyFilters() {
  console.log("Applying filters:", filters.value);
  // In a real app, this might fetch data from an API
}

function viewEventDetails(event) {
  selectedEvent.value = event;
  showEventModal.value = true;
}

function closeEventModal() {
  showEventModal.value = false;
}

function registerInterest(event) {
  selectedEvent.value = event;
  showEventModal.value = false;
  showRegistrationModal.value = true;

  // Pre-fill form with user data if available
  // In a real app, this would come from user profile
  registrationForm.value = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0912345678",
    notes: "",
  };
}

function closeRegistrationModal() {
  showRegistrationModal.value = false;
}

function submitRegistration() {
  console.log("Registration submitted:", registrationForm.value);

  // In a real app, this would send data to the server

  showRegistrationModal.value = false;
  showSuccessModal.value = true;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
}

// Load mock data
function loadEvents() {
  const mockEvents = [
    {
      id: "e1b5774a-cb45-4547-9cd8-2a5d12f2fb1f",
      title: "Giải Golf Mùa Hè 2025",
      description:
        "Giải đấu thường niên dành cho các golfer chuyên nghiệp và nghiệp dư. Tham gia để trải nghiệm sân golf đẳng cấp và cơ hội nhận những giải thưởng hấp dẫn.",
      type: "TOURNAMENT",
      discountPercent: null,
      startDate: "2025-06-15",
      endDate: "2025-06-16",
      golfCourseId: "GC001",
      serviceType: "TEE_TIME",
      targetUserType: "ALL",
      status: "ACTIVE",
    },
    {
      id: "a2c6884b-df56-5658-0de9-3b6e23f3gc2g",
      title: "Khuyến Mãi Tee Time Buổi Sáng",
      description:
        "Ưu đãi đặc biệt giảm 20% cho tất cả các tee time từ 6:00 - 9:00 sáng từ thứ Hai đến thứ Sáu. Áp dụng cho tất cả các thành viên.",
      type: "PROMOTION",
      discountPercent: 20,
      startDate: "2025-05-01",
      endDate: "2025-06-30",
      golfCourseId: "GC002",
      serviceType: "TEE_TIME",
      targetUserType: "MEMBER",
      status: "ACTIVE",
    },
    {
      id: "b3d7995c-ef67-6769-1ef0-4c7f34f4hd3h",
      title: "Khóa Học Golf Nâng Cao",
      description:
        "Khóa học chuyên sâu dành cho người chơi muốn nâng cao kỹ năng. Được hướng dẫn bởi các HLV chuyên nghiệp với nhiều năm kinh nghiệm.",
      type: "TRAINING",
      discountPercent: null,
      startDate: "2025-07-10",
      endDate: "2025-07-15",
      golfCourseId: "GC003",
      serviceType: "COURSE",
      targetUserType: "ALL",
      status: "ACTIVE",
    },
    {
      id: "c4e8006d-fg78-7870-2fg1-5d8g45g5ie4i",
      title: "Thuê Caddie Ưu Đãi",
      description:
        "Giảm 15% phí thuê caddie khi đặt trước ít nhất 3 ngày. Caddie chuyên nghiệp sẽ giúp bạn có trải nghiệm chơi golf tốt nhất.",
      type: "PROMOTION",
      discountPercent: 15,
      startDate: "2025-05-15",
      endDate: "2025-08-15",
      golfCourseId: "GC004",
      serviceType: "CADDIE",
      targetUserType: "ALL",
      status: "ACTIVE",
    },
    {
      id: "d5f9117e-gh89-8981-3hg2-6e9h56h6jf5j",
      title: "Sự Kiện Giao Lưu Doanh Nhân",
      description:
        "Sự kiện giao lưu dành riêng cho các doanh nhân, kết hợp giữa chơi golf và kết nối kinh doanh. Cơ hội tuyệt vời để mở rộng mạng lưới và thư giãn.",
      type: "SPECIAL",
      discountPercent: null,
      startDate: "2025-09-20",
      endDate: "2025-09-20",
      golfCourseId: "GC005",
      serviceType: "ALL",
      targetUserType: "MEMBER",
      status: "ACTIVE",
    },
    {
      id: "e6g0228f-hi90-9092-4ih3-7f0i67i7kg6k",
      title: "Thuê Gậy Golf Giảm Giá",
      description:
        "Ưu đãi giảm 25% khi thuê bộ gậy golf cao cấp. Áp dụng cho khách không phải thành viên của sân golf.",
      type: "PROMOTION",
      discountPercent: 25,
      startDate: "2025-06-01",
      endDate: "2025-07-31",
      golfCourseId: "GC001",
      serviceType: "TOOL",
      targetUserType: "GUEST",
      status: "ACTIVE",
    },
    {
      id: "f7h1339g-ij01-0103-5ji4-8g1j78j8lh7l",
      title: "Giải Đấu Từ Thiện",
      description:
        "Giải đấu gây quỹ từ thiện cho trẻ em có hoàn cảnh khó khăn. Tham gia để đóng góp vào mục đích cao cả và trải nghiệm một ngày chơi golf đáng nhớ.",
      type: "TOURNAMENT",
      discountPercent: null,
      startDate: "2025-08-15",
      endDate: "2025-08-16",
      golfCourseId: "GC002",
      serviceType: "TEE_TIME",
      targetUserType: "ALL",
      status: "INACTIVE",
    },
    {
      id: "g8i2440h-jk12-1214-6kj5-9h2k89k9mi8m",
      title: "Khóa Học Golf Cơ Bản",
      description:
        "Khóa học dành cho người mới bắt đầu chơi golf. Học các kỹ năng cơ bản và quy tắc của môn thể thao này.",
      type: "TRAINING",
      discountPercent: 10,
      startDate: "2025-05-10",
      endDate: "2025-05-12",
      golfCourseId: "GC003",
      serviceType: "COURSE",
      targetUserType: "GUEST",
      status: "ACTIVE",
    },
    {
      id: "h9j3551i-kl23-2325-7lk6-0i3l90l0nj9n",
      title: "Ngày Hội Gia Đình",
      description:
        "Sự kiện dành cho cả gia đình với nhiều hoạt động vui nhộn ngoài việc chơi golf. Có các hoạt động dành riêng cho trẻ em.",
      type: "SPECIAL",
      discountPercent: null,
      startDate: "2025-07-01",
      endDate: "2025-07-01",
      golfCourseId: "GC004",
      serviceType: "ALL",
      targetUserType: "ALL",
      status: "ACTIVE",
    },
    {
      id: "i0k4662j-lm34-3436-8ml7-1j4m01m1ok0o",
      title: "Khuyến Mãi Cuối Tuần",
      description:
        "Giảm 10% cho tất cả các dịch vụ vào cuối tuần. Áp dụng cho tất cả các đối tượng khách hàng.",
      type: "PROMOTION",
      discountPercent: 10,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      golfCourseId: "GC005",
      serviceType: "ALL",
      targetUserType: "ALL",
      status: "INACTIVE",
    },
  ];

  events.value = mockEvents;
}

// Lifecycle hooks
onMounted(() => {
  loadEvents();
});
</script>
