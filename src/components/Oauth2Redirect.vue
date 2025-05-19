<template>
  <div class="loading">Đang đăng nhập, vui lòng chờ...</div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (!token) {
    console.error("Không tìm thấy token trong URL");
    router.push("/login");
    return;
  }

  // Lưu token
  localStorage.setItem("token", token);
  authStore.token = token;

  try {
    await authStore.fetchUser(); // Gọi API lấy user

    const role = authStore.user?.role;
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "MEMBER") {
      router.push("/booking");
    } else if (role === "STAFF") {
      router.push("/staff/dashboard");
    } else {
      router.push("/"); // fallback
    }
  } catch (err) {
    console.error("Lỗi khi lấy user:", err);
    router.push("/login");
  }
});
</script>

<style scoped>
.loading {
  padding: 20px;
  text-align: center;
  font-weight: bold;
}
</style>
