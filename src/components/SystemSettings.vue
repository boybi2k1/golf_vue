<template>
  <div class="bg-green-50 min-h-screen p-4">
    <div
      class="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center"
    >
      <h1 class="text-xl font-semibold text-green-800">Cài Đặt Hệ Thống</h1>
      <div class="flex gap-2"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <!-- Settings Categories -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow p-4">
          <h2 class="text-lg font-medium text-gray-900 mb-4">
            Danh mục cài đặt
          </h2>
          <div class="space-y-1">
            <button
              v-for="category in settingCategories"
              :key="category.id"
              @click="selectCategory(category)"
              :class="{
                'w-full flex items-center p-3 rounded-md transition-colors': true,
                'bg-green-50 text-green-800 border border-green-200':
                  selectedCategoryId === category.id,
                'hover:bg-gray-50 text-gray-700':
                  selectedCategoryId !== category.id,
              }"
            >
              <component :is="category.icon" class="w-5 h-5 mr-3" />
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-lg shadow p-4">
          <div v-if="!selectedCategory" class="text-center py-8 text-gray-500">
            <CogIcon class="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Chọn danh mục cài đặt
            </h3>
            <p>
              Vui lòng chọn một danh mục từ menu bên trái để xem và chỉnh sửa
              cài đặt.
            </p>
          </div>

          <div v-else>
            <h2 class="text-lg font-medium text-gray-900 mb-4">
              {{ selectedCategory.name }}
            </h2>

            <!-- General Settings -->
            <div v-if="selectedCategory.id === 'general'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Tên sân golf</label
                  >
                  <input
                    type="text"
                    v-model="settings.general.courseName"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Địa chỉ</label
                  >
                  <input
                    type="text"
                    v-model="settings.general.address"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Số điện thoại</label
                  >
                  <input
                    type="tel"
                    v-model="settings.general.phone"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Email</label
                  >
                  <input
                    type="email"
                    v-model="settings.general.email"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Website</label
                  >
                  <input
                    type="url"
                    v-model="settings.general.website"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Logo URL</label
                >
                <input
                  type="text"
                  v-model="settings.general.logoUrl"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Múi giờ</label
                  >
                  <select
                    v-model="settings.general.timezone"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="Asia/Ho_Chi_Minh">
                      Hồ Chí Minh (GMT+7)
                    </option>
                    <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                    <option value="Asia/Singapore">Singapore (GMT+8)</option>
                    <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Định dạng ngày</label
                  >
                  <select
                    v-model="settings.general.dateFormat"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Đơn vị tiền tệ</label
                >
                <select
                  v-model="settings.general.currency"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="VND">Việt Nam Đồng (VND)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>

            <!-- Booking Settings -->
            <div v-if="selectedCategory.id === 'booking'" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giờ mở cửa</label
                  >
                  <input
                    type="time"
                    v-model="settings.booking.openingTime"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Giờ đóng cửa</label
                  >
                  <input
                    type="time"
                    v-model="settings.booking.closingTime"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Thời gian đặt trước tối thiểu (giờ)</label
                  >
                  <input
                    type="number"
                    v-model="settings.booking.minAdvanceHours"
                    min="0"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Thời gian đặt trước tối đa (ngày)</label
                  >
                  <input
                    type="number"
                    v-model="settings.booking.maxAdvanceDays"
                    min="1"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Khoảng thời gian đặt sân (phút)</label
                  >
                  <select
                    v-model="settings.booking.timeSlotInterval"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="15">15 phút</option>
                    <option value="30">30 phút</option>
                    <option value="60">60 phút</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Thời gian chơi mặc định (phút)</label
                  >
                  <select
                    v-model="settings.booking.defaultPlayTime"
                    class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="120">2 giờ (9 hố)</option>
                    <option value="240">4 giờ (18 hố)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Chính sách hủy đặt sân</label
                >
                <select
                  v-model="settings.booking.cancellationPolicy"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="free_24h">Miễn phí trước 24 giờ</option>
                  <option value="free_48h">Miễn phí trước 48 giờ</option>
                  <option value="charge_50_24h">
                    Phí 50% nếu hủy trong vòng 24 giờ
                  </option>
                  <option value="charge_100_24h">
                    Phí 100% nếu hủy trong vòng 24 giờ
                  </option>
                </select>
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="allowOnlineBooking"
                  v-model="settings.booking.allowOnlineBooking"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  for="allowOnlineBooking"
                  class="ml-2 block text-sm text-gray-900"
                >
                  Cho phép đặt sân trực tuyến
                </label>
              </div>

              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="requireDeposit"
                  v-model="settings.booking.requireDeposit"
                  class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  for="requireDeposit"
                  class="ml-2 block text-sm text-gray-900"
                >
                  Yêu cầu đặt cọc khi đặt sân
                </label>
              </div>

              <div v-if="settings.booking.requireDeposit">
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Tỷ lệ đặt cọc (%)</label
                >
                <input
                  type="number"
                  v-model="settings.booking.depositPercentage"
                  min="0"
                  max="100"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <!-- Membership Settings -->
            <div v-if="selectedCategory.id === 'membership'" class="space-y-6">
              <div>
                <h3 class="text-md font-medium text-gray-800 mb-3">
                  Loại hội viên
                </h3>
                <div class="space-y-4">
                  <div
                    v-for="(type, index) in settings.membership.membershipTypes"
                    :key="index"
                    class="border rounded-md p-4"
                  >
                    <div class="flex justify-between items-center mb-3">
                      <div class="flex items-center">
                        <input
                          type="text"
                          v-model="type.name"
                          class="font-medium border-none focus:outline-none focus:ring-0 p-0"
                          placeholder="Tên loại hội viên"
                        />
                      </div>
                      <button
                        @click="removeMembershipType(index)"
                        class="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-500 mb-1"
                          >Phí (VND)</label
                        >
                        <input
                          type="number"
                          v-model="type.fee"
                          min="0"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-xs font-medium text-gray-500 mb-1"
                          >Thời hạn (tháng)</label
                        >
                        <input
                          type="number"
                          v-model="type.durationMonths"
                          min="1"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div class="mt-3">
                      <label
                        class="block text-xs font-medium text-gray-500 mb-1"
                        >Mô tả</label
                      >
                      <textarea
                        v-model="type.description"
                        rows="2"
                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      ></textarea>
                    </div>
                    <div class="mt-3">
                      <label
                        class="block text-xs font-medium text-gray-500 mb-1"
                        >Quyền lợi</label
                      >
                      <div
                        v-for="(benefit, benefitIndex) in type.benefits"
                        :key="benefitIndex"
                        class="flex items-center mt-2"
                      >
                        <input
                          type="text"
                          v-model="type.benefits[benefitIndex]"
                          class="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <button
                          @click="removeBenefit(index, benefitIndex)"
                          class="ml-2 text-red-500 hover:text-red-700"
                        >
                          <XIcon class="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        @click="addBenefit(index)"
                        class="mt-2 text-sm text-green-700 hover:text-green-800 flex items-center"
                      >
                        <PlusIcon class="w-4 h-4 mr-1" /> Thêm quyền lợi
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  @click="addMembershipType"
                  class="mt-3 flex items-center text-green-700 hover:text-green-800"
                >
                  <PlusIcon class="w-5 h-5 mr-1" /> Thêm loại hội viên
                </button>
              </div>
              <!--  thêm button lưu thay đổi -->
              <div class="flex justify-end mt-4">
                <button
                  @click="saveMembershipType"
                  class="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  SaveIcon,
  RefreshCwIcon,
  CogIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  BellIcon,
  CreditCardIcon,
  ShieldIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-vue-next";

// State
const selectedCategoryId = ref(null);
const selectedCategory = ref(null);
const settingsChanged = ref(false);

// Settings categories
const settingCategories = [
  { id: "general", name: "Cài đặt chung", icon: GlobeIcon },
  { id: "booking", name: "Đặt sân", icon: CalendarIcon },
  { id: "membership", name: "Hội viên", icon: UsersIcon },
];

// Mock settings data
const settings = reactive({
  general: {
    courseName: "Golf Course Management",
    address: "123 Đường Golf, Quận 1, TP.HCM",
    phone: "028 1234 5678",
    email: "info@golfcourse.com",
    website: "https://golfcourse.com",
    logoUrl: "/logo.png",
    timezone: "Asia/Ho_Chi_Minh",
    dateFormat: "DD/MM/YYYY",
    currency: "VND",
  },
  booking: {
    openingTime: "06:00",
    closingTime: "18:00",
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    timeSlotInterval: "30",
    defaultPlayTime: "240",
    cancellationPolicy: "free_24h",
    allowOnlineBooking: true,
    requireDeposit: true,
    depositPercentage: 30,
  },
  membership: {
    membershipTypes: [
      {
        name: "Tiêu chuẩn",
        fee: 10000000,
        durationMonths: 12,
        description: "Gói hội viên tiêu chuẩn với các quyền lợi cơ bản.",
        benefits: ["Đặt sân ưu tiên", "Giảm 10% phí sân", "Giảm 5% dịch vụ"],
      },
      {
        name: "Cao cấp",
        fee: 20000000,
        durationMonths: 12,
        description: "Gói hội viên cao cấp với nhiều quyền lợi hơn.",
        benefits: [
          "Đặt sân ưu tiên",
          "Giảm 20% phí sân",
          "Giảm 10% dịch vụ",
          "Miễn phí thuê xe điện",
        ],
      },
      {
        name: "VIP",
        fee: 50000000,
        durationMonths: 12,
        description: "Gói hội viên VIP với đầy đủ quyền lợi cao cấp.",
        benefits: [
          "Đặt sân ưu tiên tuyệt đối",
          "Giảm 30% phí sân",
          "Giảm 20% dịch vụ",
          "Miễn phí thuê xe điện",
          "Miễn phí thuê caddy",
          "Phòng chờ VIP",
        ],
      },
    ],
    autoRenewalReminders: true,
    renewalReminderDays: 30,
    offerRenewalDiscount: true,
    renewalDiscountPercentage: 10,
  },
  notifications: {
    senderEmail: "noreply@golfcourse.com",
    senderName: "Golf Course Management",
    notifyNewBooking: true,
    notifyBookingCancellation: true,
    notifyNewMember: true,
    notifyPayment: true,
    sendBookingConfirmation: true,
    sendBookingReminder: true,
    bookingReminderHours: 24,
    sendPaymentReceipt: true,
    sendMembershipCard: true,
  },
  payment: {
    acceptCash: true,
    acceptCreditCard: true,
    acceptBankTransfer: true,
    bankAccountInfo:
      "Ngân hàng VCB\nSố tài khoản: 1234567890\nChủ tài khoản: Golf Course Management",
    acceptEWallet: true,
    enableOnlinePayment: true,
    paymentGateway: "vnpay",
    apiKey: "test_api_key",
    apiSecret: "test_api_secret",
    invoicePrefix: "INV-",
    invoiceFooter:
      "Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi.\nMọi thắc mắc xin liên hệ: 028 1234 5678",
    autoSendInvoice: true,
  },
  system: {
    sessionTimeout: 30,
    passwordComplexity: "medium",
    enableTwoFactorAuth: false,
    enableAutoBackup: true,
    backupFrequency: "daily",
    maxBackups: 7,
    enableActivityLog: true,
    logRetentionDays: 90,
    enableErrorLog: true,
  },
});

// Original settings for reset
const originalSettings = JSON.parse(JSON.stringify(settings));

// Methods
function selectCategory(category) {
  selectedCategoryId.value = category.id;
  selectedCategory.value = category;
}

function addMembershipType() {
  settings.membership.membershipTypes.push({
    name: "Loại hội viên mới",
    fee: 0,
    durationMonths: 12,
    description: "",
    benefits: ["Quyền lợi mới"],
  });
}

function removeMembershipType(index) {
  if (confirm("Bạn có chắc chắn muốn xóa loại hội viên này không?")) {
    settings.membership.membershipTypes.splice(index, 1);
  }
}

function addBenefit(typeIndex) {
  settings.membership.membershipTypes[typeIndex].benefits.push("Quyền lợi mới");
}

function removeBenefit(typeIndex, benefitIndex) {
  settings.membership.membershipTypes[typeIndex].benefits.splice(
    benefitIndex,
    1
  );
}

onMounted(() => {
  // Select the first category by default
  if (settingCategories.length > 0) {
    selectCategory(settingCategories[0]);
  }
});

const formMemberShipType = ref({
  name: "",
  description: "",
  price: 0,
  duration: 0,
  benefits: "",
});

</script>
