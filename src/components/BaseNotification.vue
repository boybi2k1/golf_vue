<template>
  <transition name="fade">
    <div
      v-if="show"
      :class="[
        'fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg flex items-center z-[9999]',
        status === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      ]"
    >
      <slot name="icon">
        <CheckCircleIcon v-if="status === 'success'" class="w-5 h-5 mr-2" />
        <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
      </slot>
      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { CheckCircle as CheckCircleIcon } from "lucide-vue-next";
const props = defineProps({
  show: Boolean,
  message: String,
  status: {
    type: String,
    default: 'success', // 'success' | 'error'
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
