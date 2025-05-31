<template>
  <div class="flex flex-col h-screen">
    <AppHeader />
    <div class="flex flex-1 overflow-hidden">
      <UserSideBar />
      <router-view />
    </div>
    <df-messenger
      intent="WELCOME"
      chat-title="GolfBot"
      agent-id="152653cd-eb1a-4a00-86bf-1d6a972d48c0"
      language-code="vi"
    ></df-messenger>
  </div>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
import UserSideBar from "../components/user/UserSideBar.vue";
// Optionally, provide/inject or use Pinia for cross-component notification
</script>
