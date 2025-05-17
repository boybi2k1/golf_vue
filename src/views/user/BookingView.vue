<template>
  <div class="flex flex-col h-screen">
    <UserHeader />
    <div class="flex flex-1 overflow-hidden">
      <SideBar />
      <main class="flex-1 p-6 overflow-y-auto bg-green-100">
        <!-- Embed Booking component -->
        <Booking />
      </main>
    </div>
  </div>
</template>

<script setup>
import UserHeader from "../../components/UserHeader.vue";
import SideBar from "../../components/UserSideBar.vue";
import Booking from "../../components/UserBooking.vue"; // Import Booking component
</script>
