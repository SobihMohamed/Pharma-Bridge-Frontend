import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface RevenueChartDto {
  date: string;
  revenue: number;
}

export interface RecentActivityDto {
  title: string;
  description: string;
  createdAt: string;
  type: string; // 'Order', 'Bid', 'System'
}

export interface PharmacyDashboardData {
  activeBids: number;
  revenue: number;
  newPatients: number;
  completedOrders: number;
  activeBidsGrowth: number;
  revenueGrowth: number;
  newPatientsGrowth: number;
  completedOrdersGrowth: number;
  revenueChart: RevenueChartDto[];
  recentActivities: RecentActivityDto[];
}

export const useGetPharmacyDashboardQuery = (pharmacyId: number | undefined) => {
  return useQuery<PharmacyDashboardData>({
    queryKey: ['pharmacyDashboard', pharmacyId],
    queryFn: async () => {
      const response = await api.get(`/api/pharmacy/${pharmacyId}/dashboard`);
      return (response as any).data?.data ?? (response as any).data;
    },
    enabled: !!pharmacyId,
  });
};
