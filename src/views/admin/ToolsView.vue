<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <SideBar />
      <main class="flex-1 p-6 overflow-y-auto bg-green-100">
        <Tools />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from "../../components/AppHeader.vue";
import SideBar from "../../components/SideBar.vue";
import Tools from "../../components/Tools.vue"; // Import Tools component
</script>
