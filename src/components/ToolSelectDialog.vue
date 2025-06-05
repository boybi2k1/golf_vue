<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(0,0,0,0.4)">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative">
      <h3 class="text-lg font-semibold text-green-800 mb-4 flex items-center">
        <span>Chọn gậy golf</span>
        <button @click="$emit('close')" class="ml-auto text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </h3>
      <div class="mb-4">
        <input v-model="search" type="text" placeholder="Tìm kiếm theo tên, mã..." class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="tool in filteredTools" :key="tool.id" class="flex items-center border rounded-lg p-3 hover:bg-green-50 cursor-pointer transition" @click="selectTool(tool)">
          <img v-if="tool.image" :src="tool.image" alt="tool" class="w-16 h-16 object-cover rounded mr-4 border" />
          <div class="flex-1">
            <div class="font-semibold text-green-800">{{ tool.name }}</div>
            <div class="text-xs text-gray-500">Mã: {{ tool.code }}</div>
            <div class="text-xs text-gray-500">Giá: {{ formatPrice(tool.price) }}</div>
            <div class="text-xs" :class="tool.status === 'AVAILABLE' ? 'text-green-600' : 'text-red-500'">
              {{ tool.status === 'AVAILABLE' ? 'Còn' : 'Hết' }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredTools.length === 0" class="text-center text-gray-400 py-8">Không tìm thấy gậy phù hợp.</div>
      <div class="mt-6 flex justify-end">
        <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Đóng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  visible: Boolean,
  tools: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['select', 'close']);
const search = ref('');
const filteredTools = computed(() => {
  if (!search.value) return props.tools;
  return props.tools.filter(tool => {
    const s = search.value.toLowerCase();
    return (
      (tool.name && tool.name.toLowerCase().includes(s)) ||
      (tool.code && tool.code.toLowerCase().includes(s))
    );
  });
});
function selectTool(tool) {
  emit('select', tool);
  emit('close');
}
function formatPrice(price) {
  if (!price) return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
}
</script>
