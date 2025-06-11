<script setup>
import { ref, computed, onMounted, watch, reactive } from "vue";
import {
  MapPin,
  Clock,
  Users,
  Star,
  X,
  CheckCircle,
  Calendar,
  Flag,
  Info,
  Plus,
} from "lucide-vue-next";
import { useGolfCourseStore } from "../../stores/golf_course";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth";
import { useToolStore } from "../../stores/tool";
import { useServicesStore } from "../../stores/services";
import { useTeeTimeStore } from "../../stores/tee_time";
import { usePaymentStore } from "../../stores/payment";
import { useBookingStore } from "../../stores/booking";
import { useGuestStore } from "../../stores/guest";
import { list } from "postcss";

const courseStore = useGolfCourseStore();
const teeTimeStore = useTeeTimeStore();
const serviceStore = useServicesStore();
const toolStore = useToolStore();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const bookingStore = useBookingStore();
const guestStore = useGuestStore();
// Lấy các state từ store
const { availableTeeTimes } = storeToRefs(teeTimeStore);
const { allServices } = storeToRefs(serviceStore);
const { golfClubs } = storeToRefs(toolStore);
const { golfCourses } = storeToRefs(courseStore);
const { user } = storeToRefs(authStore);

// State
const loading = ref(false);
const showBookingModal = ref(false);
const selectedCourse = ref({});
const showSuccessMessage = ref(false);
const serviceFee = 100000;
const teeTimeSelected = ref(null);

const bookingForm = reactive({
  golfCourseId: "",
  bookingDate: new Date().toISOString().split("T")[0],
  teeTimeId: "",
  golferId: "", //id khach hàng, có thể là user id hoặc guest id
  fullName: "",
  userId: "", // id nguoi dung
  numPlayers: 2,
  numberOfHoles: 9,
  phone: "",
  email: "",
  depositAmount: 0,
  totalCost: 0,
  priceByTeeTime: 0,
  note: "",
});

const bookingDetailData = reactive([]);

// Computed
const minDate = new Date().toISOString().split("T")[0];
const minBookingDate = new Date().toISOString().split("T")[0];
const maxBookingDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
  .toISOString()
  .split("T")[0];

const servicesTotal = computed(() => {
  return bookingDetailData.reduce(
    (total, item) => total + (item.totalPrice || 0),
    0
  );
});
const listHoles = [
  { id: 9, name: "9 lỗ" },
  { id: 18, name: "18 lỗ" },
];
const selectedTeeTimePrice = computed(() => {
  if (!bookingForm.teeTimeId) return 0;
  // Nếu teeTimeId là object (do v-model select binding), lấy trực tiếp
  if (
    typeof bookingForm.teeTimeId === "object" &&
    bookingForm.teeTimeId !== null
  ) {
    return bookingForm.teeTimeId.price || 0;
  }
  // Nếu teeTimeId là id, tìm trong availableTeeTimes
  const teeTime = availableTeeTimes.value.find(
    (t) => t.id === bookingForm.teeTimeId
  );
  return teeTime ? teeTime.price : 0;
});

watch(
  () => bookingForm.teeTimeId,
  () => {
    bookingForm.priceByTeeTime = selectedTeeTimePrice.value;
  }
);

const totalPrice = computed(() => {
  const numPlayers = bookingForm.numPlayers || 0;
  const priceByTeeTime = bookingForm.priceByTeeTime || 0;
  const courseTotal = priceByTeeTime * numPlayers;
  return courseTotal + servicesTotal.value;
});

const calPriceCourse = computed(() => {
  const numPlayers = bookingForm.numPlayers || 0;
  const priceByTeeTime = bookingForm.priceByTeeTime || 0;
  return priceByTeeTime * numPlayers;
});

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

const openBookingModal = (course) => {
  selectedCourse.value = course;
  bookingForm.golfCourseId = course.id;
  bookingForm.priceByTeeTime = course.price;
  // Cập nhật lại thông tin user mỗi lần mở modal
  bookingForm.fullName = user.value ? user.value.fullName : "";
  bookingForm.phone = user.value ? user.value.phone : "";
  bookingForm.email = user.value ? user.value.email : "";
  bookingDetailData.length = 0; // Reset dịch vụ khi mở modal
  showBookingModal.value = true;
};
const closeBookingModal = () => {
  showBookingModal.value = false;
  selectedCourse.value = {};
  bookingDetailData.length = 0; // Xóa dịch vụ khi đóng modal
};

const addService = () => {
  bookingDetailData.push({
    serviceId: "",
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });
};

async function addBookingDetailToBooking(bookingId) {
  await bookingStore.addBookingDetailToBooking(bookingId, bookingDetailData);
}
const removeService = (index) => {
  bookingDetailData.splice(index, 1);
};

const getServiceType = (serviceId) => {
  const service = allServices.value.find((s) => s.id === serviceId);
  return service ? service.type : null;
};

const onServiceChange = (index) => {
  const item = bookingDetailData[index];
  const service = allServices.value.find((s) => s.id === item.serviceId);
  if (service) {
    item.unitPrice = service.price;
    item.totalPrice = service.price * item.quantity;
  }
};
function updateTotalPrice(index) {
  const quantity = bookingDetailData[index].quantity || 0;
  const unitPrice = bookingDetailData[index].unitPrice || 0;
  bookingDetailData[index].totalPrice = quantity * unitPrice;
}
const depositAmount = computed(() => {
  const total = totalPrice.value || 0;
  const depositAmount = total * 0.5; // Giả sử đặt cọc 30% tổng giá
  bookingForm.depositAmount = depositAmount;
  return depositAmount || 0;
});
const viewCourseDetails = (course) => {
  console.log("View course details:", course.id);
  // Chuyển đến trang chi tiết sân golf
};

const saveBooking = async () => {
  console.log("bookingStore", bookingStore);
  const guest = await guestStore.getGuestByUserId(user.value.id);
  bookingForm.golferId = guest ? guest.id : user.value.id;
  bookingForm.userId = user.value.id;
  const newBooking = await bookingStore.createBooking(bookingForm);
  const bookingId = newBooking.id;
  await addBookingDetailToBooking(bookingId);
  console.log("Creating booking with form data:", bookingForm);
  return newBooking;
};

const processVNPayBooking = async () => {
  const booking = await saveBooking();
  const data = {
    userId: booking.golferId,
    referenceId: booking.id,
    amount: depositAmount.value,
    type: "BOOKING",
    status: "PENDING",
    paymentMethod: "VNPay",
  };
  const response = await paymentStore.createPayment(data);
  window.location.href = response.paymentUrl;
};
// Gọi API lấy available tee times khi thay đổi sân hoặc ngày
watch(
  () => [bookingForm.golfCourseId, bookingForm.bookingDate],
  ([courseId, date], [oldCourseId, oldDate]) => {
    if (courseId && date && (courseId !== oldCourseId || date !== oldDate)) {
      teeTimeStore.getAvailableTeeTimes(courseId, date);
    }
  }
);

// holdTeeTime với thông báo lỗi/success
import { inject } from "vue";
import { URL_IMAGE } from "../../api";
const showToast = inject("showToast");
async function holdTeeTime() {
  if (!bookingForm.teeTimeId) return;
  const param = {
    teeTimeId: bookingForm.teeTimeId,
    holes: bookingForm.numberOfHoles,
  };
  try {
    const res = await teeTimeStore.holdTeeTime({ param });
    teeTimeSelected.value = res;
  } catch (error) {
    console.error("Error holding tee time:", error);
    showToast("TeeTime không có sẵn! Vui lòng chọn giờ khác", "error");
    return;
  }
}
const mergedTeeTimes = computed(() => {
  // Nếu chưa hold tee time thì trả về danh sách gốc
  if (!teeTimeSelected.value || !teeTimeSelected.value.id) {
    return availableTeeTimes.value;
  }
  // Nếu tee time đang hold đã có trong danh sách thì trả về như cũ
  if (availableTeeTimes.value.some((t) => t.id === teeTimeSelected.value.id)) {
    return availableTeeTimes.value;
  }
  // Nếu chưa có thì thêm vào
  return [...availableTeeTimes.value, teeTimeSelected.value];
});
// Gọi lại mỗi 30s nếu đã chọn sân và ngày
setInterval(() => {
  if (bookingForm.golfCourseId && bookingForm.bookingDate) {
    teeTimeStore.getAvailableTeeTimes(
      bookingForm.golfCourseId,
      bookingForm.bookingDate
    );
  }
}, 30000);

async function fetchUserCurrent() {
  authStore.fetchUser();
}
// Khởi tạo

onMounted(async () => {
  await Promise.all([
    courseStore.getAllGolfCourses(),
    serviceStore.getAllServices(),
    toolStore.getAllGolfClub(),
    fetchUserCurrent(),
  ]);
  bookingForm.bookingDate = minBookingDate; // Đặt ngày tối thiểu
});
</script>

<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
    <div class="booking-page bg-gray-50 min-h-screen">
      <!-- Banner và tiêu đề -->
      <div class="bg-gradient-to-r from-green-600 to-green-700 text-white mb-6">
        <div class="container pl-5 px-4 py-6">
          <h1 class="text-2xl font-bold mb-2">Đặt Sân Golf</h1>
          <p class="text-green-100 text-base">
            Chọn sân golf và thời gian phù hợp với bạn
          </p>
        </div>
      </div>

      <!-- Danh sách sân golf -->
      <div class="container mx-auto px-4 pb-12">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-16">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"
          ></div>
        </div>

        <!-- Danh sách sân -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            v-for="course in golfCourses"
            :key="course.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Hình ảnh sân -->
            <div class="relative">
              <img
                :src="URL_IMAGE + course.imageUrl"
                :alt="course.name"
                class="w-full h-64 object-cover"
              />
            </div>

            <!-- Thông tin sân -->
            <div class="p-6">
              <!-- Tên và giá -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-800 mb-2">
                    {{ course.name }}
                  </h3>
                  <div class="flex items-center text-gray-600 mb-2">
                    <MapPin class="h-4 w-4 mr-2 text-green-500" />
                    <span class="text-sm">{{ course.location }}</span>
                  </div>
                </div>
              </div>

              <!-- Thông tin chi tiết -->
              <div class="space-y-3 mb-6">
                <div class="flex items-center text-sm text-gray-600">
                  <Flag class="h-4 w-4 mr-3 text-green-500" />
                  <span
                    >Số hố: <strong>{{ course.holes }}</strong></span
                  >
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <Users class="h-4 w-4 mr-3 text-green-500" />
                  <span
                    >Kích thước:
                    <strong>{{ course.length }} yards</strong></span
                  >
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <Users class="h-4 w-4 mr-3 text-green-500" />
                  <span
                    >Trạng thái: <strong>{{ course.status }}</strong></span
                  >
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <Users class="h-4 w-4 mr-3 text-green-500" />
                  <span
                    >Thời gian chơi:
                    <strong>{{ course.duration }} phút</strong></span
                  >
                </div>
              </div>
              <!-- Nút hành động -->
              <div class="flex space-x-3">
                <button
                  @click="viewCourseDetails(course)"
                  class="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 flex items-center justify-center font-medium transition-all duration-200"
                >
                  <Info class="h-4 w-4 mr-2" />
                  Chi tiết
                </button>
                <button
                  @click="openBookingModal(course)"
                  class="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 flex items-center justify-center font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Calendar class="h-4 w-4 mr-2" />
                  Đặt sân
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal đặt sân -->
      <div
        v-if="showBookingModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
        style="background-color: rgba(0, 0, 0, 0.6)"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        >
          <!-- Header Modal -->
          <div
            class="flex justify-between items-center border-b border-gray-200 px-8 py-6 bg-gradient-to-r from-green-50 to-green-100"
          >
            <div>
              <h2 class="text-2xl font-bold text-green-800">
                Đặt lịch chơi golf
              </h2>
              <p class="text-green-600 mt-1">
                Điền thông tin để hoàn tất việc đặt sân
              </p>
            </div>
            <button
              @click="closeBookingModal"
              class="text-gray-500 hover:text-gray-700 p-2 hover:bg-white rounded-full transition-all duration-200"
            >
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="px-8 py-6">
            <!-- Thông tin sân đã chọn -->
            <div
              class="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
            >
              <div class="flex items-center">
                <img
                  :src="URL_IMAGE + selectedCourse.imageUrl"
                  :alt="selectedCourse.name"
                  class="w-20 h-20 object-cover rounded-xl mr-6 shadow-md"
                />
                <div class="flex-1">
                  <h4 class="text-xl font-bold text-gray-800 mb-1">
                    {{ selectedCourse.name }}
                  </h4>
                  <p class="text-gray-600 mb-2 flex items-center">
                    <MapPin class="h-4 w-4 mr-1" />
                    {{ selectedCourse.location }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Form đặt sân -->
            <div class="grid grid-cols-1 gap-8">
              <!-- Cột trái - Thông tin cơ bản -->
              <div class="space-y-6">
                <h3
                  class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2"
                >
                  Thông tin đặt sân
                </h3>

                <!-- Ngày và giờ -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Ngày chơi</label
                    >
                    <input
                      type="date"
                      v-model="bookingForm.bookingDate"
                      required
                      :min="minBookingDate"
                      :max="maxBookingDate"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Số lỗ</label
                    >
                    <select
                      v-model="bookingForm.numberOfHoles"
                      required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option
                        v-for="hole in listHoles"
                        :key="hole.id"
                        :value="hole.id"
                      >
                        {{ hole.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Thông tin khách hàng -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Tee Time</label
                    >
                    <select
                      v-model="bookingForm.teeTimeId"
                      @change="holdTeeTime"
                      required
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option v-if="mergedTeeTimes.length === 0" disabled>
                        Không có giờ khả dụng
                      </option>
                      <option
                        v-for="(teeTime, index) in mergedTeeTimes"
                        :key="index"
                        :value="teeTime.id"
                      >
                        {{ teeTime.startTime }}
                      </option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Số người chơi</label
                    >
                    <select
                      v-model="bookingForm.numPlayers"
                      @change="updateTotalCost"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    >
                      <option value="1">1 người</option>
                      <option value="2">2 người</option>
                      <option value="3">3 người</option>
                      <option value="4">4 người</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Tên khách hàng</label
                    >
                    <input
                      type="text"
                      v-model="bookingForm.fullName"
                      required
                      placeholder="Nhập họ tên"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Số điện thoại</label
                    >
                    <input
                      type="tel"
                      v-model="bookingForm.phone"
                      required
                      placeholder="Nhập số điện thoại"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700"
                      >Email</label
                    >
                    <input
                      type="email"
                      v-model="bookingForm.email"
                      placeholder="Nhập email"
                      class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                </div>

                <!-- Ghi chú -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700"
                    >Ghi chú</label
                  >
                  <textarea
                    v-model="bookingForm.note"
                    rows="4"
                    placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                    class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  ></textarea>
                </div>
              </div>

              <!-- Cột phải - Dịch vụ và tổng kết -->
              <div class="space-y-6">
                <h3
                  class="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2"
                >
                  Dịch vụ đi kèm
                </h3>

                <!-- Bảng dịch vụ -->
                <div class="border border-gray-200 rounded-xl overflow-hidden">
                  <div
                    class="bg-green-50 px-4 py-3 grid grid-cols-12 gap-2 text-sm font-semibold text-gray-700"
                  >
                    <div class="col-span-4">Dịch vụ</div>
                    <div class="col-span-2 text-center">Số lượng</div>
                    <div class="col-span-3 text-center">Đơn giá</div>
                    <div class="col-span-2 text-center">Thành tiền</div>
                    <div class="col-span-1 text-center">Xóa</div>
                  </div>

                  <div
                    v-for="(item, index) in bookingDetailData"
                    :key="index"
                    class="px-4 py-3 grid grid-cols-12 gap-2 items-center border-t border-gray-100 hover:bg-gray-50"
                  >
                    <!-- Chọn dịch vụ -->
                    <div class="col-span-4">
                      <select
                        v-model="item.serviceId"
                        @change="onServiceChange(index)"
                        class="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Chọn dịch vụ</option>
                        <option
                          v-for="service in allServices"
                          :key="service.id"
                          :value="service.id"
                        >
                          {{ service.name }}
                        </option>
                      </select>
                    </div>
                    <!-- Số lượng -->
                    <div class="col-span-2">
                      <input
                        type="number"
                        min="1"
                        v-model.number="item.quantity"
                        @input="updateTotalPrice(index)"
                        class="w-full text-center border border-gray-300 rounded-md py-1 text-sm focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <!-- Đơn giá -->
                    <div class="col-span-3">
                      <div class="text-center font-medium text-green-600">
                        {{ formatPrice(item.unitPrice || 0) }}
                      </div>
                    </div>
                    <!-- Thành tiền -->
                    <div class="col-span-2">
                      <div class="text-center font-semibold text-blue-700">
                        {{ formatPrice(item.totalPrice || 0) }}
                      </div>
                    </div>
                    <!-- Nút xóa -->
                    <div class="col-span-1 text-center">
                      <button
                        @click="removeService(index)"
                        class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-all duration-200"
                      >
                        <X class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Nút thêm dịch vụ -->
                <div class="text-center">
                  <button
                    @click="addService"
                    class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Plus class="h-4 w-4 mr-2 inline" />
                    Thêm dịch vụ
                  </button>
                </div>

                <!-- Tổng kết chi phí -->
                <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 class="text-lg font-semibold text-gray-800 mb-4">
                    Chi tiết thanh toán
                  </h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600"
                        >Giá sân ({{ bookingForm.numPlayers }} người):</span
                      >
                      <span class="font-medium">{{
                        formatPrice(calPriceCourse || 0)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Dịch vụ đi kèm:</span>
                      <span class="font-medium">{{
                        formatPrice(servicesTotal || 0)
                      }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-red-600">Thanh toán trước:</span>
                      <span class="font-medium text-red">{{
                        formatPrice(depositAmount || 0)
                      }}</span>
                    </div>
                    <div class="border-t border-gray-300 pt-3">
                      <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold text-gray-800"
                          >Tổng cộng:</span
                        >
                        <span class="text-2xl font-bold text-green-600">{{
                          formatPrice(totalPrice || 0)
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Phương thức thanh toán -->
                  <div
                    class="mt-6 p-4 border-2 border-blue-200 bg-blue-50 rounded-lg"
                  >
                    <div class="flex items-center justify-center">
                      <img
                        src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                        alt="VNPay"
                        class="h-8 mr-3"
                      />
                      <div>
                        <div class="font-semibold text-blue-800">
                          Thanh toán qua VNPay
                        </div>
                        <!-- <div class="text-sm text-blue-600">Bắt buộc thanh toán để hoàn tất đặt sân</div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nút hành động -->
            <div class="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button
                @click="closeBookingModal"
                class="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200"
              >
                Hủy bỏ
              </button>
              <button
                @click="processVNPayBooking"
                :disabled="
                  !bookingForm.fullName ||
                  !bookingForm.phone ||
                  !bookingForm.teeTimeId
                "
                class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading">Đang xử lý...</span>
                <span v-else>Thanh toán VNPay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Thông báo thành công -->
      <div
        v-if="showSuccessMessage"
        class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center z-50 animate-bounce"
      >
        <CheckCircle class="h-6 w-6 mr-3" />
        <span class="font-medium"
          >Đặt sân thành công! Cảm ơn bạn đã sử dụng dịch vụ.</span
        >
      </div>
    </div>
  </main>
</template>

<style scoped>
.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
