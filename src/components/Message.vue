<template>
  <div class="px-4 py-2 text-sm text-gray-700" :class="{ 'border-t': hasBorder }">
    <p class="font-semibold">{{ title }}</p>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  hasBorder: {
    type: Boolean,
    default: false,
  },
});
</script>