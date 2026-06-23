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
      // Placeholders for Pharmacy and Admin Routes
      {
        path: "pharmacy/*",
        element: (
          <ProtectedRoute>
            <RoleGuard allowedRoles={["PharmacyOwner"]}>
              <div>Pharmacy Owner Dashboard Placeholder</div>
            </RoleGuard>
          </ProtectedRoute>
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
