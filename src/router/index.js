import { createRouter, createWebHistory } from 'vue-router';
// import DashboardView from '../views/admin/DashboardView.vue';
import BookingView from '../views/admin/BookingView.vue';
import CheckinView from '../views/admin/CheckinView.vue';
import CourseManagementView from '../views/admin/CourseManagementView.vue';
import EventManagementView from '../views/admin/EventManagementView.vue';
import MemberManagementView from '../views/admin/MemberManagementView.vue';
import UserAccountsView from '../views/admin/UserView.vue';
import ServicesView from '../views/admin/ServicesView.vue';
import ToolsView from '../views/admin/ToolsView.vue';
import PaymentsView from '../views/admin/PaymentsView.vue';
import ReportsView from '../views/admin/ReportsView.vue';
import SystemSettingsView from '../views/admin/SystemSettingsView.vue';
import AccountView from '../views/admin/AccountView.vue';
import LoginView from '../views/LoginView.vue';
import TeetimeView from '../views/admin/TeetimeView.vue';

import HistoryViewUser from '../views/user/HistoryView.vue';
import profileViewUser from '../views/user/ProfileView.vue';
import BookingViewUser from '../views/user/BookingView.vue';
import EventViewUser from '../views/user/EventView.vue';
import RegisterView from '../views/user/RegisterView.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
  },
  {
    path: '/',
    name: 'home',
    component: BookingViewUser,
  },
  {
    path: '/booking',
    name: 'userBookingview',
    component: BookingViewUser,
  },
  {
    path: '/events',
    name: 'userEventview',
    component: EventViewUser,
  },
  {
    path: '/history',
    name: 'userHistoryview',
    component: HistoryViewUser,
  },
  {
    path: '/profile',
    name: 'userProfileview',
    component: profileViewUser,
  },
  // {
  //   path: '/dashboard',
  //   name: 'dashboard',
  //   component: DashboardView,
  // },
  {
    path: '/admin/teetime',
    name: 'teetime',
    component: TeetimeView,
  },
  {
    path: '/admin/booking',
    name: 'booking',
    component: BookingView,
  },
  // {
  //   path: '/admin/checkin',
  //   name: 'checkin',
  //   component: CheckinView,
  // },
  {
    path: '/admin/course-management',
    name: 'course-management',
    component: CourseManagementView,
  },
  {
    path: '/admin/event-management',
    name: 'event-management',
    component: EventManagementView,
  },
  {
    path: '/admin/member-management',
    name: 'member-management',
    component: MemberManagementView,
  },
  {
    path: '/admin/user',
    name: 'user',
    component: UserAccountsView,
  },
  {
    path: '/admin/services',
    name: 'services',
    component: ServicesView,
  },
  {
    path: '/admin/tools',
    name: 'tools',
    component: ToolsView,
  },
  {
    path: '/admin/payments',
    name: 'payments',
    component: PaymentsView,
  },
  {
    path: '/admin/reports',
    name: 'reports',
    component: ReportsView,
  },
  {
    path: '/admin/system-settings',
    name: 'system-settings',
    component: SystemSettingsView,
  },
   {
    path: '/admin/account',
    name: 'account',
    component: AccountView,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
