<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden ">
      <SideBar />
      <main class="flex-1 p-6 overflow-y-auto bg-green-100">
        <!-- Embed Booking component -->
        <Checkin />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import SideBar from '../components/SideBar.vue'
import Checkin from '../components/Checkin.vue' 
</script>