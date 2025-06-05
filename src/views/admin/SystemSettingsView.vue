s<template>
  <main class="flex-1 p-6 overflow-y-auto bg-green-100">
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
          <div class="bg-white rounded-lg shadow p-4 h-[80vh] overflow-y-auto">
            <div
              v-if="!selectedCategory"
              class="text-center py-8 text-gray-500"
            >
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
                      v-model="generalInfoForm.name"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Địa chỉ</label
                    >
                    <input
                      type="text"
                      v-model="generalInfoForm.address"
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
                      v-model="generalInfoForm.phone"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Email</label
                    >
                    <input
                      type="email"
                      v-model="generalInfoForm.email"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Website</label
                    >
                    <input
                      type="url"
                      v-model="generalInfoForm.website"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Giờ mở cửa</label
                    >
                    <input
                      type="time"
                      v-model="generalInfoForm.openTime"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Giờ đóng cửa</label
                    >
                    <input
                      type="time"
                      v-model="generalInfoForm.closeTime"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Vĩ độ (Latitude)</label
                    >
                    <input
                      type="number"
                      step="any"
                      v-model="generalInfoForm.latitude"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Hình ảnh (Image URL)</label
                    >
                    <input
                      type="text"
                      v-model="generalInfoForm.imageUrl"
                      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                <div class="flex justify-end mt-6">
                  <button
                    v-if="isAdmin"
                    @click="saveGeneralInfo"
                    class="bg-green-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-green-700 transition-colors shadow"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </div>

              <!-- Booking Settings -->
              <div v-if="selectedCategory.id === 'booking'" class="space-y-8">
                <!-- Tee Time Configs -->
                <div>
                  <label class="block text-lg font-bold text-green-800 mb-4"
                    >Cấu hình Tee Time</label
                  >

                  <div
                    v-for="(config, idx) in listTeeTimeConfigs"
                    :key="config?.id || idx"
                    class="border border-green-200 rounded-xl p-6 mb-6 bg-white shadow-md space-y-4"
                  >
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Sân</label
                        >
                        <select
                          v-model="config.golfCourseId"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        >
                          <option value="">Tất cả sân</option>
                          <option
                            v-for="course in golfCourses"
                            :key="course.id"
                            :value="course.id"
                          >
                            {{ course.name }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Loại ngày</label
                        >
                        <select
                          v-model="config.dateType"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        >
                          <option value="WEEKDAY">Ngày thường</option>
                          <option value="WEEKEND">Cuối tuần</option>
                        </select>
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Giờ bắt đầu</label
                        >
                        <input
                          type="time"
                          v-model="config.startTime"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Giờ kết thúc</label
                        >
                        <input
                          type="time"
                          v-model="config.endTime"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Khoảng cách (phút)</label
                        >
                        <input
                          type="number"
                          min="1"
                          v-model.number="config.duration"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Giá (VND)</label
                        >
                        <input
                          type="number"
                          min="0"
                          v-model.number="config.price"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Số người tối đa</label
                        >
                        <input
                          type="number"
                          min="1"
                          v-model.number="config.maxPlayers"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label
                          class="block text-sm font-medium text-gray-700 mb-1"
                          >Trạng thái</label
                        >
                        <select
                          v-model="config.status"
                          class="w-full border border-green-300 rounded-md px-3 py-2 focus:ring-green-500"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                        </select>
                      </div>
                    </div>

                    <div class="flex justify-end gap-2">
                      <button
                        v-if="isAdmin"
                        @click="saveTeeTimeConfig(config, idx)"
                        class="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                      >
                        {{ config.id ? "Lưu" : "Thêm mới" }}
                      </button>
                      <button
                        v-if="config.id && isAdmin"
                        @click="deleteTeeTimeConfig(config.id)"
                        class="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <XIcon class="w-4 h-4 mr-1" /> Xóa cấu hình
                      </button>
                      <button
                        v-if="isAdmin && !config.id"
                        @click="removeNewTeeTimeConfig(idx)"
                        class="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        <XIcon class="w-4 h-4 mr-1" /> Hủy
                      </button>
                    </div>
                  </div>

                  <!-- Nút thêm -->
                  <button
                    v-if="isAdmin"
                    @click="addNewTeeTimeConfig"
                    class="inline-flex items-center text-green-700 hover:text-green-800 mt-2 font-semibold"
                  >
                    <PlusIcon class="w-5 h-5 mr-1" /> Thêm cấu hình Tee Time
                  </button>
                </div>
              </div>

              <!-- Membership Settings -->
              <div
                v-if="selectedCategory.id === 'membership'"
                class="space-y-6"
              >
                <div>
                  <h3 class="text-md font-medium text-gray-800 mb-3">
                    Loại hội viên
                  </h3>
                  <div class="space-y-4">
                    <div
                      v-for="(type, index) in listMembershipTypes"
                      :key="type.id || index"
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
                          v-if="isAdmin"
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
                            >Giá (USD)</label
                          >
                          <input
                            type="number"
                            v-model="type.price"
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
                            v-model="type.duration"
                            min="1"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-xs font-medium text-gray-500 mb-1"
                            >Số lượt đặt tối đa/tháng</label
                          >
                          <input
                            type="number"
                            v-model="type.maxBookingPerMonth"
                            min="0"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-xs font-medium text-gray-500 mb-1"
                            >Số ngày được đặt trước</label
                          >
                          <input
                            type="number"
                            v-model="type.bookingBeforeDay"
                            min="0"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label
                            class="block text-xs font-medium text-gray-500 mb-1"
                            >Giảm giá (%)</label
                          >
                          <input
                            type="number"
                            v-model="type.discount"
                            min="0"
                            max="100"
                            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
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
                            v-if="isAdmin"
                            @click="removeBenefit(index, benefitIndex)"
                            class="ml-2 text-red-500 hover:text-red-700"
                          >
                            <XIcon class="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          v-if="isAdmin"
                          @click="addBenefit(index)"
                          class="mt-2 text-sm text-green-700 hover:text-green-800 flex items-center"
                        >
                          <PlusIcon class="w-4 h-4 mr-1" /> Thêm quyền lợi
                        </button>
                      </div>
                      <div class="flex justify-end mt-4">
                        <button
                          v-if="isAdmin"
                          @click="saveMembershipType(type, index)"
                          class="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                        >
                          {{ type.id ? "Lưu" : "Thêm mới" }}
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    v-if="isAdmin"
                    @click="addMembershipType"
                    class="mt-3 flex items-center text-green-700 hover:text-green-800"
                  >
                    <PlusIcon class="w-5 h-5 mr-1" /> Thêm loại hội viên
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted, watch, inject } from "vue";
import {
  CogIcon,
  GlobeIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-vue-next";
import { useGolfCourseStore } from "../../stores/golf_course";
import { useTeeTimeConfigStore } from "../../stores/tee_time_config";
import { useMembershipTypeStore } from "../../stores/membership_type";
import { storeToRefs } from "pinia";
import { checkAdminRole } from "../../utils/utils";
import { useGeneralInfo } from "../../stores/general_info";

const isAdmin = checkAdminRole();
// State
const selectedCategoryId = ref(null);
const selectedCategory = ref(null);
const listTeeTimeConfigs = ref([]);
const listMembershipTypes = ref([]);

// Settings categories
const settingCategories = [
  { id: "general", name: "Cài đặt chung", icon: GlobeIcon },
  { id: "booking", name: "Tee time", icon: CalendarIcon },
  { id: "membership", name: "Hội viên", icon: UsersIcon },
];
const showToast = inject("showToast");
const teeTimeConfigStore = useTeeTimeConfigStore();
const generalInfoStore = useGeneralInfo();
const { teeTimeConfigs } = storeToRefs(teeTimeConfigStore);
const golfCourseStore = useGolfCourseStore();
const { golfCourses } = storeToRefs(golfCourseStore);
// Mock settings data
// Methods
function selectCategory(category) {
  selectedCategoryId.value = category.id;
  selectedCategory.value = category;
}
const membershipTypeStore = useMembershipTypeStore();
const { membershipTypes } = storeToRefs(membershipTypeStore);
const { generalInfo } = storeToRefs(generalInfoStore);

const generalInfoForm = reactive({
  id: "",
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  openTime: "06:00",
  closeTime: "18:00",
  latitude: 0,
  imageUrl: "",
});
function addMembershipType() {
  // Chỉ cho phép 1 dòng trống (chưa có id)
  const hasEmpty = membershipTypes.value.some((type) => !type.id);
  if (hasEmpty) return;
  membershipTypes.value.push({
    name: "",
    price: 0,
    duration: 1,
    maxBookingPerMonth: 0,
    bookingBeforeDay: 0,
    discount: 0,
    benefits: [],
  });
}

function removeMembershipType(index) {
  if (membershipTypes.value[index]?.id) {
    if (confirm("Bạn có chắc chắn muốn xóa loại hội viên này?")) {
      membershipTypeStore.deleteMembershipType(membershipTypes.value[index].id);
      membershipTypes.value.splice(index, 1);
    }
  } else {
    membershipTypes.value.splice(index, 1);
  }
}

function addBenefit(typeIndex) {
  membershipTypes.value[typeIndex].benefits.push("");
}

function removeBenefit(typeIndex, benefitIndex) {
  membershipTypes.value[typeIndex].benefits.splice(benefitIndex, 1);
}

async function saveMembershipType(type, index) {
  try {
    if (type.id) {
      await membershipTypeStore.updateMembershipType(type.id, type);
      alert("Cập nhật loại hội viên thành công!");
    } else {
      await membershipTypeStore.createMembershipType(type);
      membershipTypes.value.splice(index, 1);
      alert("Thêm mới loại hội viên thành công!");
    }
    await membershipTypeStore.getAllMembershipTypes();
  } catch (e) {
    alert("Có lỗi khi lưu loại hội viên: " + (e?.message || e));
  }
}
function addNewTeeTimeConfig() {
  // Chỉ cho phép 1 dòng trống (chưa có id)
  const hasEmpty = listTeeTimeConfigs.value.some((cfg) => !cfg.id);
  if (hasEmpty) return;
  listTeeTimeConfigs.value.push({
    golfCourseId: "",
    dateType: "WEEKDAY",
    startTime: "06:00",
    endTime: "18:00",
    duration: 30,
    price: 0,
    maxPlayers: 4,
    status: "active",
  });
}
async function saveGeneralInfo() {
  try {
    if (generalInfo.value === null) {
      await generalInfoStore.createInfo(generalInfoForm);
      showToast("Lưu thông tin chung thành công!", "success");
    } else {
      if (generalInfoForm.id !== "") {
        await generalInfoStore.updateInfo(generalInfoForm.id, generalInfoForm);
        showToast("Cập nhật thông tin chung thành công!", "success");
      }
    }
  } catch (e) {
    showToast("Luư thông tin thất bại!", "error");
  }
}
function removeNewTeeTimeConfig(idx) {
  // Xóa dòng trống (chưa có id)
  if (!listTeeTimeConfigs.value[idx]?.id) {
    listTeeTimeConfigs.value.splice(idx, 1);
  }
}

async function saveTeeTimeConfig(config, idx) {
  try {
    if (config.id) {
      await teeTimeConfigStore.updateConfig(config.id, config);
      alert("Cập nhật cấu hình thành công!");
    } else {
      await teeTimeConfigStore.createConfig(config);
      // Xóa dòng trống sau khi thêm mới thành công
      listTeeTimeConfigs.value.splice(idx, 1);
      alert("Thêm mới cấu hình thành công!");
    }
    // Luôn fetch lại danh sách để đồng bộ
    await teeTimeConfigStore.fetchTeeTimeConfigActive();
  } catch (e) {
    alert("Có lỗi khi lưu cấu hình: " + (e?.message || e));
  }
}

async function deleteTeeTimeConfig(id) {
  if (confirm("Bạn có chắc chắn muốn xóa cấu hình này?")) {
    try {
      await teeTimeConfigStore.deleteConfig(id);
      await teeTimeConfigStore.fetchTeeTimeConfigActive();
      alert("Đã xóa cấu hình!");
    } catch (e) {
      alert("Có lỗi khi xóa: " + (e?.message || e));
    }
  }
}

async function fetchGeneralInfo() {
  const res = await generalInfoStore.getInfo();
  console.log("General Info:", res);
  if (res) Object.assign(generalInfoForm, res);
  else generalInfoForm.id = "";
}

onMounted(async () => {
  await golfCourseStore.getAllGolfCourses();
  await teeTimeConfigStore.fetchTeeTimeConfigActive();
  await membershipTypeStore.getAllMembershipTypes();
  fetchGeneralInfo();
});
watch(
  () => teeTimeConfigStore.teeTimeConfigs,
  (newValue) => {
    listTeeTimeConfigs.value = newValue;
  }
);
watch(
  () => membershipTypeStore.membershipTypes,
  (newValue) => {
    listMembershipTypes.value = newValue;
  }
);
</script>
