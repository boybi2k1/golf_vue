<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <UserSideBar />
      <router-view />
    </div>
    
  </div>
</template>

<script setup>

import AppHeader from "../components/AppHeader.vue";
import UserSideBar from "../components/user/UserSideBar.vue";
// Optionally, provide/inject or use Pinia for cross-component notification
</script>
