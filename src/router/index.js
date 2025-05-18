import UserLayout from "../layout/UserLayout.vue";
import AdminLayout from "../layout/AdminLayout.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/Register.vue";
import BookingView from "../views/admin/BookingView.vue";
import CourseManagementView from "../views/admin/CourseManagementView.vue";
import EventManagementView from "../views/admin/EventManagementView.vue";
import MemberManagementView from "../views/admin/MemberManagementView.vue";
import UserView from "../views/admin/UserView.vue";
import ServicesView from "../views/admin/ServicesView.vue";
import ToolsView from "../views/admin/ToolsView.vue";
import PaymentsView from "../views/admin/PaymentsView.vue";
import ReportsView from "../views/admin/ReportsView.vue";
import SystemSettingsView from "../views/admin/SystemSettingsView.vue";
import AccountView from "../views/admin/AccountView.vue";
import UserBookingView from "../views/user/UserBookingView.vue";
import UserEventView from "../views/user/UserEventView.vue";
import UserHistory from "../views/user/UserHistory.vue";
import ProfileView from "../views/user/ProfileView.vue";
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import Unauthorized from "../views/unauthorized.vue";



const routes = [
    { path: '/login', name: 'login', component: LoginView},
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/unauthorized', name: 'unauthorized', component: Unauthorized },

  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      allowedRoles: ['STAFF', 'ADMIN']
    },
    children: [
      { path: '', name: 'home', component: BookingView },
      { path: 'booking', name: 'booking', component: BookingView },
      { path: 'course-management', name: 'course-management', component: CourseManagementView },
      { path: 'event-management', name: 'event-management', component: EventManagementView },
      { path: 'member-management', name: 'member-management', component: MemberManagementView },
      { path: 'user', name: 'user', component: UserView },
      { path: 'services', name: 'services', component: ServicesView},
      { path: 'tools', name: 'tools', component: ToolsView},
      { path: 'payments', name: 'payments', component: PaymentsView },
      { path: 'reports', name: 'reports', component: ReportsView },
      { path: 'system-settings', name: 'system-settings', component: SystemSettingsView},
      { path: 'account', name: 'account', component: AccountView },
    ]
  },


  // route cho user
  {
    path: '/',
    component: UserLayout,
    meta: {
      requiresAuth: true,
      allowedRoles: ['MEMBER', 'STAFF', 'ADMIN']
    },
    children: [
      { path: 'booking', name: 'user-booking', component: UserBookingView},
      { path: 'events', name: 'user-events', component: UserEventView },
      { path: 'history', name: 'user-history', component: UserHistory },
      { path: 'profile', name: 'user-profile', component: ProfileView },
    ]
  },
];



const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const allowedRoles = to.meta.allowedRoles;

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' });
  }

  if (requiresAuth && allowedRoles && !allowedRoles.includes(authStore.role)) {
    return next({ name: 'unauthorized' });
  }

  next();
});



export default router;
