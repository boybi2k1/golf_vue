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
              <h3 class="font-medium text-gray-700 mb-3">Thông tin liên hệ</h3>
              <div class="space-y-3">
                <div class="flex items-start">
                  <PhoneIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Số điện thoại</p>
                    <p class="font-medium">
                      {{ staffForm.phone || "Chưa cập nhật" }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start">
                  <MailIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Email</p>
                    <p class="font-medium">{{ staffForm.email }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <MapPinIcon class="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p class="text-sm text-gray-500">Địa chỉ</p>
                    <p class="font-medium">
                      {{ staffForm.address || "Chưa cập nhật" }}
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
                    v-model="staffForm.fullName"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ngày sinh</label
                  >
                  <input
                    v-model="staffForm.birthDate"
                    type="date"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    v-model="staffForm.phone"
                    type="tel"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    v-model="staffForm.email"
                    type="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Địa chỉ</label
                  >
                  <input
                    v-model="staffForm.address"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giới tính</label
                  >
                  <select
                    v-model="staffForm.gender"
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
                    v-model="staffForm.birthDate"
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
const showToast = inject('showToast');
// Notification status: 'success' | 'error'
import { useAuthStore } from "../../stores/auth";
import { useStaffStore } from "../../stores/staff";
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

// Tabs
const tabs = [
  { id: "personal", label: "Thông tin cá nhân" },
  { id: "security", label: "Bảo mật" },
];


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


const authStore = useAuthStore();
const staffStore = useStaffStore();
// const { user } = storeToRefs(authStore);

const userCurrent = ref(null);
const userstaff = ref(null);

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

const staffForm = reactive({
  id: "",
  fullName: "",
  email: "",
  phone: "",
  isDelete: false,
  role: "staff",
  userId: "",
  address: "",
  birthDate: "",
  gender: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: authStore.userId,
  updatedBy: authStore.userId,
});
async function savePersonalInfo() {
  try {
    const data = {
      fullName: staffForm.fullName,
      email: staffForm.email,
      gender: staffForm.gender,
      phone: staffForm.phone,
      address: staffForm.address,
      birthDate: staffForm.birthDate,
    };
    const updatestaff = await staffStore.updatestaff(staffForm.id, data);
    if (updatestaff) {
      userForm.fullName = staffForm.fullName;
      userForm.email = staffForm.email;
      userForm.phone = staffForm.phone;
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
  console.log("Fetching user data...");
  try {
    const userId = localStorage.getItem("userId");
    // Simulate fetching user data from an API
    userCurrent.value = await authStore.fetchUser();
    userstaff.value = await staffStore.getStaffByUserId(userId);
    console.log("userCurrent", userCurrent.value);
    console.log("userstaff", userstaff.value);
    if (userCurrent.value) {
      userForm.id = userCurrent.value.id;
      userForm.fullName = userCurrent.value.fullName;
      userForm.email = userCurrent.value.email;
      userForm.phone = userCurrent.value.phone;
      userForm.avatar = URL_IMAGE + userCurrent.value.avatar;
    }
    console.log("userForm", userForm);
    if (userstaff.value) {
      staffForm.id = userstaff.value.id;
      staffForm.fullName = userstaff.value.fullName;
      staffForm.email = userstaff.value.email;
      staffForm.phone = userstaff.value.phone;
      staffForm.address = userstaff.value.address || "";
      staffForm.birthDate = userstaff.value.birthDate || "";
      staffForm.gender = userstaff.value.gender;
      staffForm.userId = userstaff.value.userId;
      staffForm.totalBooking = userstaff.value.totalBooking || 0;
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
