<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <SideBar />
      <router-view />
    </div>
   
  </div>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
import SideBar from "../components/SideBar.vue";
</script>
