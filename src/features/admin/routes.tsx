import React, { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { UserRole } from "@/types/auth.types";

// Lazy-loaded Admin Pages
const AdminDashboardPage = React.lazy(() => import("@/features/admin/pages/DashboardPage"));
const AdminPatientsPage = React.lazy(() => import("@/features/admin/pages/PatientsPage"));
const AdminBidsPage = React.lazy(() => import("@/features/admin/pages/BidsPage"));
const AdminBidDetailsPage = React.lazy(() => import("@/features/admin/pages/BidDetailsPage"));
const AdminComplaintsPage = React.lazy(() => import("@/features/admin/pages/ComplaintsPage"));
const AdminComplaintDetailsPage = React.lazy(() => import("@/features/admin/pages/ComplaintDetailsPage"));
const AdminOrdersPage = React.lazy(() => import("@/features/admin/pages/OrdersPage"));
const AdminOrderDetailsPage = React.lazy(() => import("@/features/admin/pages/OrderDetailsPage"));
const AdminPrescriptionRequestsPage = React.lazy(() => import("@/features/admin/pages/PrescriptionRequestsPage"));
const AdminPrescriptionRequestDetailsPage = React.lazy(() => import("@/features/admin/pages/PrescriptionRequestDetailsPage"));

// Guards (same pattern as main router)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const RoleGuard = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: UserRole[] }) => {
  const hasRole = useAuthStore((state) => state.hasRole);
  const isAuthorized = allowedRoles.some((role) => hasRole(role));
  if (!isAuthorized) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
);

/**
 * Admin route configuration.
 * Each page renders its own AdminLayout internally,
 * so no layout wrapper element is needed at the route level.
 */
export const adminRoutes = {
  path: "admin",
  element: (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["Admin"]}>
        <Outlet />
      </RoleGuard>
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="dashboard" replace /> },
    { path: "dashboard", element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper> },
    { path: "patients", element: <SuspenseWrapper><AdminPatientsPage /></SuspenseWrapper> },
    { path: "prescription-requests", element: <SuspenseWrapper><AdminPrescriptionRequestsPage /></SuspenseWrapper> },
    { path: "prescription-requests/:requestId", element: <SuspenseWrapper><AdminPrescriptionRequestDetailsPage /></SuspenseWrapper> },
    { path: "bids", element: <SuspenseWrapper><AdminBidsPage /></SuspenseWrapper> },
    { path: "bids/:bidId", element: <SuspenseWrapper><AdminBidDetailsPage /></SuspenseWrapper> },
    { path: "complaints", element: <SuspenseWrapper><AdminComplaintsPage /></SuspenseWrapper> },
    { path: "complaints/:complaintId", element: <SuspenseWrapper><AdminComplaintDetailsPage /></SuspenseWrapper> },
    { path: "orders", element: <SuspenseWrapper><AdminOrdersPage /></SuspenseWrapper> },
    { path: "orders/:orderId", element: <SuspenseWrapper><AdminOrderDetailsPage /></SuspenseWrapper> },
  ],
};
