<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
    </nav>
    <router-view /> <!-- Đây là nơi hiển thị nội dung của các trang -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
  background: #333;
  padding: 1rem;
}
nav a {
  color: white;
  text-decoration: none;
}
nav a:hover {
  text-decoration: underline;
}
</style>
