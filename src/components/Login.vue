<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

// Form state
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const isLoading = ref(false);

// Error handling
const errorMessage = ref("");
const emailError = ref("");
const passwordError = ref("");

// Store & router
const authStore = useAuthStore();
const router = useRouter();

// Login handler
const handleLogin = async () => {
  // Reset lỗi
  errorMessage.value = "";
  emailError.value = "";
  passwordError.value = "";

  // Validate input
  let isValid = true;

  if (!email.value) {
    emailError.value = "Vui lòng nhập email hoặc tên đăng nhập";
    isValid = false;
  }

  if (!password.value) {
    passwordError.value = "Vui lòng nhập mật khẩu";
    isValid = false;
  } else if (password.value.length < 1) {
    passwordError.value = "Mật khẩu phải có ít nhất 6 ký tự";
    isValid = false;
  }

  if (!isValid) return;

  try {
    isLoading.value = true;
    await authStore.login(email.value, password.value);
    const role = authStore.user.role;
    if (role === "ADMIN") {
      router.push("/admin"); // Đăng nhập thành công → về trang admin
    } else if (role === "MEMBER") {
      console.log("Đăng nhập thành công với vai trò MEMBER");
      router.push("/booking"); // Đăng nhập thành công → về trang user
    } else {
      throw new Error("Vai trò không hợp lệ");
    }
  } catch (error) {
    errorMessage.value = error.message || "Đăng nhập thất bại";
  } finally {
    isLoading.value = false;
  }
};

//login voi google
const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle(); // sẽ tự redirect
  } catch (error) {
    errorMessage.value = error.message || "Không thể đăng nhập với Google";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  const role = url.searchParams.get("role");

  if (token && role) {
    authStore.token = token;
    authStore.role = role;
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    
    authStore.fetchUser().then(() => {
      if (role === "ADMIN") router.push("/admin");
      else if (role === "MEMBER") router.push("/booking");
      else router.push("/");
    });
  }
});

</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <!-- Phần hình ảnh bên trái (ẩn trên mobile) -->
    <div class="hidden md:flex md:w-1/2 bg-green-700 relative overflow-hidden">
      <div
        class="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/50"
      ></div>
      <img
        src="https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        alt="Golf Course"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div
        class="relative z-10 flex flex-col justify-center items-center h-full text-white p-8"
      >
        <h1 class="text-4xl font-bold mb-4">Golf Pro Management</h1>
        <p class="text-xl max-w-md text-center">
          Hệ thống quản lý và đặt lịch sân golf chuyên nghiệp
        </p>
      </div>
    </div>

    <!-- Phần form đăng nhập bên phải -->
    <div
      class="flex-1 flex flex-col justify-center items-center p-6 md:p-10 bg-white"
    >
      <!-- Logo hiển thị trên mobile -->
      <div class="md:hidden flex flex-col items-center mb-8">
        <div
          class="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-golf"
          >
            <path d="M12 18v-6"></path>
            <path d="M8 18v-1"></path>
            <path d="M16 18v-1"></path>
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
            <path d="M7 20h10"></path>
            <path d="M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
            <path d="M17 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800">Golf Pro Management</h1>
      </div>

      <div class="w-full max-w-md">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
          <p class="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Thông báo lỗi -->
          <div
            v-if="errorMessage"
            class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg"
          >
            {{ errorMessage }}
          </div>

          <!-- Email/Username field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-medium text-gray-700"
              >Email hoặc tên đăng nhập</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                >
                  <path
                    d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"
                  ></path>
                  <polyline points="15,9 18,9 18,11"></polyline>
                  <path
                    d="M6 10V5.5C6 3.5 7.5 2 9.5 2h5C16.5 2 18 3.5 18 5.5V10"
                  ></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="text"
                required
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500':
                    emailError,
                }"
                placeholder="Nhập email hoặc tên đăng nhập"
              />
            </div>
            <p v-if="emailError" class="text-red-600 text-sm mt-1">
              {{ emailError }}
            </p>
          </div>

          <!-- Password field -->
          <div class="space-y-2">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Mật khẩu</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                >
                  <rect
                    width="18"
                    height="11"
                    x="3"
                    y="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                :class="{
                  'border-red-300 focus:ring-red-500 focus:border-red-500':
                    passwordError,
                }"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path
                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                  ></path>
                  <path
                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                  ></path>
                  <line x1="2" x2="22" y1="2" y2="22"></line>
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-red-600 text-sm mt-1">
              {{ passwordError }}
            </p>
          </div>

          <!-- Remember me & Forgot password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center"></div>
            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-green-600 hover:text-green-500"
                >Quên mật khẩu?</a
              >
            </div>
          </div>

          <!-- Login button -->
          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="isLoading"
            >
              <svg
                v-if="isLoading"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ isLoading ? "Đang đăng nhập..." : "Đăng nhập" }}
            </button>
          </div>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-600">hoặc</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Google login button (Facebook removed) -->
        <div class="flex justify-center">
          <button
            @click="handleGoogleLogin"
            type="button"
            class="flex items-center justify-center py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg
              class="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập với Google
          </button>
        </div>

        <!-- Sign up link -->
        <div class="mt-8 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <a
              href="/register"
              class="font-medium text-green-600 hover:text-green-500"
              >Đăng ký ngay</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
