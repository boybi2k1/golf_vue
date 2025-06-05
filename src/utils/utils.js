// Trạng thái booking (admin)
export function getStatusBookingText(status) {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "PLAYING":
      return "Đang chơi";
    case "COMPLETED":
      return "Hoàn thành";
    case "CHECKED_OUT":
      return "Đã check-out";
    default:
      return status;
  }
}
// Vai trò người dùng
export function getRoleText(role) {
  const roles = {
    MANAGER: "Quản lý",
    STAFF: "Nhân viên",
    GUEST: "Khách hàng",
    RECEPTIONIST: "Lễ tân",
    CADDY: "Caddy",
    GOLFER: "Golfer",
  };
  return roles[role] || role;
}

// Trạng thái người dùng
export function getUserStatusText(status) {
  const statuses = {
    active: "Đang hoạt động",
    inactive: "Không hoạt động",
    locked: "Đã khóa",
  };
  return statuses[status] || status;
}
// src/utils/utils.js

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function getStatusLabel(status) {
  const statusMap = {
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã hủy",
    NO_SHOW: "Không đến",
  };
  return statusMap[status] || status;
}

export function getPaymentMethodLabel(method) {
  const methodMap = {
    CREDIT_CARD: "Thẻ tín dụng",
    BANK_TRANSFER: "Chuyển khoản",
    CASH: "Tiền mặt",
    E_WALLET: "Ví điện tử",
  };
  return methodMap[method] || method;
}

export function getPlayerTypeLabel(type) {
  const typeMap = {
    MEMBER: "Thành viên",
    GUEST: "Khách",
    CHILD: "Trẻ em",
  };
  return typeMap[type] || type;
}

export function getMembershipLabel(type) {
  const typeMap = {
    BASIC: "Cơ bản",
    PREMIUM: "Cao cấp",
    VIP: "VIP",
  };
  return typeMap[type] || type;
}

export function checkAdminRole() {
  const role = localStorage.getItem("role");
  return role === "ADMIN";
}

export function getCategoryText(type) {
  const categories = {
    CADDY: "Thuê caddy",
    GOLF_CAR: "Thuê xe điện",
    GOLF_CLUB: "Thuê gậy",
    OTHER: "Khác",
  };
  return categories[type] || type;
}

export function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

