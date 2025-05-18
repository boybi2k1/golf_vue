<template>
  <div class="bg-white min-h-screen">
    <!-- Header section -->
    <div class="bg-green-600 p-6 text-white">
      <h1 class="text-2xl font-bold">Thông tin cá nhân</h1>
      <p class="mt-2">Quản lý thông tin tài khoản và tùy chọn cá nhân</p>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left sidebar - Profile summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              class="bg-green-50 p-6 flex flex-col items-center border-b border-gray-200"
            >
              <div class="relative mb-4 group">
                <div
                  class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md"
                >
                  <img
                    :src="
                      user.avatarUrl ||
                      '/placeholder.svg?height=128&width=128&text=Avatar'
                    "
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                </div>
                <button
                  @click="openFileUpload"
                  class="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition-colors"
                >
                  <CameraIcon class="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleAvatarChange"
                />
              </div>
              <h2 class="text-xl font-bold text-gray-800">
                {{ user.fullName }}
              </h2>
              <p class="text-gray-600">{{ user.email }}</p>
              <div class="mt-2 flex items-center">
                <span
                  class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium"
                >
                  {{ getMembershipLabel(user.membershipType) }}
                </span>
              </div>
            </div>

            <div class="p-4">
              <h3 class="font-medium text-gray-700 mb-3">Thông tin liên hệ</h3>
              <div class="space-y-3">
                <div class="flex items-start">
                  <PhoneIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Số điện thoại</p>
                    <p class="font-medium">
                      {{ user.phone || "Chưa cập nhật" }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <MailIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium">{{ user.email }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <MapPinIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Địa chỉ</p>
                    <p class="font-medium">
                      {{ user.address || "Chưa cập nhật" }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right content - Profile details and settings -->
        <div class="lg:col-span-2">
          <!-- Tabs -->
          <div class="mb-6 border-b border-gray-200">
            <div class="flex overflow-x-auto">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="{
                  'px-4 py-2 font-medium text-sm whitespace-nowrap': true,
                  'text-green-600 border-b-2 border-green-600':
                    activeTab === tab.id,
                  'text-gray-500 hover:text-gray-700': activeTab !== tab.id,
                }"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Personal Information Tab -->
          <div
            v-if="activeTab === 'personal'"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Thông tin cá nhân
            </h2>
            <form @submit.prevent="savePersonalInfo">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Họ và tên</label
                  >
                  <input
                    v-model="personalInfo.fullName"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ngày sinh</label
                  >
                  <input
                    v-model="personalInfo.birthDate"
                    type="date"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    v-model="personalInfo.phone"
                    type="tel"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    v-model="personalInfo.email"
                    type="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Địa chỉ</label
                  >
                  <input
                    v-model="personalInfo.address"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giới tính</label
                  >
                  <select
                    v-model="personalInfo.gender"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Quốc tịch</label
                  >
                  <input
                    v-model="personalInfo.nationality"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>

          <!-- Membership Tab -->
          <div
            v-if="activeTab === 'membership'"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Thông tin hội viên
            </h2>

            <div class="bg-green-50 p-4 rounded-lg mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-gray-800">
                    Gói hội viên hiện tại
                  </h3>
                  <p class="text-lg font-bold text-green-600">
                    {{ getMembershipLabel(user.membershipType) }}
                  </p>
                  <p class="text-sm text-gray-600">
                    Ngày hết hạn: {{ formatDate(user.membershipExpiry) }}
                  </p>
                </div>
                <div
                  class="bg-white px-3 py-1 rounded-full text-green-600 font-medium border border-green-200"
                >
                  {{ getRemainingDays(user.membershipExpiry) }} ngày còn lại
                </div>
              </div>
            </div>

            <h3 class="font-medium text-gray-700 mb-3">
              Nâng cấp gói hội viên
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div
                v-for="plan in membershipPlans"
                :key="plan.id"
                :class="{
                  'border rounded-lg overflow-hidden transition-all': true,
                  'border-green-500 shadow-md': plan.id === user.membershipType,
                  'border-gray-200 hover:border-green-300':
                    plan.id !== user.membershipType,
                }"
              >
                <div
                  :class="{
                    'p-4 border-b': true,
                    'bg-green-50 border-green-200':
                      plan.id === user.membershipType,
                    'bg-gray-50 border-gray-200':
                      plan.id !== user.membershipType,
                  }"
                >
                  <h4 class="font-bold text-gray-800">{{ plan.name }}</h4>
                  <p class="text-2xl font-bold mt-1">
                    {{ formatPrice(plan.price)
                    }}<span class="text-sm font-normal text-gray-500"
                      >/năm</span
                    >
                  </p>
                </div>
                <div class="p-4">
                  <ul class="space-y-2 mb-4">
                    <li
                      v-for="(feature, index) in plan.features"
                      :key="index"
                      class="flex items-start"
                    >
                      <CheckIcon class="w-5 h-5 text-green-500 mr-2 shrink-0" />
                      <span class="text-sm">{{ feature }}</span>
                    </li>
                  </ul>
                  <button
                    v-if="plan.id === user.membershipType"
                    disabled
                    class="w-full bg-gray-100 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed"
                  >
                    Gói hiện tại
                  </button>
                  <button
                    v-else
                    @click="upgradeMembership(plan.id)"
                    class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {{
                      plan.id > user.membershipType ? "Nâng cấp" : "Chuyển đổi"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div
            v-if="activeTab === 'security'"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              Bảo mật tài khoản
            </h2>

            <div class="mb-6">
              <h3 class="font-medium text-gray-700 mb-3">Đổi mật khẩu</h3>
              <form @submit.prevent="changePassword">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Mật khẩu hiện tại</label
                    >
                    <input
                      v-model="passwordForm.currentPassword"
                      type="password"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Mật khẩu mới</label
                    >
                    <input
                      v-model="passwordForm.newPassword"
                      type="password"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Xác nhận mật khẩu mới</label
                    >
                    <input
                      v-model="passwordForm.confirmPassword"
                      type="password"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div class="mt-4 flex justify-end">
                  <button
                    type="submit"
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success notification -->
    <div
      v-if="showNotification"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center"
    >
      <CheckCircleIcon class="w-5 h-5 mr-2" />
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  Camera as CameraIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as DeviceIcon,
} from "lucide-vue-next";

// State
const activeTab = ref("personal");
const showNotification = ref(false);
const notificationMessage = ref("");
const fileInput = ref(null);

// User data
const user = reactive({
  id: "USR001",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0912345678",
  address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  avatarUrl: null,
  membershipType: "GOLD",
  membershipExpiry: "2025-12-31",
  memberSince: "2020-05-15",
  handicap: 12.5,
  totalGames: 48,
  favoriteCourse: "Kings Island Golf Resort",
});

// Form data
const personalInfo = reactive({
  fullName: user.fullName,
  birthDate: "1985-07-15",
  phone: user.phone,
  email: user.email,
  address: user.address,
  gender: "MALE",
  nationality: "Việt Nam",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const securitySettings = reactive({
  twoFactorEnabled: false,
});

// Tabs
const tabs = [
  { id: "personal", label: "Thông tin cá nhân" },
  { id: "membership", label: "Hội viên" },
  { id: "security", label: "Bảo mật" },
];

// Golf courses
const golfCourses = [
  { id: "GC001", name: "Kings Island Golf Resort" },
  { id: "GC002", name: "Vinpearl Golf Nam Hội An" },
  { id: "GC003", name: "BRG Da Nang Golf Resort" },
  { id: "GC004", name: "The Bluffs Ho Tram Strip" },
  { id: "GC005", name: "Long Thanh Golf Club" },
];

// Membership plans
const membershipPlans = [
  {
    id: "BASIC",
    name: "Cơ bản",
    price: 5000000,
    features: [
      "Đặt sân trước 3 ngày",
      "Giảm 5% phí sân",
      "Không giới hạn số lần chơi",
    ],
  },
  {
    id: "GOLD",
    name: "Vàng",
    price: 15000000,
    features: [
      "Đặt sân trước 7 ngày",
      "Giảm 15% phí sân",
      "Giảm 10% dịch vụ caddie",
      "Tham gia các sự kiện độc quyền",
    ],
  },
  {
    id: "PLATINUM",
    name: "Bạch kim",
    price: 30000000,
    features: [
      "Đặt sân trước 14 ngày",
      "Giảm 25% phí sân",
      "Giảm 20% dịch vụ caddie",
      "Tham gia các sự kiện độc quyền",
      "Huấn luyện viên riêng 2 buổi/tháng",
    ],
  },
];

// Methods
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getMembershipLabel(membershipType) {
  const membershipMap = {
    BASIC: "Hội viên Cơ bản",
    GOLD: "Hội viên Vàng",
    PLATINUM: "Hội viên Bạch kim",
  };
  return membershipMap[membershipType] || membershipType;
}

function getRemainingDays(expiryDate) {
  if (!expiryDate) return 0;
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

function openFileUpload() {
  fileInput.value.click();
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    // In a real app, this would upload the file to a server
    // For now, we'll just create a local URL
    user.avatarUrl = URL.createObjectURL(file);
    showNotification.value = true;
    notificationMessage.value = "Ảnh đại diện đã được cập nhật";
    setTimeout(() => {
      showNotification.value = false;
    }, 3000);
  }
}

function savePersonalInfo() {
  // In a real app, this would send the data to a server
  user.fullName = personalInfo.fullName;
  user.phone = personalInfo.phone;
  user.email = personalInfo.email;
  user.address = personalInfo.address;

  showNotification.value = true;
  notificationMessage.value = "Thông tin cá nhân đã được cập nhật";
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

function upgradeMembership(membershipId) {
  // In a real app, this would redirect to a payment page
  alert(
    `Chuyển đến trang thanh toán để nâng cấp lên ${getMembershipLabel(
      membershipId
    )}`
  );
}

function changePassword() {
  // Validate passwords
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("Mật khẩu mới không khớp");
    return;
  }

  // In a real app, this would send the data to a server
  showNotification.value = true;
  notificationMessage.value = "Mật khẩu đã được cập nhật";
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);

  // Reset form
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
}

function toggleTwoFactor() {
  // In a real app, this would open a setup flow for 2FA
  securitySettings.twoFactorEnabled = !securitySettings.twoFactorEnabled;

  showNotification.value = true;
  notificationMessage.value = securitySettings.twoFactorEnabled
    ? "Xác thực hai yếu tố đã được bật"
    : "Xác thực hai yếu tố đã được tắt";
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

const activeSessions = ref([]);

function terminateSession(sessionId) {
  // In a real app, this would send a request to terminate the session
  const index = activeSessions.findIndex((session) => session.id === sessionId);
  if (index !== -1) {
    activeSessions.splice(index, 1);
  }

  showNotification.value = true;
  notificationMessage.value = "Phiên đăng nhập đã được kết thúc";
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

function terminateAllSessions() {
  // In a real app, this would send a request to terminate all sessions except the current one
  const currentSession = activeSessions.find((session) => session.current);
  activeSessions.length = 0;
  if (currentSession) {
    activeSessions.push(currentSession);
  }

  showNotification.value = true;
  notificationMessage.value =
    "Tất cả các phiên đăng nhập khác đã được kết thúc";
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
}

// Lifecycle hooks
onMounted(() => {
  // In a real app, this would fetch user data from a server
});
</script>
