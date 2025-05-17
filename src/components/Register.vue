<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <div class="bg-green-600 p-6 text-white">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Golf Course Manager</h1>
        <div>
          <router-link
            to="/login"
            class="text-white hover:text-green-100 flex items-center"
          >
            <LogInIcon class="w-5 h-5 mr-1" />
            <span>Đăng nhập</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-grow flex items-center justify-center p-4">
      <div class="w-full max-w-2xl">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <!-- Form header -->
          <div class="bg-green-50 p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h2>
            <p class="mt-2 text-gray-600">
              Tạo tài khoản để đặt sân golf và tham gia các sự kiện
            </p>
          </div>

          <!-- Registration form -->
          <div class="p-6">
            <form @submit.prevent="handleSubmit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Họ và tên <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="form.fullName"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="{ 'border-red-500': errors.fullName }"
                    required
                  />
                  <p v-if="errors.fullName" class="mt-1 text-sm text-red-500">
                    {{ errors.fullName }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="{ 'border-red-500': errors.email }"
                    required
                  />
                  <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                    {{ errors.email }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại <span class="text-red-500">*</span></label
                  >
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    :class="{ 'border-red-500': errors.phone }"
                    required
                  />
                  <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
                    {{ errors.phone }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Ngày sinh</label
                  >
                  <input
                    v-model="form.birthDate"
                    type="date"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Mật khẩu <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      :class="{ 'border-red-500': errors.password }"
                      required
                    />
                    <button
                      type="button"
                      @click="showPassword = !showPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                      <EyeOffIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                  <p v-if="errors.password" class="mt-1 text-sm text-red-500">
                    {{ errors.password }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ
                    thường và số
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Xác nhận mật khẩu
                    <span class="text-red-500">*</span></label
                  >
                  <div class="relative">
                    <input
                      v-model="form.confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      :class="{ 'border-red-500': errors.confirmPassword }"
                      required
                    />
                    <button
                      type="button"
                      @click="showConfirmPassword = !showConfirmPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                      <EyeOffIcon v-else class="h-5 w-5" />
                    </button>
                  </div>
                  <p
                    v-if="errors.confirmPassword"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ errors.confirmPassword }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giới tính</label
                  >
                  <select
                    v-model="form.gender"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Địa chỉ</label
                  >
                  <input
                    v-model="form.address"
                    type="text"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="mb-6">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="terms"
                      v-model="form.acceptTerms"
                      type="checkbox"
                      class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                      :class="{ 'border-red-500': errors.acceptTerms }"
                      required
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="font-medium text-gray-700"
                      >Tôi đồng ý với
                      <a href="#" class="text-green-600 hover:text-green-500"
                        >Điều khoản sử dụng</a
                      >
                      và
                      <a href="#" class="text-green-600 hover:text-green-500"
                        >Chính sách bảo mật</a
                      ></label
                    >
                    <p
                      v-if="errors.acceptTerms"
                      class="mt-1 text-sm text-red-500"
                    >
                      {{ errors.acceptTerms }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting" class="flex items-center">
                    <LoaderIcon class="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Đang xử lý...
                  </span>
                  <span v-else>Đăng ký</span>
                </button>
              </div>
            </form>
          </div>

          <!-- Login link -->
          <div class="p-6 bg-gray-50 border-t border-gray-200">
            <div class="text-center">
              <p class="text-sm text-gray-600">
                Đã có tài khoản?
                <router-link
                  to="/login"
                  class="font-medium text-green-600 hover:text-green-500"
                >
                  Đăng nhập
                </router-link>
              </p>
            </div>
          </div>
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
          Tài khoản của bạn đã được tạo thành công. Vui lòng kiểm tra email để
          xác nhận tài khoản.
        </p>
        <button
          @click="redirectToLogin"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Đăng nhập ngay
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  LogIn as LogInIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Check as CheckIcon,
  Loader as LoaderIcon,
} from "lucide-vue-next";

// Form state
const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  birthDate: "",
  password: "",
  confirmPassword: "",
  gender: "",
  address: "",
  acceptTerms: false,
});

// UI state
const errors = reactive({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Methods
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function isValidPhone(phone) {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone);
}

function isValidPassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
}

function handleSubmit() {
  // Validate form
  const formErrors = {};

  if (!form.fullName) {
    formErrors.fullName = "Vui lòng nhập họ và tên";
  }

  if (!form.email) {
    formErrors.email = "Vui lòng nhập email";
  } else if (!isValidEmail(form.email)) {
    formErrors.email = "Email không hợp lệ";
  }

  if (!form.phone) {
    formErrors.phone = "Vui lòng nhập số điện thoại";
  } else if (!isValidPhone(form.phone)) {
    formErrors.phone = "Số điện thoại không hợp lệ";
  }

  if (!form.password) {
    formErrors.password = "Vui lòng nhập mật khẩu";
  } else if (!isValidPassword(form.password)) {
    formErrors.password =
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số";
  }

  if (!form.confirmPassword) {
    formErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (form.password !== form.confirmPassword) {
    formErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }

  if (!form.acceptTerms) {
    formErrors.acceptTerms = "Bạn phải đồng ý với điều khoản sử dụng";
  }

  if (Object.keys(formErrors).length > 0) {
    errors.value = formErrors;
    return;
  }

  // Submit form
  isSubmitting.value = true;

  // Simulate API call
  setTimeout(() => {
    isSubmitting.value = false;
    showSuccessModal.value = true;

    // Log form data (in a real app, this would be sent to the server)
    console.log("Form submitted:", form);
  }, 1500);
}

function redirectToLogin() {
  // In a real app, this would redirect to the login page
  showSuccessModal.value = false;
  alert("Redirecting to login page...");
}
</script>
