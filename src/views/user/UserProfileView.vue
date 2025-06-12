<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
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
                      v-if="userForm.avatar"
                      :src="userForm.avatar"
                      alt="Avatar"
                      class="w-full h-full object-cover"
                    />
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center bg-gray-200 text-4xl font-bold text-green-700 select-none"
                    >
                      {{
                        userForm.fullName &&
                        userForm.fullName
                          .split(" ")
                          .map((word) => word[0]?.toUpperCase() || "")
                          .join("")
                      }}
                    </div>
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
                  {{ userForm.fullName }}
                </h2>
                <p class="text-gray-600">{{ userForm.email }}</p>
                <div class="mt-2 flex items-center">
                  <span
                    class="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 font-medium"
                  >
                    {{ getMembershipLabel(userForm.membershipType) }}
                  </span>
                </div>
              </div>

              <div class="p-4">
                <h3 class="font-medium text-gray-700 mb-3">
                  Thông tin liên hệ
                </h3>
                <div class="space-y-3">
                  <div class="flex items-start">
                    <PhoneIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p class="text-sm text-gray-500">Số điện thoại</p>
                      <p class="font-medium">
                        {{ guestForm.phone || "Chưa cập nhật" }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <MailIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p class="text-sm text-gray-500">Email</p>
                      <p class="font-medium">{{ guestForm.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <MapPinIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p class="text-sm text-gray-500">Địa chỉ</p>
                      <p class="font-medium">
                        {{ guestForm.address || "Chưa cập nhật" }}
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
                      v-model="guestForm.fullName"
                      type="text"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Ngày sinh</label
                    >
                    <input
                      v-model="guestForm.birthDate"
                      type="date"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Số điện thoại</label
                    >
                    <input
                      v-model="guestForm.phone"
                      type="tel"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Email</label
                    >
                    <input
                      disabled  
                      v-model="guestForm.email"
                      type="email"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Địa chỉ</label
                    >
                    <input
                      v-model="guestForm.address"
                      type="text"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Giới tính</label
                    >
                    <select
                      v-model="guestForm.gender"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Ngày sinh</label
                    >
                    <input
                      v-model="guestForm.birthDate"
                      type="date"
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
            <!-- <div
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
          </div> -->

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
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Mật khẩu hiện tại</label
                      >
                      <input
                        v-model="passwordForm.currentPassword"
                        type="password"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Mật khẩu mới</label
                      >
                      <input
                        v-model="passwordForm.newPassword"
                        type="password"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 mb-1"
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

      <!-- Success/Error notification -->
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, inject } from "vue";
import {
  Camera as CameraIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  MapPin as MapPinIcon,
  Check as CheckIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Laptop as DeviceIcon,
} from "lucide-vue-next";
const showToast = inject("showToast");
// Notification status: 'success' | 'error'
import { useAuthStore } from "../../stores/auth";
import { useGuestStore } from "../../stores/guest";
import { getMembershipLabel } from "../../utils/utils";
import { useUserStore } from "../../stores/user";
import { URL_IMAGE } from "../../api";
const userStore = useUserStore();
// State
const activeTab = ref("personal");
const fileInput = ref(null);

// User data

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

async function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await userStore.changeAvatar(file);
      // fallback: tạo URL tạm nếu backend không trả về url
      userForm.avatar = URL.createObjectURL(file);
      showToast("Cập nhật ảnh đại diện thành công");
    } catch (err) {
      showToast("Cập nhật ảnh đại diện thất bại", "error");
    }
  }
}

function upgradeMembership(membershipId) {
  // In a real app, this would redirect to a payment page
  alert(
    `Chuyển đến trang thanh toán để nâng cấp lên ${getMembershipLabel(
      membershipId
    )}`
  );
}

async function changePassword() {
  // Validate passwords
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    alert("Mật khẩu mới không khớp");
    return;
  }

  const data = {
    oldPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
  };
  await userStore
    .changePassword(data)
    .then(() => {
      showToast("Đổi mật khẩu thành công");
    })
    .catch((error) => {
      showToast("Đổi mật khẩu thất bại", "error");
    });

  // Reset form
  passwordForm.currentPassword = "";
  passwordForm.newPassword = "";
  passwordForm.confirmPassword = "";
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

const authStore = useAuthStore();
const guestStore = useGuestStore();
// const { user } = storeToRefs(authStore);

const userCurrent = ref(null);
const userGuest = ref(null);

const userForm = reactive({
  id: "",
  fullName: "",
  email: "",
  phone: "",
  avatar: "",
  isActive: true,
  provider: "LOCAL",
  createdBy: authStore.userId,
  updatedBy: authStore.userId,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: "GOLFER",
});

const guestForm = reactive({
  id: "",
  fullName: "",
  email: "",
  phone: "",
  isDelete: false,
  role: "GUEST",
  userId: "",
  address: "",
  birthDate: "",
  gender: "",
  totalBooking: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: authStore.userId,
  updatedBy: authStore.userId,
});
async function savePersonalInfo() {
  try {
    const data = {
      fullName: guestForm.fullName,
      email: guestForm.email,
      gender: guestForm.gender,
      phone: guestForm.phone,
      address: guestForm.address,
      birthDate: guestForm.birthDate,
    };
    const updateGuest = await guestStore.updateGuest(guestForm.id, data);
    if (updateGuest) {
      userForm.fullName = guestForm.fullName;
      userForm.email = guestForm.email;
      userForm.phone = guestForm.phone;
      showToast("Cập nhật thông tin cá nhân thành công");
    } else {
      throw new Error("Cập nhật thông tin cá nhân thất bại");
    }
  } catch (error) {
    console.error(error);
    showToast("Cập nhật thông tin cá nhân thất bại", "error");
  }
}
const fetchUserData = async () => {
  try {
    const userId = localStorage.getItem("userId");
    // Simulate fetching usrer data from an API
    userCurrent.value = await authStore.fetchUser();
    userGuest.value = await guestStore.getGuestByUserId(userId);
    console.log("userCurrent", userCurrent.value);
    console.log("userGuest", userGuest.value);
    if (userCurrent.value) {
      userForm.id = userCurrent.value.id;
      userForm.fullName = userCurrent.value.fullName;
      userForm.email = userCurrent.value.email;
      userForm.phone = userCurrent.value.phone;
      userForm.avatar = URL_IMAGE + userCurrent.value.avatar;
    }
    console.log("userForm", userForm);
    if (userGuest.value) {
      guestForm.id = userGuest.value.id;
      guestForm.fullName = userGuest.value.fullName;
      guestForm.email = userGuest.value.email;
      guestForm.phone = userGuest.value.phone;
      guestForm.address = userGuest.value.address || "";
      guestForm.birthDate = userGuest.value.birthDate || "";
      guestForm.gender = userGuest.value.gender;
      guestForm.userId = userGuest.value.userId;
      guestForm.totalBooking = userGuest.value.totalBooking || 0;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchUserData();
});
</script>
