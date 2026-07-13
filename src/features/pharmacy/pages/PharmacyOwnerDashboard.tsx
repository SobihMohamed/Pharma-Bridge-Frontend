import React, { useState, useEffect } from 'react';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import { useGetPharmacyDashboardQuery } from '../hooks/useGetPharmacyDashboardQuery';
import { motion } from 'framer-motion';
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
  Info,
  ArrowUpRight,
  BarChart3,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/* ─── Helpers ───────────────────────────────────────────────────────────── */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
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
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return isoString;
  }
}

/* ─── Animation ─────────────────────────────────────────────────────────── */
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
} as const;
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 20 } },
} as const;

/* ─── KPI Card definitions ──────────────────────────────────────────────── */
const kpiDefs = [
  {
    key: 'revenue' as const,
    growthKey: 'revenueGrowth' as const,
    label: 'Total Revenue',
    growthLabel: 'vs last month',
    icon: Wallet,
    iconClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    topBarClass: 'bg-emerald-500 dark:bg-emerald-400',
    badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    format: formatCurrency,
  },
  {
    key: 'activeBids' as const,
    growthKey: 'activeBidsGrowth' as const,
    label: 'Active Bids',
    growthLabel: 'vs yesterday',
    icon: Tag,
    iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20',
    topBarClass: 'bg-amber-500 dark:bg-amber-400',
    badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  },
  {
    key: 'completedOrders' as const,
    growthKey: 'completedOrdersGrowth' as const,
    label: 'Completed Orders',
    growthLabel: 'vs last week',
    icon: PackageCheck,
    iconClass: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/20',
    topBarClass: 'bg-sky-500 dark:bg-sky-400',
    badgeClass: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-400',
  },
  {
    key: 'newPatients' as const,
    growthKey: 'newPatientsGrowth' as const,
    label: 'New Patients',
    growthLabel: 'vs last month',
    icon: Users,
    iconClass: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20',
    topBarClass: 'bg-indigo-500 dark:bg-indigo-400',
    badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400',
  },
];

/* ─── Growth Badge ──────────────────────────────────────────────────────── */
function GrowthBadge({ value, label }: { value: number; label: string }) {
  if (value > 0) {
    return (
      <div className="flex items-center gap-1.5 mt-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-[10px] font-bold">
          <TrendingUp className="w-3 h-3" />
          +{value}%
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{label}</span>
      </div>
    );
  }
  if (value < 0) {
    return (
      <div className="flex items-center gap-1.5 mt-3">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-705 dark:bg-rose-950/30 dark:text-rose-400 text-[10px] font-bold">
          <TrendingDown className="w-3 h-3" />
          {value}%
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{label}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 mt-3">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-650 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-bold">
        <Minus className="w-3 h-3" />
        0%
      </span>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{label}</span>
    </div>
  );
}

function ActivityIcon({ type, classes }: { type: string; classes: { bg: string; text: string } }) {
  const t = type?.toLowerCase() ?? '';
  const isOrder = t === 'ordercompleted';
  return (
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${classes.bg}`}>
      {isOrder ? (
        <Package className={`w-4 h-4 ${classes.text}`} />
      ) : (
        <Zap className={`w-4 h-4 ${classes.text}`} />
      )}
    </div>
  );
}

/* ─── Custom Tooltip ────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-3 shadow-lg border border-slate-800">
      <p className="text-[10px] text-slate-400 dark:text-slate-550 mb-0.5 font-semibold">{label}</p>
      <p className="text-sm font-black text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  const shimmerStyle = "animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl";
  return (
    <div className="flex flex-col gap-6 pt-8 px-6 pb-6">
      <div className="flex flex-col gap-2">
        <div className={`${shimmerStyle} h-7 w-56`} />
        <div className={`${shimmerStyle} h-4 w-80`} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-36 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                         */
/* ════════════════════════════════════════════════════════════════════════ */
export default function PharmacyOwnerDashboard() {
  const { data: profile } = useMyPharmacyProfileQuery();
  const pharmacyId = profile?.id;
  const { data: dashboard, isLoading } = useGetPharmacyDashboardQuery(pharmacyId);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    setIsDark(document.documentElement.classList.contains('dark'));
    return () => observer.disconnect();
  }, []);

  if (isLoading || !dashboard) {
    return <DashboardSkeleton />;
  }

  const primaryAccentColor = isDark ? '#0ea5e9' : '#0d9488';

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="visible"
      className="flex flex-col gap-6 pt-8 px-6 pb-6"
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="relative w-2 h-2 flex">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              <span className="relative w-2 h-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-extrabold text-emerald-500 dark:text-emerald-455 uppercase tracking-widest">
              Live Overview
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Pharmacy Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time insights and analytics for your pharmacy operations.
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl shadow-sm">
          <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiDefs.map((kpi) => {
          const value = dashboard[kpi.key];
          const growth = dashboard[kpi.growthKey];
          const display = kpi.format ? kpi.format(value) : String(value);
          const Icon = kpi.icon;

          return (
            <motion.div
              key={kpi.key}
              variants={fadeUp}
              whileHover={{ y: -2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:shadow-md transition-all duration-200 relative overflow-hidden"
            >
              {/* Thin top bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${kpi.topBarClass}`} />

              <div className="relative flex flex-col gap-3.5">
                <div className="flex justify-between items-center">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.iconClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.badgeClass}`}>
                    Active
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                    {kpi.label}
                  </p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {display}
                  </h3>
                </div>

                <GrowthBadge value={growth} label={kpi.growthLabel} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Chart + Activity ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">

        {/* Revenue Chart */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Header */}
          <div className="padding-6 py-4 px-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center">
                <BarChart3 className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Revenue Trajectory</h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Monthly revenue performance</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
          </div>

          {/* Chart */}
          <div className="p-5 pl-0 pr-2 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primaryAccentColor} stopOpacity={0.2} />
                    <stop offset="100%" stopColor={primaryAccentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="date" axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8', fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: isDark ? '#64748b' : '#94a3b8', fontWeight: 600 }}
                  tickFormatter={val => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`} />
                <Tooltip content={<ChartTooltip />}
                  cursor={{ stroke: primaryAccentColor, strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="revenue"
                  stroke={primaryAccentColor} strokeWidth={2.5}
                  fill="url(#dashRevGrad)" fillOpacity={1}
                  dot={{ r: 3, fill: primaryAccentColor, stroke: isDark ? '#0f172a' : '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: primaryAccentColor, stroke: isDark ? '#0f172a' : '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
          {/* Header */}
          <div className="py-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Recent Activity</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Latest updates</p>
            </div>
          </div>

          {/* List */}
          <div className="custom-scrollbar p-3 overflow-y-auto flex-1 max-h-[310px]">
            {!dashboard.recentActivities || dashboard.recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-955 flex items-center justify-center mb-3">
                  <Info className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-xs font-bold text-slate-450 dark:text-slate-500">No recent activity</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {dashboard.recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.15 }}
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <ActivityIcon type={activity.type} classes={ACCENT_CLASSES[i % ACCENT_CLASSES.length]} />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {activity.title}
                        </h4>
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-550 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md flex-shrink-0">
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed truncate">
                        {activity.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {dashboard.recentActivities && dashboard.recentActivities.length > 0 && (
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <button className="w-full flex items-center justify-center gap-1 text-xs font-bold text-teal-600 dark:text-teal-400 py-1.5 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                View all activity
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const ACCENT_CLASSES = [
  { bg: 'bg-indigo-50 dark:bg-indigo-950/20', text: 'text-indigo-600 dark:text-indigo-400' },
  { bg: 'bg-sky-50 dark:bg-sky-950/20', text: 'text-sky-600 dark:text-sky-400' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-600 dark:text-emerald-400' },
  { bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-600 dark:text-amber-400' },
  { bg: 'bg-pink-50 dark:bg-pink-950/20', text: 'text-pink-600 dark:text-pink-400' },
  { bg: 'bg-violet-50 dark:bg-violet-950/20', text: 'text-violet-600 dark:text-violet-400' },
  { bg: 'bg-teal-50 dark:bg-teal-950/20', text: 'text-teal-600 dark:text-teal-400' },
  { bg: 'bg-orange-50 dark:bg-orange-950/20', text: 'text-orange-600 dark:text-orange-400' },
];
