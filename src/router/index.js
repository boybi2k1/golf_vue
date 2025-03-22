import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/Home.vue"; // Cập nhật import
import AboutPage from "../views/About.vue"; // Cập nhật import

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
