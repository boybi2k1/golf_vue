<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  RefreshCwIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PrinterIcon,
  SearchIcon,
} from "lucide-vue-next";
import { usePaymentStore } from "../../stores/payment";
import { storeToRefs } from "pinia";

// State
const showDetailsModal = ref(false);
const showInvoiceModal = ref(false);
const selectedPayment = ref({});
const invoicePayment = ref({});
const paymentStore = usePaymentStore();
const { paymentSearch, pagination } = storeToRefs(paymentStore);
// Form and filters
const searchQuery = reactive({
  page: 1,
  size: 10,
  type: "",
  status: "",
  key: "",
  value: "",
  startDate: "",
  endDate: "",
});

// Methods
function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "N/A";
  const date = new Date(dateTimeString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getPaymentTypeText(type) {
  switch (type) {
    case "MEMBERSHIP":
      return "Phí hội viên";
    case "BOOKING":
      return "Đặt sân";
    case "OTHER":
      return "Khác";
    default:
      return type;
  }
}

function getStatusText(status) {
  switch (status) {
    case "COMPLETED":
      return "Đã thanh toán";
    case "PENDING":
      return "Chờ thanh toán";
    case "EXPIRED":
      return "Đã hết hạn";
    case "FAILED":
      return "Thất bại";
    default:
      return status;
  }
}

function getPaymentMethodText(method) {
  switch (method) {
    case "cash":
      return "Tiền mặt";
    case "card":
      return "Thẻ tín dụng/ghi nợ";
    default:
      return method;
  }
}

function getCardTypeText(type) {
  switch (type) {
    case "visa":
      return "Visa";
    case "mastercard":
      return "Mastercard";
    case "amex":
      return "American Express";
    case "jcb":
      return "JCB";
    case "other":
      return "Khác";
    default:
      return type;
  }
}

function getEwalletTypeText(type) {
  switch (type) {
    case "momo":
      return "MoMo";
    case "zalopay":
      return "ZaloPay";
    case "vnpay":
      return "VNPay";
    case "other":
      return "Khác";
    default:
      return type;
  }
}
function handleSearch() {
  // In a real app, this would fetch data from the server based on searchQuery
  paymentStore.searchPayment(searchQuery);
}

function refreshData() {
  searchQuery.page = 1;
  searchQuery.size = 10;
  searchQuery.type = "";
  searchQuery.status = "";
  searchQuery.key = "";
  searchQuery.value = "";
  searchQuery.startDate = "";
  searchQuery.endDate = "";
  paymentStore.searchPayment(searchQuery);
}

function viewPaymentDetails(payment) {
  selectedPayment.value = { ...payment };
  showDetailsModal.value = true;
}

function printInvoice(payment) {
  invoicePayment.value = { ...payment };
  showInvoiceModal.value = true;
}

function printInvoiceContent() {
  const invoiceContent = document.getElementById("invoice-content");
  if (invoiceContent) {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(
      "<html><head><title>Hóa đơn thanh toán</title></head><body>"
    );
    printWindow.document.write(invoiceContent.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  }
}
onMounted(() => {
  refreshData();
});

console.log(paymentSearch.value);
</script>

<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="bg-green-50 min-h-screen p-4">
      <div
        class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
      >
        <h1 class="text-xl font-semibold text-green-800">Quản Lý Thanh Toán</h1>
        <div class="flex gap-2">
          <button
            @click="refreshData"
            class="flex items-center gap-2 border border-green-700 text-green-700 hover:bg-green-50 px-4 py-2 rounded-md"
          >
            <RefreshCwIcon class="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <!-- Filters -->
        <div class="lg:col-span-full">
          <div class="bg-white rounded-lg shadow p-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Loại thanh toán</label
                >
                <select
                  v-model="searchQuery.type"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Tất cả loại</option>
                  <option value="MEMBERSHIP">Phí hội viên</option>
                  <option value="BOOKING">Đặt sân</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Trạng thái</label
                >
                <select
                  v-model="searchQuery.status"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="COMPLETED">Đã thanh toán</option>
                  <option value="PENDING">Chờ thanh toán</option>
                  <option value="FAILED">Thanh toán lỗi</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Từ ngày</label
                >
                <input
                  type="date"
                  v-model="searchQuery.startDate"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Đến ngày</label
                >
                <input
                  type="date"
                  v-model="searchQuery.endDate"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tìm kiếm theo</label
                >
                <select
                  v-model="searchQuery.key"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Tất cả</option>
                  <option value="name">Tên dịch vụ</option>
                  <option value="code">Mã dịch vụ</option>
                  <option value="status">Trạng thái</option>
                </select>
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tìm kiếm</label
                >
                <div class="relative">
                  <SearchIcon
                    class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                  />
                  <input
                    type="text"
                    v-model="searchQuery.value"
                    placeholder="Mã thanh toán, khách hàng..."
                    class="w-full border border-gray-300 rounded-md pl-5 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="mt-4 flex justify-end">
                <button
                  @click="handleSearch"
                  class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payments List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">
            Danh sách thanh toán
          </h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Mã thanh toán
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách hàng
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Loại
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số tiền
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Phương thức
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ngày thanh toán
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
                v-for="payment in paymentSearch"
                :key="payment.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >
                  {{ payment.code }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 flex-shrink-0 mr-3">
                      <template v-if="payment.user.avatar">
                        <img
                          :src="payment.user.avatar"
                          class="h-10 w-10 rounded-full object-cover"
                          alt="Avatar"
                        />
                      </template>
                      <template v-else>
                        <div
                          class="h-10 w-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg select-none"
                        >
                          {{ payment.user.fullName.charAt(0).toUpperCase() }}
                        </div>
                      </template>
                    </div>
                    <div class="flex flex-col">
                      <div class="text-sm font-medium text-gray-900">
                        {{ payment.user.fullName }}
                      </div>
                      <div class="text-xs text-gray-500 ml-1">
                        {{ payment.user.phone }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getPaymentTypeText(payment.type) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  :class="
                    payment.status === 'refunded'
                      ? 'text-red-600'
                      : 'text-green-600'
                  "
                >
                  {{ formatCurrency(payment.amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getPaymentMethodText(payment.paymentMethod) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(payment.createdAt) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-green-100 text-green-800':
                        payment.status === 'COMPLETED',
                      'bg-yellow-100 text-yellow-800':
                        payment.status === 'PENDING',
                      'bg-red-100 text-red-800': payment.status === 'FAILED',
                      'bg-purple-100 text-purple-800':
                        payment.status === 'EXPIRED',
                    }"
                  >
                    {{ getStatusText(payment.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewPaymentDetails(payment)"
                      class="text-gray-500 hover:text-gray-700"
                    >
                      <EyeIcon class="w-5 h-5" />
                    </button>
                    <button
                      @click="printInvoice(payment)"
                      class="text-green-500 hover:text-green-700"
                    >
                      <PrinterIcon class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="paymentSearch.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Không có dữ liệu thanh toán
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-end">
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="searchQuery.page--"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <span
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  Trang {{ pagination.page }} / {{ pagination.totalPages }}
                </span>
                <button
                  @click="searchQuery.page++"
                  :disabled="pagination.page === pagination.totalPages"
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
  </main>
</template>
