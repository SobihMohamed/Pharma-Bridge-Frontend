import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";
import { UserRole } from "@/types/auth.types";
import AuthLayout from "@/components/layouts/AuthLayout";
import MainLayout from "@/components/layouts/MainLayout";
import NotFound from "@/pages/NotFound";

// Lazy-loaded pages
const IndexPage = React.lazy(() => import("@/pages/Index"));
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage"));
const RequestsPage = React.lazy(() => import("@/features/prescription-requests/pages/RequestsPage"));
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
const PharmacyRegistrationPage = React.lazy(() => import("@/features/pharmacy/pages/RegistrationPage"));

// Guards
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Patient"]}>
              <SuspenseWrapper>
                <IndexPage />
              </SuspenseWrapper>
            </RoleGuard>
          </ProtectedRoute>
        ),
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
        element: <PharmacyLayout />,
        children: [
          { path: "dashboard", element: <SuspenseWrapper><PharmacyDashboardPage /></SuspenseWrapper> },
          { path: "requests", element: <SuspenseWrapper><PharmacyRequestsPage /></SuspenseWrapper> },
          { path: "requests/:id/bid", element: <SuspenseWrapper><PharmacySubmitBidPage /></SuspenseWrapper> },
          { path: "my-bids", element: <SuspenseWrapper><PharmacyMyBidsPage /></SuspenseWrapper> },
          { path: "my-bids/:id", element: <SuspenseWrapper><PharmacyBidDetailsPage /></SuspenseWrapper> },
          { path: "orders", element: <SuspenseWrapper><PharmacyOrdersPage /></SuspenseWrapper> },
          { path: "orders/:id", element: <SuspenseWrapper><PharmacyOrderDetailsPage /></SuspenseWrapper> },
          { path: "profile", element: <SuspenseWrapper><PharmacyProfilePage /></SuspenseWrapper> },
        ],
      },
      {
        path: "pharmacy/register",
        element: (
          <SuspenseWrapper>
            <PharmacyRegistrationPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "admin/*",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["Admin"]}>
              <div>Admin Dashboard Placeholder</div>
            </RoleGuard>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
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
        path: "/forgot-password",
        element: <div>Forgot Password Placeholder</div>,
      },
      {
        path: "/verify-otp",
        element: <div>Verify OTP Placeholder</div>,
      },
      {
        path: "/reset-password",
        element: <div>Reset Password Placeholder</div>,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <div>Unauthorized Access</div>,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
