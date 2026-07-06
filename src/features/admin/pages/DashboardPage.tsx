import AdminLayout from '../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import {
  useGetAdminDashboardQuery,
  DashboardActivity,
  DashboardModule,
} from '../hooks/useAdminDashboardQuery';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Users,
  Tag,
  AlertTriangle,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  ArrowUpRight,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Inline Skeleton — no separate component file needed
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

// Inline Table components
const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="w-full text-left border-collapse">{children}</table>
);
const TableHeader = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
const TableBody = ({ children }: { children: React.ReactNode }) => <tbody className="divide-y divide-gray-50">{children}</tbody>;
const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-b border-gray-50 ${className}`}>{children}</tr>
);
const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-4 py-3 text-left font-semibold ${className}`}>{children}</th>
);
const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return isToday ? `Today, ${time}` : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
  } catch {
    return ts;
  }
}

function getStatusBadge(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('complet') || s.includes('success') || s.includes('active') || s.includes('approved'))
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">{status}</Badge>;
  if (s.includes('pending') || s.includes('review') || s.includes('warning'))
    return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">{status}</Badge>;
  if (s.includes('urgent') || s.includes('error') || s.includes('fail') || s.includes('reject') || s.includes('cancel'))
    return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">{status}</Badge>;
  return <Badge variant="secondary">{status}</Badge>;
}

const MODULE_IMAGES: Record<string, string> = {
  default:
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
};

const MODULE_GRADIENTS = [
  'from-teal-500 to-emerald-600',
  'from-blue-500 to-indigo-600',
  'from-rose-500 to-red-600',
  'from-purple-500 to-violet-600',
  'from-orange-500 to-amber-600',
];

// ─── Stat Card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  subtext?: string;
  gradient: string;
}

function StatCard({ label, value, icon, trend, trendLabel, subtext, gradient }: StatCardProps) {
  const isPositive = (trend ?? 0) >= 0;
  return (
    <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* gradient top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-gray-900 tabular-nums">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {isPositive ? '+' : ''}{trend}%
            </span>
          )}
          {trendLabel && <span className="text-xs text-gray-500">{trendLabel}</span>}
          {subtext && (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {subtext}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Custom Donut Label ───────────────────────────────────────────────────────

const DonutCenterLabel = ({ cx, cy, value }: { cx: number; cy: number; value: number }) => (
  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
    <tspan x={cx} dy="-6" fontSize="28" fontWeight="900" fill="#0f172a">
      {value}%
    </tspan>
    <tspan x={cx} dy="24" fontSize="11" fill="#64748b" fontWeight="600">
      Fulfilled
    </tspan>
  </text>
);

// ─── Skeleton Loading ─────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-xl" />
                </div>
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[0, 1].map((i) => (
            <Card key={i} className="border-0 shadow-md">
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent><Skeleton className="h-56 w-full rounded-xl" /></CardContent>
            </Card>
          ))}
        </div>

        {/* Modules */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-md">
          <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
          <CardContent className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();

  if (isLoading) return <DashboardSkeleton />;

  // Fallback gracefully when endpoint not yet live
  const stats = data?.statistics ?? {
    totalPatients: 0,
    patientGrowthPercent: 0,
    activeBidsCount: 0,
    expiringBidsCount: 0,
    todayOrdersCount: 0,
    fulfillmentRatePercent: 0,
  };
  const modules: DashboardModule[] = data?.modules ?? [];
  const activity: DashboardActivity[] = data?.recentActivity ?? [];

  const fulfillRate = Math.min(Math.max(Math.round(stats.fulfillmentRatePercent ?? 0), 0), 100);
  const donutData = [
    { name: 'Fulfilled', value: fulfillRate },
    { name: 'Remaining', value: 100 - fulfillRate },
  ];
  const bidsBarData = [
    { name: 'Active', count: stats.activeBidsCount ?? 0 },
    { name: 'Expiring', count: stats.expiringBidsCount ?? 0 },
  ];

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 flex-1 space-y-8">

        {/* ── Page Header ──────────────────────────────────── */}
        <section className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Overview</h2>
            <p className="text-sm text-gray-500 mt-1">
              Real-time analytics and platform health for today.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </div>
        </section>

        {isError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Could not reach the dashboard endpoint — showing placeholder data.
          </div>
        )}

        {/* ── Stat Cards ────────────────────────────────────── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            label="Total Patients"
            value={stats.totalPatients}
            icon={<Users className="w-5 h-5" />}
            trend={stats.patientGrowthPercent}
            trendLabel="vs last month"
            gradient="from-teal-500 to-emerald-500"
          />
          <StatCard
            label="Active Bids"
            value={stats.activeBidsCount}
            icon={<Tag className="w-5 h-5" />}
            subtext={`${stats.expiringBidsCount} expiring soon`}
            gradient="from-blue-500 to-indigo-500"
          />
          <StatCard
            label="Today's Orders"
            value={stats.todayOrdersCount}
            icon={<ShoppingCart className="w-5 h-5" />}
            trendLabel={`${fulfillRate}% fulfillment`}
            gradient="from-purple-500 to-violet-500"
          />
          <StatCard
            label="Fulfillment Rate"
            value={`${fulfillRate}%`}
            icon={<Activity className="w-5 h-5" />}
            trend={fulfillRate - 100 < 0 ? fulfillRate - 100 : undefined}
            trendLabel={fulfillRate >= 90 ? 'Excellent' : fulfillRate >= 70 ? 'Good' : 'Needs attention'}
            gradient="from-rose-500 to-pink-500"
          />
        </section>

        {/* ── Charts Row ────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Donut — Fulfillment Rate */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                Fulfillment Rate
              </CardTitle>
              <p className="text-xs text-gray-500">Orders successfully delivered today</p>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={72}
                      outerRadius={96}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill="#14b8a6" />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                    <DonutCenterLabel cx={0} cy={0} value={fulfillRate} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />Fulfilled ({fulfillRate}%)
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />Remaining ({100 - fulfillRate}%)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart — Bids Overview */}
          <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Bids Overview
              </CardTitle>
              <p className="text-xs text-gray-500">Active bids vs. at-risk expiring bids</p>
            </CardHeader>
            <CardContent>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bidsBarData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }} barCategoryGap="40%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: '13px' }}
                      cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      <Cell fill="#3b82f6" />
                      <Cell fill="#f97316" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />Active Bids
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />Expiring Soon
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ── Module Quick Access ───────────────────────────── */}
        {(modules.length > 0 || true) && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Module Quick Access</h3>
              <Button variant="outline" size="sm" className="text-xs">
                Configure Layout
              </Button>
            </div>

            {modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {modules.map((mod, idx) => (
                  <ModuleCard key={mod.id} module={mod} gradientIndex={idx} />
                ))}
              </div>
            ) : (
              /* Fallback hard-coded modules when API doesn't return them */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FALLBACK_MODULES.map((mod, idx) => (
                  <ModuleCard key={idx} module={mod} gradientIndex={idx} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Recent Activity Table ─────────────────────────── */}
        <section>
          <Card className="border-0 shadow-md">
            <CardHeader className="border-b border-gray-100 bg-gray-50/60 rounded-t-xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-gray-500">
                  Recent System Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700 text-xs gap-1">
                  View Audit Log <ArrowUpRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {activity.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-gray-400 gap-2">
                  <Package className="w-8 h-8" />
                  <p className="text-sm">No recent activity to display</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-b border-gray-100">
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-6">Timestamp</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Action</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activity.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-50/60 transition-colors border-b border-gray-50">
                          <TableCell className="pl-6 font-mono text-xs text-gray-500 whitespace-nowrap">
                            {formatTimestamp(row.activityAt)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{row.category}</TableCell>
                          <TableCell className="text-sm text-gray-800 font-medium max-w-xs">{row.action}</TableCell>
                          <TableCell>{getStatusBadge(row.status)}</TableCell>
                          <TableCell className="text-sm text-gray-500">{row.performedBy ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 flex justify-between items-center border-t border-gray-100 bg-white text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </div>
          <span className="text-gray-200">|</span>
          <span className="font-mono">v2.5.0-stable</span>
        </div>
        <div>© 2024 PharmaBridge Logistics Solutions</div>
      </footer>
    </AdminLayout>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({ module: mod, gradientIndex }: { module: DashboardModule; gradientIndex: number }) {
  const navigate = useNavigate();
  const gradient = MODULE_GRADIENTS[gradientIndex % MODULE_GRADIENTS.length];
  const imageUrl = MODULE_IMAGES[mod.imageId ?? ''] ?? MODULE_IMAGES.default;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-48 flex flex-row">
      {/* Image section */}
      <div className="w-1/3 h-full relative overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={mod.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-40 group-hover:opacity-20 transition-opacity duration-300`} />
      </div>

      {/* Content section */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-gray-900 text-base leading-snug">{mod.title}</h4>
          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{mod.description}</p>
        </div>
        <div className="flex gap-2 mt-3">
          {mod.primaryButton && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${mod.primaryButton!.action}`);
              }}
              className={`h-8 text-xs bg-gradient-to-r ${gradient} border-0 text-white hover:opacity-90 transition-opacity shadow-sm`}
            >
              {mod.primaryButton.label}
            </Button>
          )}
          {mod.secondaryButton && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/${mod.secondaryButton!.action}`);
              }}
              className="h-8 text-xs"
            >
              {mod.secondaryButton.label}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Fallback modules ────────────────────────────────────────────────────────

const FALLBACK_MODULES: DashboardModule[] = [
  {
    id: 1,
    title: 'Patient Directory',
    description: 'Manage enrollments, medical records, and eligibility statuses across all regions.',
    primaryButton: { label: 'Open Module', action: 'admin/patients' },
    secondaryButton: { label: 'Add Patient', action: 'admin/patients/new' },
  },
  {
    id: 2,
    title: 'Bidding Engine',
    description: 'Review active procurement bids, negotiate contracts, and finalize logistics pricing.',
    primaryButton: { label: 'Open Module', action: 'admin/bids' },
    secondaryButton: { label: 'Active Reports', action: 'admin/bids/reports' },
  },
  {
    id: 3,
    title: 'Complaints Center',
    description: 'Track issues from pharmacies and patients. Ensure rapid resolution of logistics errors.',
    primaryButton: { label: 'Review Pending', action: 'admin/complaints?status=Pending' },
    secondaryButton: { label: 'Archive', action: 'admin/complaints/archive' },
  },
  {
    id: 4,
    title: 'Order Management',
    description: "Full visibility of today\u2019s logistics pipeline, from warehouse dispatch to final delivery.",
    primaryButton: { label: 'Open Module', action: 'admin/orders' },
    secondaryButton: { label: 'Track Shipments', action: 'admin/orders/tracking' },
  },
];
