import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { useGetPharmacyDashboardQuery } from '../hooks/useGetPharmacyDashboardQuery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wallet, 
  Tag, 
  PackageCheck, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Package,
  Zap,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// ─── Inline Skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
);

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
  }).format(amount);
}

function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}

function GrowthIndicator({ value, label }: { value: number; label: string }) {
  if (value > 0) {
    return (
      <div className="flex items-center text-[13px] text-emerald-600 font-medium mt-2">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span>+{value}%</span>
        <span className="text-slate-500 ml-1.5">{label}</span>
      </div>
    );
  }
  if (value < 0) {
    return (
      <div className="flex items-center text-[13px] text-rose-600 font-medium mt-2">
        <TrendingDown className="w-4 h-4 mr-1" />
        <span>{value}%</span>
        <span className="text-slate-500 ml-1.5">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center text-[13px] text-slate-500 font-medium mt-2">
      <Minus className="w-4 h-4 mr-1 text-slate-400" />
      <span>No change</span>
      <span className="ml-1.5">{label}</span>
    </div>
  );
}

function getActivityIcon(type: string) {
  const t = type?.toLowerCase() ?? '';
  if (t === 'order') {
    return (
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
        <Package className="w-4 h-4 text-blue-600" />
      </div>
    );
  }
  if (t === 'bid') {
    return (
      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200">
        <Zap className="w-4 h-4 text-amber-600" />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
      <Info className="w-4 h-4 text-slate-600" />
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PharmacyOwnerDashboard() {
  const { data: profile } = useMyPharmacyProfileQuery();
  const pharmacyId = profile?.id;

  const { data: dashboard, isLoading } = useGetPharmacyDashboardQuery(pharmacyId);

  if (isLoading || !dashboard) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        
        {/* Top KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="border-0 shadow-sm"><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
          ))}
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-sm"><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
          <Card className="border-0 shadow-sm"><CardContent className="p-6"><Skeleton className="h-[400px] w-full" /></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Pharmacy Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Real-time insights and analytics for your operations.</p>
      </div>

      {/* ── KPI Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Total Revenue</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(dashboard.revenue)}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
                <Wallet className="w-5 h-5 text-teal-600" />
              </div>
            </div>
            <GrowthIndicator value={dashboard.revenueGrowth} label="from last month" />
          </CardContent>
        </Card>

        {/* Active Bids */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Active Bids</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dashboard.activeBids}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Tag className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <GrowthIndicator value={dashboard.activeBidsGrowth} label="vs yesterday" />
          </CardContent>
        </Card>

        {/* Completed Orders */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Completed Orders</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dashboard.completedOrders}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <PackageCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <GrowthIndicator value={dashboard.completedOrdersGrowth} label="from last week" />
          </CardContent>
        </Card>

        {/* New Patients */}
        <Card className="border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">New Patients</p>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{dashboard.newPatients}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <GrowthIndicator value={dashboard.newPatientsGrowth} label="from last month" />
          </CardContent>
        </Card>

      </div>

      {/* ── Charts & Timeline Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Area Chart */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="border-b border-slate-100/50 pb-4 bg-slate-50/30">
            <CardTitle className="text-base font-bold text-slate-800">Revenue Trajectory</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex-1 min-h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => `EGP ${val}`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0d9488" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Timeline */}
        <Card className="border border-slate-200 shadow-sm bg-white flex flex-col h-full max-h-[500px]">
          <CardHeader className="border-b border-slate-100/50 pb-4 bg-slate-50/30">
            <CardTitle className="text-base font-bold text-slate-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 overflow-y-auto flex-1">
            {!dashboard.recentActivities || dashboard.recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <Info className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-500 text-sm">No recent activity found.</p>
              </div>
            ) : (
              <div className="relative pl-3 space-y-6 before:absolute before:inset-0 before:ml-7 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                {dashboard.recentActivities.map((activity, i) => (
                  <div key={i} className="relative flex gap-4">
                    {/* Icon */}
                    <div className="relative z-10 shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{activity.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap ml-2">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
