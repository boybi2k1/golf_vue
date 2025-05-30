<template>
  <div class="flex flex-1 items-start justify-center min-h-screen bg-gray-100 px-4 pt-12 md:pt-20">
    <div
      class="relative bg-white rounded-xl shadow-xl w-full max-w-lg px-6 py-8 text-center border-t-8 transition-all"
      :class="paymentStatus === 'success' ? 'border-green-500' : 'border-red-500'"
      style="margin-top:0;"
    >
      <!-- Close button -->
      <button
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl focus:outline-none"
        @click="$router.push('/')"
      >
        &times;
      </button>

      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img
          src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
          alt="VNPay Logo"
          class="h-10"
        />
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="py-8">
        <svg
          class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4"
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
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p class="text-blue-600 font-semibold">Đang kiểm tra kết quả thanh toán...</p>
      </div>

      <!-- Payment result -->
      <div v-else>
        <transition name="fade">
          <div v-if="paymentStatus === 'success'" class="flex flex-col items-center">
            <div class="bg-green-100 p-4 rounded-full mb-4">
              <svg
                class="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-green-700 mb-1">Thanh toán thành công!</h2>
            <p class="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ.</p>
            <p class="text-sm text-gray-500 mt-1">Mã giao dịch: {{ transactionId }}</p>
            <router-link
              to="/"
              class="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-md font-medium shadow hover:bg-green-700 transition"
            >
              Về trang chủ
            </router-link>
          </div>

          <div v-else class="flex flex-col items-center">
            <div class="bg-red-100 p-4 rounded-full mb-4">
              <svg
                class="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-red-600 mb-1">Thanh toán thất bại hoặc bị huỷ!</h2>
            <p class="text-sm text-gray-500 mt-1">Mã giao dịch: {{ transactionId }}</p>
            <router-link
              to="/"
              class="mt-4 inline-block px-6 py-2 bg-gray-500 text-white rounded-md font-medium shadow hover:bg-gray-600 transition"
            >
              Về trang chủ
            </router-link>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const paymentStatus = ref("");
const loading = ref(true);
const transactionId = computed(() => route.query.vnp_TxnRef || route.query.transactionId || "");
const queryParams = route.query;

const checkPaymentStatus = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/v1/payment/vnpay-callback", {
      params: queryParams,
    });
    const data = res.data?.data;
    paymentStatus.value = data && data.code === "00" ? "success" : "fail";
  } catch (err) {
    console.error("Lỗi xác minh giao dịch:", err);
    paymentStatus.value = "fail";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  checkPaymentStatus();
});
</script>
