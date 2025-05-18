<template>
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

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
      <!-- Filters -->
      <div class="lg:col-span-full">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Loại thanh toán</label
              >
              <select
                v-model="filters.type"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả loại</option>
                <option value="membership">Phí hội viên</option>
                <option value="booking">Đặt sân</option>
                <option value="service">Dịch vụ</option>
                <option value="event">Sự kiện</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Trạng thái</label
              >
              <select
                v-model="filters.status"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="completed">Đã thanh toán</option>
                <option value="pending">Chờ thanh toán</option>
                <option value="cancelled">Đã hủy</option>
                <option value="refunded">Đã hoàn tiền</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phương thức</label
              >
              <select
                v-model="filters.method"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Tất cả phương thức</option>
                <option value="cash">Tiền mặt</option>
                <option value="card">Thẻ tín dụng/ghi nợ</option>
                <option value="transfer">Chuyển khoản</option>
                <option value="ewallet">Ví điện tử</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tìm kiếm</label
              >
              <div class="relative">
                <SearchIcon
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
                />
                <input
                  type="text"
                  v-model="filters.search"
                  placeholder="Mã thanh toán, khách hàng..."
                  class="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Từ ngày</label
              >
              <input
                type="date"
                v-model="filters.dateFrom"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Đến ngày</label
              >
              <input
                type="date"
                v-model="filters.dateTo"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payments List -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Danh sách thanh toán</h2>
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
              v-for="payment in filteredPayments"
              :key="payment.id"
              class="hover:bg-gray-50"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ payment.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium text-gray-900">
                    {{ payment.customerName }}
                  </div>
                  <div class="text-xs text-gray-500 ml-1">
                    ({{ payment.customerId }})
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
                {{ getPaymentMethodText(payment.method) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(payment.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="{
                    'px-2 py-1 text-xs font-medium rounded-full': true,
                    'bg-green-100 text-green-800':
                      payment.status === 'completed',
                    'bg-yellow-100 text-yellow-800':
                      payment.status === 'pending',
                    'bg-red-100 text-red-800': payment.status === 'cancelled',
                    'bg-purple-100 text-purple-800':
                      payment.status === 'refunded',
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
            <tr v-if="filteredPayments.length === 0">
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
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-700">
              Hiển thị
              <span class="font-medium">{{ filteredPayments.length }}</span>
              trong số
              <span class="font-medium">{{ payments.length }}</span> kết quả
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <span
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
              >
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

    <!-- Payment Details Modal -->
    <div
      v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Chi tiết thanh toán
          </h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-500 hover:text-gray-700"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
        <div class="px-6 py-4">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900">
                Mã thanh toán: {{ selectedPayment.id }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ getPaymentTypeText(selectedPayment.type) }}
              </p>
            </div>
            <span
              :class="{
                'px-2 py-1 text-sm font-medium rounded-full': true,
                'bg-green-100 text-green-800':
                  selectedPayment.status === 'completed',
                'bg-yellow-100 text-yellow-800':
                  selectedPayment.status === 'pending',
                'bg-red-100 text-red-800':
                  selectedPayment.status === 'cancelled',
                'bg-purple-100 text-purple-800':
                  selectedPayment.status === 'refunded',
              }"
            >
              {{ getStatusText(selectedPayment.status) }}
            </span>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Số tiền:</span>
              <span
                class="text-lg font-semibold"
                :class="
                  selectedPayment.status === 'refunded'
                    ? 'text-red-600'
                    : 'text-green-600'
                "
              >
                {{ formatCurrency(selectedPayment.amount) }}
              </span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Phương thức:</span>
              <span class="text-gray-900">{{
                getPaymentMethodText(selectedPayment.method)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày thanh toán:</span>
              <span class="text-gray-900">{{
                formatDate(selectedPayment.date)
              }}</span>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thông tin khách hàng
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Tên khách hàng:</span>
                <span class="text-gray-900">{{
                  selectedPayment.customerName
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Mã khách hàng:</span>
                <span class="text-gray-900">{{
                  selectedPayment.customerId
                }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedPayment.method === 'card'" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thông tin thẻ
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Loại thẻ:</span>
                <span class="text-gray-900">{{
                  getCardTypeText(selectedPayment.cardType)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Số thẻ:</span>
                <span class="text-gray-900"
                  >**** **** **** {{ selectedPayment.cardLastFour }}</span
                >
              </div>
            </div>
          </div>

          <div v-if="selectedPayment.method === 'transfer'" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thông tin chuyển khoản
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <p class="text-gray-900">{{ selectedPayment.transferInfo }}</p>
            </div>
          </div>

          <div v-if="selectedPayment.method === 'ewallet'" class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thông tin ví điện tử
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between">
                <span class="text-gray-600">Loại ví:</span>
                <span class="text-gray-900">{{
                  getEwalletTypeText(selectedPayment.ewalletType)
                }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-2">
              Thông tin tham chiếu
            </h4>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Mã tham chiếu:</span>
                <span class="text-gray-900">{{
                  selectedPayment.referenceId || "Không có"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Người tạo:</span>
                <span class="text-gray-900">{{
                  selectedPayment.createdBy || "Không có"
                }}</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Ghi chú</h4>
            <p class="text-gray-900 bg-gray-50 p-3 rounded-md">
              {{ selectedPayment.notes || "Không có ghi chú" }}
            </p>
          </div>

          <div
            v-if="selectedPayment.history && selectedPayment.history.length > 0"
            class="border-t pt-4"
          >
            <h4 class="text-sm font-medium text-gray-900 mb-3">
              Lịch sử thanh toán
            </h4>
            <div class="space-y-3">
              <div
                v-for="(item, index) in selectedPayment.history"
                :key="index"
                class="flex items-start"
              >
                <div
                  class="flex-shrink-0 h-4 w-4 rounded-full mt-0.5 bg-blue-500"
                ></div>
                <div class="ml-3">
                  <p class="text-sm text-gray-900">{{ item.action }}</p>
                  <p class="text-xs text-gray-500">
                    {{ formatDateTime(item.date) }} bởi {{ item.by }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            @click="printInvoice(selectedPayment)"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
          >
            In hóa đơn
          </button>
        </div>
      </div>
    </div>

    <!-- Invoice Modal -->
    <div
      v-if="showInvoiceModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center border-b px-6 py-4">
          <h2 class="text-xl font-semibold text-green-800">
            Hóa đơn thanh toán
          </h2>
          <div class="flex space-x-2">
            <button
              @click="printInvoiceContent"
              class="text-gray-500 hover:text-gray-700"
            >
              <PrinterIcon class="w-5 h-5" />
            </button>
            <button
              @click="showInvoiceModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div id="invoice-content" class="px-6 py-4">
          <div class="text-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">
              GOLF COURSE MANAGEMENT
            </h3>
            <p class="text-gray-600">123 Đường Golf, Quận 1, TP.HCM</p>
            <p class="text-gray-600">
              Email: info@golfcourse.com | SĐT: 028 1234 5678
            </p>
          </div>

          <div class="text-center mb-6">
            <h4 class="text-lg font-bold text-gray-900">HÓA ĐƠN THANH TOÁN</h4>
            <p class="text-gray-600">Mã hóa đơn: {{ invoicePayment.id }}</p>
            <p class="text-gray-600">
              Ngày: {{ formatDate(invoicePayment.date) }}
            </p>
          </div>

          <div class="mb-6">
            <div class="flex justify-between mb-1">
              <span class="font-medium">Khách hàng:</span>
              <span>{{ invoicePayment.customerName }}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="font-medium">Mã khách hàng:</span>
              <span>{{ invoicePayment.customerId }}</span>
            </div>
          </div>

          <div class="mb-6">
            <table class="min-w-full border border-gray-200">
              <thead>
                <tr class="bg-gray-50">
                  <th class="py-2 px-4 border-b border-gray-200 text-left">
                    Mô tả
                  </th>
                  <th class="py-2 px-4 border-b border-gray-200 text-right">
                    Số tiền
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="py-2 px-4 border-b border-gray-200">
                    {{ getPaymentTypeText(invoicePayment.type) }}
                  </td>
                  <td class="py-2 px-4 border-b border-gray-200 text-right">
                    {{ formatCurrency(invoicePayment.amount) }}
                  </td>
                </tr>
                <tr v-if="invoicePayment.referenceId">
                  <td
                    class="py-2 px-4 border-b border-gray-200 text-gray-500 text-sm"
                  >
                    Mã tham chiếu: {{ invoicePayment.referenceId }}
                  </td>
                  <td class="py-2 px-4 border-b border-gray-200"></td>
                </tr>
                <tr>
                  <td class="py-2 px-4 font-bold text-right">Tổng cộng:</td>
                  <td class="py-2 px-4 font-bold text-right">
                    {{ formatCurrency(invoicePayment.amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="mb-6">
            <div class="flex justify-between mb-1">
              <span class="font-medium">Phương thức thanh toán:</span>
              <span>{{ getPaymentMethodText(invoicePayment.method) }}</span>
            </div>
            <div class="flex justify-between mb-1">
              <span class="font-medium">Trạng thái:</span>
              <span>{{ getStatusText(invoicePayment.status) }}</span>
            </div>
          </div>

          <div class="mb-6 text-sm text-gray-600">
            <p>Ghi chú: {{ invoicePayment.notes || "Không có" }}</p>
          </div>

          <div class="flex justify-between mt-10">
            <div class="text-center">
              <p class="font-medium">Người thanh toán</p>
              <p class="text-gray-500 text-sm mt-10">(Ký và ghi rõ họ tên)</p>
            </div>
            <div class="text-center">
              <p class="font-medium">Người nhận</p>
              <p class="text-gray-500 text-sm mt-10">(Ký và ghi rõ họ tên)</p>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 border-t px-6 py-4">
          <button
            @click="showInvoiceModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Đóng
          </button>
          <button
            @click="printInvoiceContent"
            class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium"
          >
            In hóa đơn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import {
  RefreshCwIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PrinterIcon,
  XIcon,
} from "lucide-vue-next";

// State
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showDetailsModal = ref(false);
const showInvoiceModal = ref(false);
const selectedPayment = ref({});
const invoicePayment = ref({});

// Form and filters
const filters = reactive({
  type: "",
  status: "",
  method: "",
  search: "",
  dateFrom: "",
  dateTo: "",
});

// Mock data for customers (members)
const customers = ref([
  { id: "MEM001", name: "Nguyễn Văn A" },
  { id: "MEM002", name: "Trần Thị B" },
  { id: "MEM003", name: "Lê Văn C" },
  { id: "MEM004", name: "Phạm Thị D" },
  { id: "MEM005", name: "Hoàng Văn E" },
  { id: "MEM006", name: "Vũ Thị F" },
]);

// Mock data
const payments = ref([
  {
    id: "PAY001",
    type: "membership",
    status: "completed",
    customerId: "MEM001",
    customerName: "Nguyễn Văn A",
    amount: 25000000,
    method: "transfer",
    date: "2025-01-15",
    referenceId: "MEM001-2025",
    notes: "Thanh toán phí hội viên năm 2025",
    transferInfo: "Ngân hàng VCB, STK: 1234567890",
    createdBy: "Admin",
    history: [
      { action: "Tạo thanh toán", date: "2025-01-15T10:30:00", by: "Admin" },
      {
        action: "Cập nhật trạng thái: Đã thanh toán",
        date: "2025-01-15T14:20:00",
        by: "Admin",
      },
    ],
  },
  {
    id: "PAY002",
    type: "booking",
    status: "completed",
    customerId: "MEM002",
    customerName: "Trần Thị B",
    amount: 2500000,
    method: "card",
    date: "2025-04-10",
    referenceId: "BOOK123",
    notes: "Thanh toán đặt sân 18 hố",
    cardLastFour: "4567",
    cardType: "visa",
    createdBy: "Receptionist",
    history: [
      {
        action: "Tạo thanh toán",
        date: "2025-04-10T08:15:00",
        by: "Receptionist",
      },
      {
        action: "Cập nhật trạng thái: Đã thanh toán",
        date: "2025-04-10T08:20:00",
        by: "Receptionist",
      },
    ],
  },
  {
    id: "PAY003",
    type: "service",
    status: "completed",
    customerId: "MEM003",
    customerName: "Lê Văn C",
    amount: 1500000,
    method: "cash",
    date: "2025-04-15",
    referenceId: "SRV456",
    notes: "Thanh toán dịch vụ thuê gậy và xe điện",
    createdBy: "Staff",
    history: [
      { action: "Tạo thanh toán", date: "2025-04-15T14:30:00", by: "Staff" },
    ],
  },
  {
    id: "PAY004",
    type: "event",
    status: "pending",
    customerId: "MEM004",
    customerName: "Phạm Thị D",
    amount: 15000000,
    method: "transfer",
    date: "2025-04-20",
    referenceId: "EVT789",
    notes: "Đặt cọc tổ chức sự kiện gia đình",
    transferInfo: "Đang chờ xác nhận từ ngân hàng",
    createdBy: "Manager",
    history: [
      { action: "Tạo thanh toán", date: "2025-04-18T09:45:00", by: "Manager" },
    ],
  },
  {
    id: "PAY005",
    type: "booking",
    status: "cancelled",
    customerId: "MEM005",
    customerName: "Hoàng Văn E",
    amount: 3000000,
    method: "card",
    date: "2025-04-05",
    referenceId: "BOOK456",
    notes: "Hủy đặt sân do thời tiết xấu",
    cardLastFour: "7890",
    cardType: "mastercard",
    createdBy: "Receptionist",
    history: [
      {
        action: "Tạo thanh toán",
        date: "2025-04-01T16:20:00",
        by: "Receptionist",
      },
      {
        action: "Cập nhật trạng thái: Đã hủy",
        date: "2025-04-05T08:30:00",
        by: "Manager",
      },
    ],
  },
  {
    id: "PAY006",
    type: "service",
    status: "refunded",
    customerId: "MEM006",
    customerName: "Vũ Thị F",
    amount: 850000,
    method: "ewallet",
    date: "2025-04-12",
    referenceId: "SRV789",
    notes: "Hoàn tiền dịch vụ spa do lịch bận",
    ewalletType: "momo",
    createdBy: "Staff",
    history: [
      { action: "Tạo thanh toán", date: "2025-04-10T10:15:00", by: "Staff" },
      {
        action: "Cập nhật trạng thái: Đã hoàn tiền",
        date: "2025-04-12T14:30:00",
        by: "Manager",
      },
    ],
  },
]);

// Computed properties
const filteredPayments = computed(() => {
  let result = payments.value;

  if (filters.type) {
    result = result.filter((payment) => payment.type === filters.type);
  }

  if (filters.status) {
    result = result.filter((payment) => payment.status === filters.status);
  }

  if (filters.method) {
    result = result.filter((payment) => payment.method === filters.method);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (payment) =>
        payment.id.toLowerCase().includes(searchLower) ||
        payment.customerName.toLowerCase().includes(searchLower) ||
        payment.customerId.toLowerCase().includes(searchLower) ||
        (payment.referenceId &&
          payment.referenceId.toLowerCase().includes(searchLower))
    );
  }

  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    result = result.filter((payment) => new Date(payment.date) >= fromDate);
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of the day
    result = result.filter((payment) => new Date(payment.date) <= toDate);
  }

  // Sort by date (newest first)
  result = result.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  // Pagination
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  return result.slice(startIndex, startIndex + itemsPerPage.value);
});

const totalPages = computed(() => {
  return Math.ceil(payments.value.length / itemsPerPage.value) || 1;
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
    case "membership":
      return "Phí hội viên";
    case "booking":
      return "Đặt sân";
    case "service":
      return "Dịch vụ";
    case "event":
      return "Sự kiện";
    case "other":
      return "Khác";
    default:
      return type;
  }
}

function getStatusText(status) {
  switch (status) {
    case "completed":
      return "Đã thanh toán";
    case "pending":
      return "Chờ thanh toán";
    case "cancelled":
      return "Đã hủy";
    case "refunded":
      return "Đã hoàn tiền";
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
    case "transfer":
      return "Chuyển khoản";
    case "ewallet":
      return "Ví điện tử";
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

function getPaymentsCount(status) {
  return payments.value.filter((payment) => payment.status === status).length;
}

function getTotalRevenue() {
  return payments.value
    .filter((payment) => payment.status === "completed")
    .reduce((total, payment) => total + payment.amount, 0);
}

function refreshData() {
  // In a real app, this would fetch fresh data from the server
  console.log("Refreshing data...");
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
</script>
