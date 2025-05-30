<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-white shadow-lg overflow-hidden">
      <!-- Banner và tiêu đề -->
      <div class="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div class="px-8 py-6">
          <h1 class="text-2xl font-bold mb-2">Đăng Ký Hội Viên</h1>
          <p class="text-green-100 text-base">
            Trở thành hội viên để nhận nhiều ưu đãi đặc biệt và trải nghiệm dịch
            vụ tốt nhất từ chúng tôi
          </p>
        </div>
      </div>

      <!-- Danh sách membership types -->
      <div class="px-8 pb-12 pt-6">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
          ></div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="membershipTypes.length === 0"
          class="max-w-md mx-auto bg-white border border-gray-200 rounded-lg p-8 text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            Không có gói hội viên
          </h3>
          <p class="mt-2 text-gray-500">
            Hiện tại chưa có gói hội viên nào được cung cấp.
          </p>
        </div>

        <!-- Membership types list -->
        <div v-else class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="type in membershipTypes"
              :key="type.id"
              class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <!-- Card header -->
              <div
                class="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white"
              >
                <h2 class="text-2xl font-bold">{{ type.name }}</h2>
                <div class="mt-4 flex items-baseline">
                  <span class="text-4xl font-extrabold">{{
                    formatCurrency(type.price)
                  }}</span>
                  <span class="ml-1 text-xl font-medium text-green-100">
                    {{ type.duration ? `/ ${type.duration} tháng` : "" }}
                  </span>
                </div>
              </div>

              <!-- Card body -->
              <div class="p-6 flex-grow">
                <!-- Benefits -->
                <h3 class="text-lg font-semibold text-gray-900 mb-3">
                  Quyền lợi hội viên:
                </h3>
                <ul class="space-y-3">
                  <li
                    v-for="(benefit, index) in type.benefits"
                    :key="index"
                    class="flex items-start"
                  >
                    <svg
                      class="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-gray-700">{{ benefit }}</span>
                  </li>
                  <li
                    v-if="!type.benefits || type.benefits.length === 0"
                    class="text-gray-500 italic"
                  >
                    Không có quyền lợi được liệt kê
                  </li>
                </ul>
              </div>

              <!-- Card footer -->
              <div class="p-6 border-t border-gray-100">
                <template
                  v-if="
                    membershipCurrent &&
                    membershipCurrent.membershipTypeId === type.id
                  "
                >
                  <button
                    disabled
                    class="w-full bg-gray-300 text-gray-600 py-3 px-4 rounded-lg font-medium cursor-not-allowed"
                  >
                    Gói hiện tại
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="openConfirmDialog(type)"
                    class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    Đăng ký ngay
                  </button>
                </template>
              </div>
              <!-- Dialog xác nhận đăng ký hội viên -->
              <div
                v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
              >
                <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
                  <h2 class="text-xl font-bold text-gray-800 mb-4">
                    Xác nhận đăng ký hội viên
                  </h2>
                  <p class="mb-6 text-gray-700">
                    Bạn có chắc chắn muốn đăng ký gói
                    <span class="font-semibold text-green-700">{{
                      selectedType?.name
                    }}</span>
                    với giá
                    <span class="font-semibold">{{
                      formatCurrency(selectedType?.price)
                    }}</span>
                    không?
                  </p>
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="showModal = false"
                      class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Hủy
                    </button>
                    <button
                      @click="handleConfirmRegistration"
                      :disabled="isSubmitting"
                      class="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    >
                      <span v-if="isSubmitting">Đang đăng ký...</span>
                      <span v-else>Xác nhận</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success notification -->
        <div
          v-if="showSuccessNotification"
          class="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center"
        >
          <svg
            class="h-6 w-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Đăng ký hội viên thành công! Chờ xác nhận</span>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useMembershipTypeStore } from "@/stores/membership_type";
import { useMembershipStore } from "../../stores/membership";
import { useAuthStore } from "../../stores/auth";
import { usePaymentStore } from "../../stores/payment";
import { useGuestStore } from "../../stores/guest";

//store
const membershipTypeStore = useMembershipTypeStore();
const membershipStore = useMembershipStore();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const guestStore = useGuestStore(); // Assuming you have a guest store for guest-related operations
const { user } = storeToRefs(authStore);

const { membershipTypes, loading, error } = storeToRefs(membershipTypeStore);
const { membershipCurrent } = storeToRefs(membershipStore);
// Modal xác nhận đăng ký
const showModal = ref(false);
const selectedType = ref(null);
const isSubmitting = ref(false);
const showSuccessNotification = ref(false);

// Load membership types on component mount

// Format currency
function formatCurrency(value) {
  if (typeof value !== "number") return value;
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// Mở dialog xác nhận đăng ký
function openConfirmDialog(type) {
  selectedType.value = type;
  showModal.value = true;
}

// Xác nhận đăng ký membership và thanh toán qua VNPay
async function handleConfirmRegistration() {
  if (!selectedType.value) return;
  isSubmitting.value = true;
  const data = {
    membershipTypeId: selectedType.value.id,
    userId: user.value.id,
  };
  try {
    // Đăng ký membership, nhận về membershipId (nếu backend trả về)
    const membership = await membershipStore.registerMembership(data);
    // Gọi API tạo thanh toán VNPay
    const guest = await guestStore.getGuestByUserId(user.value.id);
    const paymentData = {
      userId: guest.id,
      referenceId:
        membership?.id || (membership && membership.data && membership.data.id),
      amount: selectedType.value.price,
      type: "MEMBERSHIP",
      status: "PENDING",
      paymentMethod: "VNPay",
    };
    // Nếu backend trả về paymentUrl, chuyển hướng
    const paymentResponse = await paymentStore.createPayment(paymentData);
    if (paymentResponse && paymentResponse.paymentUrl) {
      window.location.href = paymentResponse.paymentUrl;
    } else {
      showSuccessNotification.value = true;
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 3000);
    }
    showModal.value = false;
  } catch (err) {
    console.error("Error registering membership or payment:", err);
  } finally {
    isSubmitting.value = false;
  }
}

function getMemberShipCurrent() {
  if (!user.value || !user.value.id) return null;
  const param = {
    userId: user.value.id,
    status: "ACTIVE",
  };
  return membershipStore.getCurrentMembership({ param });
}

onMounted(() => {
  membershipTypeStore.getAllMembershipTypes();
  authStore.fetchUser();
  getMemberShipCurrent();
});
// funcntion check use hien tai da dang ky membership hay chua
</script>
