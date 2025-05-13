import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue';
import BookingView from '../views/BookingView.vue';
import CheckinView from '../views/CheckinView.vue';
import CourseManagementView from '../views/CourseManagementView.vue';
import EventManagementView from '../views/EventManagementView.vue';
import MemberManagementView from '../views/MemberManagementView.vue';
import UserAccountsView from '../views/UserAccountsView.vue';
import ServicesView from '../views/ServicesView.vue';
import ToolsView from '../views/ToolsView.vue';
import PaymentsView from '../views/PaymentsView.vue';
import ReportsView from '../views/ReportsView.vue';
import SystemSettingsView from '../views/SystemSettingsView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardView,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingView,
  },
  {
    path: '/checkin',
    name: 'checkin',
    component: CheckinView,
  },
  {
    path: '/course-management',
    name: 'course-management',
    component: CourseManagementView,
  },
  {
    path: '/event-management',
    name: 'event-management',
    component: EventManagementView,
  },
  {
    path: '/member-management',
    name: 'member-management',
    component: MemberManagementView,
  },
  {
    path: '/user-accounts',
    name: 'user-accounts',
    component: UserAccountsView,
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesView,
  },
  {
    path: '/tools',
    name: 'tools',
    component: ToolsView,
  },
  {
    path: '/payments',
    name: 'payments',
    component: PaymentsView,
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView,
  },
  {
    path: '/system-settings',
    name: 'system-settings',
    component: SystemSettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
