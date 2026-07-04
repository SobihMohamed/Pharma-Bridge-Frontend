export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    FORGET_PASSWORD: "/api/auth/forget-password",
    VERIFY_OTP: "/api/auth/verify-otp",
    RESET_PASSWORD: "/api/auth/reset-password",
  },
  PRESCRIPTION_REQUESTS: {
    BASE: "/api/prescription-requests",
    BY_ID: (id: number) => `/api/prescription-requests/${id}`,
    CANCEL: (id: number) => `/api/prescription-requests/${id}/cancel`,
  },
  PHARMACY_REQUESTS: {
    NEARBY: "/api/pharmacy-requests/nearby",
  },
  ADMIN_REQUESTS: {
    ALL: "/api/admin/prescription-requests",
    DETAILS: (id: number) => `/api/admin/prescription-requests/${id}`,
  },
  SIGNALR: {
    HUB: "/notify",
  },
  BIDS: {
    CREATE: (pharmacyId: number) => `/api/bid/pharmacy/${pharmacyId}`,
    GET_BY_PHARMACY: (pharmacyId: number) => `/api/bid/pharmacy/${pharmacyId}`,
    GET_FOR_REQUEST: (requestId: number) => `/api/bid/request/${requestId}`,
    GET_DETAILS: (bidId: number) => `/api/bid/${bidId}`,
    ACCEPT: (bidId: number) => `/api/bid/${bidId}/accept`,
    REJECT: (bidId: number) => `/api/bid/${bidId}/reject`,
    UPDATE: (pharmacyId: number) => `/api/bid/pharmacy/${pharmacyId}`,
    ADMIN_ALL: "/api/bid/admin/all",
    ADMIN_DETAILS: (bidId: number) => `/api/bid/admin/${bidId}`,
  },
  ORDERS: {
    MY_ORDERS: "/api/orders/my",
    MY_ORDER_DETAILS: (id: number) => `/api/orders/my/${id}`,
    PHARMACY_ORDERS: "/api/orders",
    PHARMACY_ORDER_DETAILS: (id: number) => `/api/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/api/orders/${id}/status`,
    ADMIN_ALL: "/api/orders/admin",
    ADMIN_DETAILS: (id: number) => `/api/orders/admin/${id}`,
    CREATE_FROM_BID: (bidId: number) => `/api/orders/create-from-bid/${bidId}`,
  },
  PHARMACY: {
    REGISTER: "/api/pharmacy/register",
    MY_PROFILE: (pharmacyId: number) =>
      `/api/pharmacy/my-profile/${pharmacyId}`,
    BASIC_INFO: (pharmacyId: number) => `/api/pharmacy/${pharmacyId}`,
    DASHBOARD_SNAPSHOT: (pharmacyId: number) =>
      `/api/pharmacy/${pharmacyId}/dashboard/snapshot`,
  },
  PROFILE: {
    GET: "/api/patientprofile",
    UPDATE: "/api/patientprofile",
    ADMIN_ALL: "/api/patient-profile/all",
  },
  ADDRESSES: {
    BASE: "/api/patientaddresses",
    BY_ID: (id: number) => `/api/patientaddresses/${id}`,
    SET_DEFAULT: (id: number) => `/api/patientaddresses/${id}/set-default`,
  },
  NOTIFICATIONS: {
    BASE: "/api/notifications",
    MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: "/api/notifications/read-all",
  },
  COMPLAINTS: {
    SUBMIT: "/api/complaints/submit",
    MY_COMPLAINTS: "/api/complaints/my-complaints",
    ADMIN_ALL: "/api/complaints/platform-complaints",
    ADMIN_DETAILS: (id: number) => `/api/complaints/${id}`,
    UPDATE_STATUS: (id: number) => `/api/complaints/${id}/status`,
  },
} as const;
