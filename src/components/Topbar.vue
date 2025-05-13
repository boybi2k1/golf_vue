<template>
    <header class="flex justify-between items-center bg-emerald-700 text-white px-6 h-16">
      <div class="flex items-center">
        <button class="flex items-center gap-3 bg-transparent border-0 text-white font-semibold cursor-pointer">
          <Flag class="w-6 h-6" />
          <span class="text-xl font-bold">Golf Course Manager</span>
        </button>
      </div>
      <div class="flex items-center">
        <button class="bg-transparent border-0 text-white mr-6 cursor-pointer flex items-center justify-center hover:text-emerald-300">
          <Bell class="w-6 h-6" />
        </button>
        <div class="flex items-center gap-3 cursor-pointer">
          <img src="" alt="Admin" class="w-10 h-10 rounded-full object-cover bg-gray-200" />
          <span class="font-medium">Admin</span>
        </div>
      </div>
    </header>
  </template>
  
  <script setup>
  import { Bell, Flag } from 'lucide-vue-next'
  </script>