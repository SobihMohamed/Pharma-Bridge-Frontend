import { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/lib/api';
import {
  useGetAdminDashboardQuery,
  DashboardActivity,
  DashboardModule,
} from '../hooks/useAdminDashboardQuery';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Search,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  AlertTriangle,
  Users,
  Tag,
  ShoppingCart,
  Layers,
  Package,
} from 'lucide-react';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? '').toLowerCase();
  if (s.includes('complet') || s.includes('success') || s.includes('active') || s.includes('approved') || s === 'done')
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
        {status}
      </span>
    );
  if (s.includes('pending') || s.includes('review'))
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
        {status}
      </span>
    );
  if (s.includes('urgent') || s.includes('fail') || s.includes('reject') || s.includes('cancel') || s.includes('error'))
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-500 border border-red-100">
        {status}
      </span>
    );
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
      {status}
    </span>
  );
}

// ─── Sparkline gradient data (shape only — value comes from API) ──────────────

const SPARKLINE_SHAPE = [
  { v: 30 }, { v: 45 }, { v: 28 }, { v: 60 }, { v: 42 }, { v: 55 },
  { v: 38 }, { v: 70 }, { v: 52 }, { v: 65 }, { v: 48 }, { v: 58 },
];

// Bar shape for orders chart
const buildBarData = (active: number, expiring: number) => [
  { name: 'Active', value: active },
  { name: 'Expiring', value: expiring },
];

// ─── Module card colours ──────────────────────────────────────────────────────

const MODULE_GRADIENTS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-rose-500 to-red-600',
  'from-purple-500 to-violet-600',
];

const VALID_ROUTES = [
  'admin/patients',
  'admin/pharma-owners',
  'admin/pharmacies',
  'admin/prescription-requests',
  'admin/bids',
  'admin/complaints',
  'admin/orders',
];

const FALLBACK_MODULES: DashboardModule[] = [
  {
    id: 1,
    title: 'Patient Directory',
    description: 'Manage patient accounts, medical records, and platform eligibility verifications.',
    primaryButton: { label: 'Open', action: 'admin/patients' },
    secondaryButton: { label: 'Add New', action: 'admin/patients/new' },
  },
  {
    id: 2,
    title: 'Bidding Engine',
    description: 'Track active procurement bids, negotiate contracts, and audit store pricing rules.',
    primaryButton: { label: 'Open', action: 'admin/bids' },
    secondaryButton: { label: 'Reports', action: 'admin/bids/reports' },
  },
  {
    id: 3,
    title: 'Complaints Center',
    description: 'Resolve disputes from pharmacies and patients and track system tickets.',
    primaryButton: { label: 'Review', action: 'admin/complaints?status=Pending' },
    secondaryButton: { label: 'Archive', action: 'admin/complaints/archive' },
  },
  {
    id: 4,
    title: 'Order Management',
    description: 'Full logistics visibility of active shipments, fulfillment statuses, and metrics.',
    primaryButton: { label: 'Open', action: 'admin/orders' },
    secondaryButton: { label: 'Track', action: 'admin/orders/tracking' },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return isToday
      ? `Today, ${time}`
      : `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${time}`;
  } catch {
    return ts;
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_HEX = [
  '#3b82f6', // blue
  '#fb7185', // rose
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#14b8a6', // teal
];

function avatarBg(i: number): React.CSSProperties {
  return { backgroundColor: AVATAR_HEX[i % AVATAR_HEX.length] };
}

function getProfileStackItems(activity: DashboardActivity[]) {
  const uniqueNames = new Map<string, DashboardActivity>();

  activity.forEach((item) => {
    const key = (item.performedBy ?? '').trim();
    if (key && !uniqueNames.has(key)) {
      uniqueNames.set(key, item);
    }
  });

  return Array.from(uniqueNames.values()).slice(0, 3);
}

function getLookupTerms(activity: DashboardActivity) {
  return [activity.performedBy].filter(Boolean) as string[];
}

async function resolvePatientPath(activity: DashboardActivity): Promise<string | null> {
  const lookup = getLookupTerms(activity).join(' ').trim();
  if (!lookup) return null;

  const response = await api.get('/api/patient-profile/all', {
    params: {
      PageIndex: 1,
      PageSize: 10,
      Search: lookup,
    },
  });

  const items = (response as any).data?.data ?? (response as any).data ?? [];
  if (!Array.isArray(items) || items.length === 0) return null;

  const exact = items.find((item) => (item.fullName ?? '').toLowerCase() === lookup.toLowerCase()) ?? items[0];
  return exact?.id ? `/admin/patients/${exact.id}` : null;
}

async function resolvePharmacyPath(activity: DashboardActivity): Promise<string | null> {
  const lookup = getLookupTerms(activity).join(' ').trim();
  if (!lookup) return null;

  const response = await api.get('/api/pharmacy/all', {
    params: {
      PageIndex: 1,
      PageSize: 10,
      Search: lookup,
    },
  });

  const items = (response as any).data?.data ?? (response as any).data ?? [];
  if (!Array.isArray(items) || items.length === 0) return null;

  const exact = items.find((item) => (item.pharmacyName ?? '').toLowerCase() === lookup.toLowerCase()) ?? items[0];
  return exact?.id ? `/admin/pharmacies/${exact.id}` : null;
}

async function resolveRelatedProfilePath(activity: DashboardActivity): Promise<string | null> {
  const haystack = [activity.category, activity.action, activity.performedBy].filter(Boolean).join(' ').toLowerCase();

  if (haystack.includes('patient')) {
    return resolvePatientPath(activity);
  }

  if (haystack.includes('pharmacy') || haystack.includes('pharma')) {
    return resolvePharmacyPath(activity);
  }

  return null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-100 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-6 bg-[#F4F6FA] min-h-screen">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-52 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </AdminLayout>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({
  module: mod,
  gradientIndex,
}: {
  module: DashboardModule;
  gradientIndex: number;
}) {
  const navigate = useNavigate();
  const gradient = MODULE_GRADIENTS[gradientIndex % MODULE_GRADIENTS.length];

  const go = (action: string, label: string) => {
    const path = action.replace(/^\//, '').split('?')[0];
    if (VALID_ROUTES.includes(path)) navigate(`/${path}`);
    else toast.info(`"${label}" is under development.`);
  };

  return (
    <div
      onClick={() => mod.primaryButton && go(mod.primaryButton.action, mod.title)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer p-5 flex flex-col gap-3"
    >
      {/* header */}
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200`}
        >
          <Layers className="w-5 h-5 text-white" />
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all duration-200" />
      </div>

      {/* title + desc */}
      <div>
        <h4 className="font-bold text-slate-800 text-sm leading-snug">{mod.title}</h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{mod.description}</p>
      </div>

      {/* buttons */}
      <div className="flex gap-2 mt-auto pt-1">
        {mod.primaryButton && (
          <button
            onClick={(e) => { e.stopPropagation(); go(mod.primaryButton!.action, mod.primaryButton!.label); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl bg-gradient-to-r ${gradient} text-white hover:opacity-90 transition-opacity shadow-sm`}
          >
            {mod.primaryButton.label}
          </button>
        )}
        {mod.secondaryButton && (
          <button
            onClick={(e) => { e.stopPropagation(); go(mod.secondaryButton!.action, mod.secondaryButton!.label); }}
            className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {mod.secondaryButton.label}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetAdminDashboardQuery();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  if (isLoading) return <DashboardSkeleton />;

  // ── Real data ──────────────────────────────────────────
  const stats = data?.statistics ?? {
    totalPatients: 0,
    patientGrowthPercent: 0,
    activeBidsCount: 0,
    expiringBidsCount: 0,
    todayOrdersCount: 0,
    fulfillmentRatePercent: 0,
  };
  const modules: DashboardModule[] = data?.modules?.length ? data.modules : FALLBACK_MODULES;
  const activity: DashboardActivity[] = data?.recentActivity ?? [];
  const profileStackItems = getProfileStackItems(activity);

  const fulfillRate = Math.min(Math.max(Math.round(stats.fulfillmentRatePercent ?? 0), 0), 100);
  const barData = buildBarData(stats.activeBidsCount ?? 0, stats.expiringBidsCount ?? 0);

  // Filter activity for search
  const filtered = activity.filter(
    (a) =>
      !search ||
      a.action?.toLowerCase().includes(search.toLowerCase()) ||
      a.category?.toLowerCase().includes(search.toLowerCase()) ||
      a.status?.toLowerCase().includes(search.toLowerCase()) ||
      (a.performedBy ?? '').toLowerCase().includes(search.toLowerCase()),
  );



  // Recent activity split: top 2 for the "recently processed" row
  const recentTwo = activity.slice(0, 2);

  const handleRelatedProfileClick = async (row: DashboardActivity) => {
    const profilePath = await resolveRelatedProfilePath(row);
    if (profilePath) {
      navigate(profilePath);
      return;
    }

    toast.info('No matching patient or pharmacy profile was found for this item.');
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 space-y-6 bg-[#F4F6FA] min-h-screen">

        {/* ── Page Header ─────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Welcome back — platform health at a glance.</p>
        </div>

        {isError && (
          <div className="p-4 bg-amber-50 border border-amber-200/70 rounded-xl text-amber-700 text-sm font-medium flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Could not load live data — some values may be unavailable.
          </div>
        )}

        {/* ── 4 Stat Cards ────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* 1 — Total Patients */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[190px]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-slate-700">Total Patients</p>
                <p className="text-3xl font-black text-slate-900 mt-1 tabular-nums">
                  {(stats.totalPatients ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {(stats.patientGrowthPercent ?? 0) >= 0
                ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-500" />
              }
              <span className={`text-xs font-bold ${(stats.patientGrowthPercent ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {(stats.patientGrowthPercent ?? 0) >= 0 ? '+' : ''}{stats.patientGrowthPercent ?? 0}%
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-slate-500">patient profiles</span>
              <div className="flex items-center shrink-0">
                <div className="flex items-center -space-x-2">
                  {profileStackItems.map((item, index) => {
                    const initialsText = initials(item.performedBy ?? item.category ?? 'SY');
                    const palette = [
                      { bg: '#8b5cf6', fg: '#ffffff' },
                      { bg: '#f59e0b', fg: '#ffffff' },
                      { bg: '#14b8a6', fg: '#ffffff' },
                    ][index % 3];

                    return (
                      <div
                        key={`${item.id}-${item.performedBy ?? index}`}
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: palette.bg }}
                        title={item.performedBy ?? item.category}
                      >
                        <span className="text-[10px] font-black leading-none" style={{ color: palette.fg }}>
                          {initialsText}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-white shadow-sm flex items-center justify-center ml-1">
                  <span className="text-[11px] font-black text-white">25+</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2 — Fulfillment Rate (sparkline) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-slate-700">Fulfillment Rate</p>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="h-14 -mx-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SPARKLINE_SHAPE} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke="#0ea5e9" strokeWidth={2} fill="url(#sg)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{fulfillRate}%</p>
            <div className="flex items-center gap-1.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">
                {fulfillRate >= 90 ? 'Excellent' : fulfillRate >= 70 ? 'Good' : 'Needs attention'}
              </span>
            </div>
          </div>

          {/* 3 — Orders (mini bar) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-slate-700">Order Statistics</p>
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-violet-500" />
              </div>
            </div>
            <div className="h-16 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 4, right: 0, left: -28, bottom: 0 }} barCategoryGap="35%">
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', fontSize: '11px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                    cursor={{ fill: 'rgba(139,92,246,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#f97316" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-1 tabular-nums">
              {(stats.todayOrdersCount ?? 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">orders today</p>
          </div>

          {/* 4 — Active Bids CTA (teal gradient) */}
          <div
            style={{ background: 'linear-gradient(to bottom right, #4dd566, #0369a1)' }}
            className="rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-3 right-4 text-4xl select-none font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>✦</div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Active Bids</p>
                <p className="text-4xl font-black text-white mt-0.5 tabular-nums">
                  {stats.activeBidsCount ?? 0}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-white font-bold text-sm leading-snug">
              {stats.expiringBidsCount ?? 0} Bids<br />Expiring Soon
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => toast.info('Bid reports are under development.')}
                className="flex-1 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => navigate('/admin/bids')}
                className="flex-1 py-2 rounded-xl bg-white text-[#0369a1] text-xs font-black hover:bg-white/90 transition-colors shadow-sm"
              >
                View All
              </button>
            </div>
          </div>
        </div>

        {/* ── Recently Processed ──────────────────────────── */}
        {recentTwo.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-800">Recently Processed</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentTwo.map((a, i) => (
                <div
                  key={a.id}
                  onClick={() => void handleRelatedProfileClick(a)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      void handleRelatedProfileClick(a);
                    }
                  }}
                  className="group bg-white rounded-2xl px-5 py-4 border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-200"
                >
                  <div style={avatarBg(i)} className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                    {initials(a.performedBy ?? a.category ?? 'SY')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-slate-900">{a.performedBy ?? 'System'}</p>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{a.action}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={a.status} />
                    <button
                      type="button"
                      onClick={(e) => e.stopPropagation()}
                      className="text-slate-300 opacity-60 transition-all duration-200 group-hover:opacity-100 group-hover:text-slate-500"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Transactions / Activity Table ───────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50">
            <h2 className="text-base font-bold text-slate-800">
              {activity.length > 0 ? 'Activity Log' : 'No Activity Yet'}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {activity.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-slate-300">
              <Package className="w-10 h-10" />
              <p className="text-sm font-semibold text-slate-400">No activity records to display</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-6 py-3.5">Performed By</th>
                      <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3.5">Category</th>
                      <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3.5">Action</th>
                      <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3.5">Status</th>
                      <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-4 py-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                          No results match your search
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, i) => (
                        <tr
                          key={row.id}
                          onClick={() => void handleRelatedProfileClick(row)}
                          className="group cursor-pointer transition-all duration-200 hover:bg-slate-50/70 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div style={avatarBg(i)} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
                                {initials(row.performedBy ?? row.category ?? 'SY')}
                              </div>
                              <span className="text-sm font-semibold text-slate-700 transition-colors duration-200 group-hover:text-slate-900">
                                {row.performedBy ?? 'System'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-600 font-medium">{row.category}</td>
                          <td className="px-4 py-4 text-sm text-slate-600 max-w-xs truncate">{row.action}</td>
                          <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                          <td className="px-4 py-4 text-sm text-slate-500 whitespace-nowrap font-mono">
                            {formatTimestamp(row.activityAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">
                  Showing {filtered.length} of {activity.length} records
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-semibold text-slate-500">Live</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Module Directory ─────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800">Module Directory</h2>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Access</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map((mod, idx) => (
              <ModuleCard key={mod.id} module={mod} gradientIndex={idx} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-between items-center text-xs text-slate-400 font-medium pt-2 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Operational
            </span>
            <span className="text-slate-200">|</span>
            <span className="font-mono">v2.5.0-stable</span>
          </div>
          <span>© 2026 PharmaBridge Logistics Solutions</span>
        </footer>

      </div>
    </AdminLayout>
  );
}
