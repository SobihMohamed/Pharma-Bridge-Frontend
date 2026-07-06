import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

// ---------- Types ----------

export interface DashboardStatistics {
  totalPatients: number;
  patientGrowthPercent: number;
  activeBidsCount: number;
  expiringBidsCount: number;
  todayOrdersCount: number;
  fulfillmentRatePercent: number;
}

export interface DashboardButton {
  label: string;
  action: string;
}

export interface DashboardModule {
  id: string | number;
  title: string;
  description: string;
  imageId?: string;
  primaryButton?: DashboardButton;
  secondaryButton?: DashboardButton;
}

export interface DashboardActivity {
  id: string | number;
  action: string;
  category: string;
  activityAt: string;
  status: string;
  performedBy?: string;
}

export interface AdminDashboardData {
  statistics: DashboardStatistics;
  modules: DashboardModule[];
  recentActivity: DashboardActivity[];
}

// ---------- Query Hook ----------

export const useGetAdminDashboardQuery = () => {
  return useQuery<AdminDashboardData>({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const response = await api.get<AdminDashboardData>('/api/admin/dashboard');
      // Unwrap the ApiResponse envelope
      return (response as any).data ?? response;
    },
    staleTime: 30_000, // 30 seconds — dashboard data stays fresh
    retry: 1,
  });
};
