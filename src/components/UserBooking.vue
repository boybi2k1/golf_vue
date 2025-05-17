<template>
  <div class="booking-page bg-gray-50 min-h-screen pb-10">
    <!-- Banner và tiêu đề -->
    <div class="bg-green-600 text-white p-6 md:p-10">
      <h1 class="text-2xl md:text-3xl font-bold mb-2">Đặt sân Golf</h1>
      <p class="text-green-100">Chọn sân golf và thời gian phù hợp với bạn</p>
    </div>

    <!-- Bộ lọc đơn giản -->
    <div
      class="bg-white shadow-md rounded-lg mx-4 md:mx-8 -mt-6 p-4 md:p-6 mb-6"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Ngày</label>
          <input
            type="date"
            v-model="filters.date"
            class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
            :min="minDate"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >Thời gian</label
          >
          <select
            v-model="filters.time"
            class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="">Tất cả khung giờ</option>
            <option value="morning">Buổi sáng (5:00 - 11:00)</option>
            <option value="afternoon">Buổi chiều (11:00 - 17:00)</option>
            <option value="evening">Buổi tối (17:00 - 21:00)</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700"
            >Số người</label
          >
          <select
            v-model="filters.players"
            class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="1">1 người</option>
            <option value="2">2 người</option>
            <option value="3">3 người</option>
            <option value="4">4 người</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Danh sách sân golf -->
    <div class="mx-4 md:mx-8 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Chọn sân golf</h2>

      <!-- Danh sách sân -->
      <div v-if="loading" class="flex justify-center py-10">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="course in golfCourses"
          :key="course.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="relative">
            <img
              :src="course.image"
              :alt="course.name"
              class="w-full h-48 object-cover"
            />
            <div
              class="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium text-green-600 flex items-center"
            >
              <Star class="h-3 w-3 text-yellow-400 mr-1 fill-current" />
              {{ course.rating }}
            </div>
            <div
              v-if="course.discount"
              class="absolute top-2 left-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-medium"
            >
              -{{ course.discount }}%
            </div>
          </div>

          <div class="p-4">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ course.name }}
              </h3>
              <div class="text-right">
                <span
                  v-if="course.discount"
                  class="text-sm text-gray-500 line-through"
                  >{{ formatPrice(course.originalPrice) }}/người</span
                >
                <div class="text-green-600 font-bold">
                  {{ formatPrice(course.price) }}/người
                </div>
              </div>
            </div>

            <div class="flex items-center text-gray-500 text-sm mt-2">
              <MapPin class="h-4 w-4 mr-1" />
              <span>{{ course.location }}</span>
            </div>

            <div class="mt-3 space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <Clock class="h-4 w-4 mr-2 text-gray-400" />
                <span>Thời gian mở cửa: {{ course.openHours }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Users class="h-4 w-4 mr-2 text-gray-400" />
                <span>Số hố: {{ course.holes }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-600">
                <Flag class="h-4 w-4 mr-2 text-gray-400" />
                <span>{{ course.facilities }}</span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-2">
              <div
                v-for="(slot, index) in course.availableSlots"
                :key="index"
                :class="[
                  'text-center py-1 px-2 rounded text-sm cursor-pointer',
                  selectedSlot.courseId === course.id &&
                  selectedSlot.time === slot
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                ]"
                @click="selectTimeSlot(course.id, slot)"
              >
                {{ slot }}
              </div>
            </div>

            <div class="mt-4 flex space-x-2">
              <button
                @click="viewCourseDetails(course)"
                class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center"
              >
                <Info class="h-4 w-4 mr-1" />
                Chi tiết
              </button>
              <button
                @click="openBookingModal(course)"
                :disabled="selectedSlot.courseId !== course.id"
                :class="[
                  'flex-1 py-2 rounded-lg font-medium flex items-center justify-center',
                  selectedSlot.courseId === course.id
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed',
                ]"
              >
                <Calendar class="h-4 w-4 mr-1" />
                {{
                  selectedSlot.courseId === course.id ? "Đặt sân" : "Chọn giờ"
                }}
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
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div
        class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-gray-800">
              Xác nhận đặt sân
            </h3>
            <button
              @click="showBookingModal = false"
              class="text-gray-500 hover:text-gray-700"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="mb-6">
            <div class="flex items-center mb-4">
              <img
                :src="selectedCourse.image"
                :alt="selectedCourse.name"
                class="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div>
                <h4 class="font-medium text-gray-800">
                  {{ selectedCourse.name }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ selectedCourse.location }}
                </p>
              </div>
            </div>

            <div class="bg-gray-50 p-3 rounded-lg mb-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Ngày:</span>
                <span class="font-medium">{{ formatDate(filters.date) }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">Thời gian:</span>
                <span class="font-medium">{{ selectedSlot.time }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Số người:</span>
                <span class="font-medium">{{ filters.players }} người</span>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3"
                >Dịch vụ thêm</label
              >

              <!-- Thuê gậy golf -->
              <div class="mb-4">
                <h5 class="text-sm font-medium text-gray-700 mb-2">
                  Thuê gậy golf
                </h5>
                <div class="relative">
                  <select
                    v-model="selectedGolfClub"
                    class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 appearance-none pr-10"
                  >
                    <option value="">Không thuê gậy</option>
                    <option
                      v-for="(club, index) in golfClubs"
                      :key="`club-${index}`"
                      :value="index"
                    >
                      {{ club.name }} - {{ formatPrice(club.price) }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div
                  v-if="selectedGolfClub !== ''"
                  class="mt-2 p-3 bg-gray-50 rounded-lg"
                >
                  <p class="text-sm text-gray-600">
                    {{ golfClubs[selectedGolfClub].description }}
                  </p>
                  <div class="flex items-center justify-between mt-2">
                    <span class="text-sm font-medium">Số lượng:</span>
                    <div class="flex items-center border rounded">
                      <button
                        @click="decrementClubQuantity"
                        class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        :disabled="golfClubs[selectedGolfClub].quantity <= 1"
                      >
                        <Minus class="h-3 w-3" />
                      </button>
                      <span class="px-2 py-1 text-sm">{{
                        golfClubs[selectedGolfClub].quantity
                      }}</span>
                      <button
                        @click="incrementClubQuantity"
                        class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <Plus class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dịch vụ khác -->
              <div>
                <h5 class="text-sm font-medium text-gray-700 mb-2">
                  Dịch vụ khác
                </h5>
                <div class="space-y-3">
                  <div
                    v-for="(service, index) in otherServices"
                    :key="`service-${index}`"
                    class="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div class="flex-1">
                      <div class="flex items-center">
                        <input
                          type="checkbox"
                          :id="`service-${index}`"
                          v-model="service.selected"
                          class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          :for="`service-${index}`"
                          class="ml-2 text-sm text-gray-700"
                          >{{ service.name }}</label
                        >
                      </div>
                    </div>
                    <div class="flex items-center">
                      <span class="text-sm font-medium text-gray-700 mr-3">{{
                        formatPrice(service.price)
                      }}</span>
                      <div
                        v-if="service.selected"
                        class="flex items-center border rounded"
                      >
                        <button
                          @click="decrementQuantity(service)"
                          class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          :disabled="service.quantity <= 1"
                        >
                          <Minus class="h-3 w-3" />
                        </button>
                        <span class="px-2 py-1 text-sm">{{
                          service.quantity
                        }}</span>
                        <button
                          @click="incrementQuantity(service)"
                          class="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Ghi chú</label
              >
              <textarea
                v-model="bookingNote"
                rows="3"
                placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..."
                class="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Phương thức thanh toán</label
              >
              <div
                class="p-3 border rounded-lg border-green-500 bg-green-50 flex items-center"
              >
                <img
                  src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                  alt="VNPay"
                  class="h-8 mr-3"
                />
                <span>Thanh toán qua VNPay</span>
              </div>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-200 pt-4">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600"
                >Giá sân ({{ filters.players }} người):</span
              >
              <span>{{
                formatPrice(selectedCourse.price * parseInt(filters.players))
              }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Thuê gậy golf:</span>
              <span>{{ formatPrice(golfClubsTotal) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Dịch vụ khác:</span>
              <span>{{ formatPrice(otherServicesTotal) }}</span>
            </div>
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Phí dịch vụ:</span>
              <span>{{ formatPrice(serviceFee) }}</span>
            </div>
            <div
              v-if="promoDiscount > 0"
              class="flex justify-between mb-2 text-red-600"
            >
              <span>Giảm giá:</span>
              <span>-{{ formatPrice(promoDiscount) }}</span>
            </div>
            <div
              class="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200"
            >
              <span>Tổng cộng:</span>
              <span class="text-green-600">{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              @click="showBookingModal = false"
              class="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              @click="confirmBooking"
              class="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Thông báo đặt sân thành công -->
    <div
      v-if="showSuccessMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50"
    >
      <CheckCircle class="h-5 w-5 mr-2" />
      <span
        >Đặt sân thành công! Bạn có thể xem chi tiết trong lịch sử đặt
        sân.</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Search,
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
  Minus,
} from "lucide-vue-next";

// Dữ liệu mẫu cho sân golf - chỉ có 2 sân
const golfCourses = ref([
  {
    id: 1,
    name: "Sân Haven (Khu A)",
    location: "Long Biên - Hà Nội",
    price: 1600000,
    originalPrice: 1600000,
    discount: null,
    rating: 4.8,
    image:
      "https://golfasian.com/wp-content/uploads/2018/10/Kings-Island-Golf-Resort-Mountain-View-Course-1.jpg",
    openHours: "5:00 - 19:00",
    holes: 9,
    facilities: "Nhà hàng, Pro shop, Caddy",
    availableSlots: ["06:00", "07:30", "09:00", "10:30", "13:00", "15:30"],
  },
  {
    id: 2,
    name: "Sân Lotus (Khu b)",
    location: "Long Biên - Hà Nội",
    price: 1570000,
    originalPrice: 1570000,
    discount: null,
    rating: 4.9,
    image:
      "https://golfasian.com/wp-content/uploads/2018/10/Vinpearl-Golf-Nam-Hoi-An-1.jpg",
    openHours: "5:30 - 18:30",
    holes: 18,
    facilities: "Nhà hàng, Pro shop, Hồ bơi",
    availableSlots: ["06:30", "08:00", "09:30", "14:00", "16:00"],
  },
]);

// Các loại gậy golf
const golfClubs = ref([
  {
    name: "Bộ gậy Callaway MAVRIK",
    description: "Bộ gậy cao cấp, phù hợp cho người chơi chuyên nghiệp",
    price: 1200000,
    quantity: 1,
  },
  {
    name: "Bộ gậy TaylorMade SIM2",
    description: "Bộ gậy hiện đại với công nghệ mới nhất",
    price: 1500000,
    quantity: 1,
  },
  {
    name: "Bộ gậy Titleist TSi",
    description: "Bộ gậy cân bằng, phù hợp cho mọi cấp độ",
    price: 1000000,
    quantity: 1,
  },
  {
    name: "Bộ gậy Ping G425",
    description: "Bộ gậy dễ chơi, phù hợp cho người mới",
    price: 800000,
    quantity: 1,
  },
]);

// Dịch vụ khác
const otherServices = ref([
  { name: "Thuê xe điện", price: 300000, selected: false, quantity: 1 },
  { name: "Caddy chuyên nghiệp", price: 500000, selected: false, quantity: 1 },
  {
    name: "Bữa trưa tại nhà hàng",
    price: 250000,
    selected: false,
    quantity: 1,
  },
  { name: "Nước uống và snack", price: 150000, selected: false, quantity: 1 },
]);

// State
const filters = ref({
  date: new Date().toISOString().split("T")[0],
  time: "",
  players: "2",
});

const loading = ref(false);
const selectedSlot = ref({ courseId: null, time: null });
const showBookingModal = ref(false);
const selectedCourse = ref({});
const bookingNote = ref("");
const showSuccessMessage = ref(false);
const serviceFee = 100000; // Phí dịch vụ cố định
const promoCode = ref("");
const promoDiscount = ref(0);
const promoMessage = ref("");
const promoSuccess = ref(false);
const selectedGolfClub = ref("");

// Ngày tối thiểu là ngày hiện tại
const minDate = new Date().toISOString().split("T")[0];

// Tăng số lượng gậy golf
const incrementClubQuantity = () => {
  if (selectedGolfClub.value !== "") {
    golfClubs.value[selectedGolfClub.value].quantity++;
  }
};

// Giảm số lượng gậy golf
const decrementClubQuantity = () => {
  if (
    selectedGolfClub.value !== "" &&
    golfClubs.value[selectedGolfClub.value].quantity > 1
  ) {
    golfClubs.value[selectedGolfClub.value].quantity--;
  }
};

// Tổng giá thuê gậy golf
const golfClubsTotal = computed(() => {
  if (selectedGolfClub.value === "") return 0;
  const club = golfClubs.value[selectedGolfClub.value];
  return club.price * club.quantity;
});

// Tổng giá dịch vụ khác
const otherServicesTotal = computed(() => {
  return otherServices.value
    .filter((service) => service.selected)
    .reduce((total, service) => total + service.price * service.quantity, 0);
});

// Tổng giá tiền
const totalPrice = computed(() => {
  const numberOfPlayers = parseInt(filters.value.players);
  return (
    selectedCourse.value.price * numberOfPlayers +
    golfClubsTotal.value +
    otherServicesTotal.value +
    serviceFee -
    promoDiscount.value
  );
});

// Tăng số lượng
const incrementQuantity = (item) => {
  item.quantity++;
};

// Giảm số lượng
const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    item.quantity--;
  }
};

// Chọn khung giờ
const selectTimeSlot = (courseId, time) => {
  selectedSlot.value = { courseId, time };
};

// Mở modal đặt sân
const openBookingModal = (course) => {
  selectedCourse.value = course;
  showBookingModal.value = true;

  // Reset các giá trị
  selectedGolfClub.value = "";
  golfClubs.value.forEach((club) => {
    club.quantity = 1;
  });

  otherServices.value.forEach((service) => {
    service.selected = false;
    service.quantity = 1;
  });

  bookingNote.value = "";
  promoCode.value = "";
  promoDiscount.value = 0;
  promoMessage.value = "";
};

// Xem chi tiết sân golf
const viewCourseDetails = (course) => {
  // Chuyển đến trang chi tiết sân golf
  console.log("View course details:", course.id);
  // router.push(`/golf-courses/${course.id}`);
};

// Áp dụng mã khuyến mãi
const applyPromoCode = () => {
  if (!promoCode.value) {
    promoMessage.value = "Vui lòng nhập mã khuyến mãi";
    promoSuccess.value = false;
    return;
  }

  // Giả lập kiểm tra mã khuyến mãi
  if (promoCode.value.toUpperCase() === "GOLF10") {
    promoDiscount.value = Math.round(selectedCourse.value.price * 0.1);
    promoMessage.value = "Áp dụng mã giảm giá thành công!";
    promoSuccess.value = true;
  } else if (promoCode.value.toUpperCase() === "NEWUSER") {
    promoDiscount.value = 200000;
    promoMessage.value = "Áp dụng mã giảm giá thành công!";
    promoSuccess.value = true;
  } else {
    promoDiscount.value = 0;
    promoMessage.value = "Mã khuyến mãi không hợp lệ hoặc đã hết hạn";
    promoSuccess.value = false;
  }
};

// Xác nhận đặt sân
const confirmBooking = () => {
  // Giả lập API call đặt sân
  setTimeout(() => {
    showBookingModal.value = false;
    showSuccessMessage.value = true;

    // Reset selected slot
    selectedSlot.value = { courseId: null, time: null };

    // Ẩn thông báo sau 3 giây
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  }, 1000);
};

// Format giá tiền
const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

// Format ngày
const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

// Khởi tạo
onMounted(() => {
  loading.value = true;

  // Giả lập API call
  setTimeout(() => {
    loading.value = false;
  }, 800);
});
</script>

<style scoped>
/* Thêm hiệu ứng transition cho các phần tử */
.booking-page {
  transition: all 0.3s ease;
}

/* Tùy chỉnh scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
