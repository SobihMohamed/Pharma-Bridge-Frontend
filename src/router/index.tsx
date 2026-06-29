import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { UserRole } from "@/types/auth.types";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import NotFound from "@/pages/NotFound";
import { adminRoutes } from "@/features/admin/routes";
import GlobalError from "@/components/errors/GlobalError";

// Lazy-loaded pages
const PatientHomePage = React.lazy(() => import("@/features/dashboard/pages/PatientHomePage"));
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgetPasswordPage = React.lazy(() => import("@/features/auth/pages/ForgetPasswordPage"));
const VerifyOtpPage = React.lazy(() => import("@/features/auth/pages/VerifyOtpPage"));
const ResetPasswordPage = React.lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const RequestsPage = React.lazy(() => import("@/features/prescription-requests/pages/RequestsPage"));
const NewRequestPage = React.lazy(() => import("@/features/prescription-requests/pages/NewRequestPage"));
const RequestDetailsPage = React.lazy(() => import("@/features/prescription-requests/pages/RequestDetailsPage"));
const OrdersPage = React.lazy(() => import("@/features/orders/pages/OrdersPage"));
const OrderDetailsPage = React.lazy(() => import("@/features/orders/pages/OrderDetailsPage"));
const NotificationsPage = React.lazy(() => import("@/features/notifications/pages/NotificationsPage"));
const ComplaintsPage = React.lazy(() => import("@/features/complaints/pages/ComplaintsPage"));
const ProfilePage = React.lazy(() => import("@/features/profile/pages/ProfilePage"));

// Pharmacy Pages
import { PharmacyLayout } from "@/features/pharmacy/components/layout/PharmacyLayout";
const PharmacyDashboardPage = React.lazy(() => import("@/features/pharmacy/pages/DashboardPage"));
const PharmacyRequestsPage = React.lazy(() => import("@/features/pharmacy/pages/NearbyRequestsPage"));
const PharmacySubmitBidPage = React.lazy(() => import("@/features/pharmacy/pages/SubmitBidPage"));
const PharmacyMyBidsPage = React.lazy(() => import("@/features/pharmacy/pages/MyBidsPage"));
const PharmacyBidDetailsPage = React.lazy(() => import("@/features/pharmacy/pages/BidDetailsPage"));
const PharmacyOrdersPage = React.lazy(() => import("@/features/pharmacy/pages/OrdersPage"));
const PharmacyOrderDetailsPage = React.lazy(() => import("@/features/pharmacy/pages/OrderDetailsPage"));
const PharmacyProfilePage = React.lazy(() => import("@/features/pharmacy/pages/ProfilePage"));
const PharmacyLiveRequestsPage = React.lazy(() => import("@/features/pharmacy/pages/LiveRequestsPage"));

// ----------------------------------------------------------------------
// Guards & Redirects
// ----------------------------------------------------------------------

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-teal-600">Loading...</div>}>
    {children}
  </Suspense>
);

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

const RootRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = useAuthStore((state) => state.hasRole);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (hasRole("PharmacyOwner")) {
    return <Navigate to="/pharmacy/dashboard" replace />;
  }

  if (hasRole("Patient")) {
    return (
      <SuspenseWrapper>
        <PatientHomePage />
      </SuspenseWrapper>
    );
  }

  // Fallback if role is unhandled
  return <Navigate to="/unauthorized" replace />;
};

// ----------------------------------------------------------------------
// Router Configuration
// ----------------------------------------------------------------------

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        path: "requests",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <RequestsPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "requests/new",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <NewRequestPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "requests/:id",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <RequestDetailsPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <OrdersPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "orders/:id",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <OrderDetailsPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <SuspenseWrapper>
              <NotificationsPage />
            </SuspenseWrapper>
          </ProtectedRoute>
        ),
      },
      {
        path: "complaints",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <ComplaintsPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
      // Pharmacy Routes
      {
        path: "pharmacy",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["PharmacyOwner"]}>
              <PharmacyLayout />
            </RoleGuard>
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <SuspenseWrapper><PharmacyDashboardPage /></SuspenseWrapper> },
          { path: "requests", element: <SuspenseWrapper><PharmacyRequestsPage /></SuspenseWrapper> },
          { path: "live-requests", element: <SuspenseWrapper><PharmacyLiveRequestsPage /></SuspenseWrapper> },
          { path: "requests/:id/bid", element: <SuspenseWrapper><PharmacySubmitBidPage /></SuspenseWrapper> },
          { path: "my-bids", element: <SuspenseWrapper><PharmacyMyBidsPage /></SuspenseWrapper> },
          { path: "my-bids/:id", element: <SuspenseWrapper><PharmacyBidDetailsPage /></SuspenseWrapper> },
          { path: "orders", element: <SuspenseWrapper><PharmacyOrdersPage /></SuspenseWrapper> },
          { path: "orders/:id", element: <SuspenseWrapper><PharmacyOrderDetailsPage /></SuspenseWrapper> },
          { path: "profile", element: <SuspenseWrapper><PharmacyProfilePage /></SuspenseWrapper> },
        ],
      },
    ],
  },
  // Admin Routes (top-level — AdminLayout provides its own full-page layout)
  adminRoutes,
  {
    element: <AuthLayout />,
    errorElement: <GlobalError />,
    children: [
      {
        path: "/login",
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/register",
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/forget-password",
        element: (
          <SuspenseWrapper>
            <ForgetPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/verify-otp",
        element: (
          <SuspenseWrapper>
            <VerifyOtpPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/reset-password",
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    path: "/unauthorized",
    element: (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Unauthorized Access</h1>
        <p className="text-gray-500">You do not have permission to view this page.</p>
      </div>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
