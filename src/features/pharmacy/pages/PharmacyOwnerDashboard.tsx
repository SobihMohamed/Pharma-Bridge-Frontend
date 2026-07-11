import React from 'react';
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
    accent: '#10b981',
    bg: '#ecfdf5',
    text: '#065f46',
    format: formatCurrency,
  },
  {
    key: 'activeBids' as const,
    growthKey: 'activeBidsGrowth' as const,
    label: 'Active Bids',
    growthLabel: 'vs yesterday',
    icon: Tag,
    accent: '#f59e0b',
    bg: '#fffbeb',
    text: '#92400e',
  },
  {
    key: 'completedOrders' as const,
    growthKey: 'completedOrdersGrowth' as const,
    label: 'Completed Orders',
    growthLabel: 'vs last week',
    icon: PackageCheck,
    accent: '#0ea5e9',
    bg: '#f0f9ff',
    text: '#0369a1',
  },
  {
    key: 'newPatients' as const,
    growthKey: 'newPatientsGrowth' as const,
    label: 'New Patients',
    growthLabel: 'vs last month',
    icon: Users,
    accent: '#6366f1',
    bg: '#f5f3ff',
    text: '#4f46e5',
  },
];

/* ─── Growth Badge ──────────────────────────────────────────────────────── */
function GrowthBadge({ value, label }: { value: number; label: string }) {
  if (value > 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 20,
          background: '#ecfdf5', color: '#065f46',
          fontSize: 11, fontWeight: 700,
        }}>
          <TrendingUp style={{ width: 12, height: 12 }} />
          +{value}%
        </span>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
      </div>
    );
  }
  if (value < 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 20,
          background: '#fff1f2', color: '#9f1239',
          fontSize: 11, fontWeight: 700,
        }}>
          <TrendingDown style={{ width: 12, height: 12 }} />
          {value}%
        </span>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 20,
        background: '#f8fafc', color: '#64748b',
        fontSize: 11, fontWeight: 700,
      }}>
        <Minus style={{ width: 12, height: 12 }} />
        0%
      </span>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function ActivityIcon({ type, accent }: { type: string; accent: string }) {
  const t = type?.toLowerCase() ?? '';

  if (t === 'ordercompleted') {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: accent + '15',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Package style={{ width: 16, height: 16, color: accent }} />
      </div>
    );
  }

  return (
    <div style={{
      width: 36, height: 36, borderRadius: 10,
      background: accent + '15',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Zap style={{ width: 16, height: 16, color: accent }} />
    </div>
  );
}

/* ─── Custom Tooltip ────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0f172a', borderRadius: 12, padding: '10px 14px',
      boxShadow: '0 4px 20px rgba(15,23,42,0.15)', border: 'none',
    }}>
      <p style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 14, fontWeight: 950, color: '#fff', margin: 0 }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  const shimmerStyle: React.CSSProperties = {
    borderRadius: 16, background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
    backgroundSize: '200% 100%', animation: 'shimmer 1.5s ease-in-out infinite',
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...shimmerStyle, height: 28, width: 220 }} />
        <div style={{ ...shimmerStyle, height: 16, width: 320 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ ...shimmerStyle, height: 140, background: '#fff', border: '1px solid #f1f5f9' }} />
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

  if (isLoading || !dashboard) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="visible"
      style={{
        display: 'flex', flexDirection: 'column', gap: 24,
        paddingTop: '32px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px'
      }}
    >
      {/* ── Header ── */}
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ position: 'relative', width: 8, height: 8, display: 'inline-flex' }}>
              <span style={{
                position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981',
                animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite', opacity: 0.75,
              }} />
              <span style={{ position: 'relative', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Live Overview
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.019em' }}>
            Pharmacy Overview
          </h1>
          <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 3, margin: 0 }}>
            Real-time insights and analytics for your pharmacy operations.
          </p>
        </div>
        
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', background: '#fff', borderRadius: 12,
          border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}>
          <Clock style={{ width: 14, height: 14, color: '#0ea5e9' }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {kpiDefs.map((kpi, idx) => {
          const value = dashboard[kpi.key];
          const growth = dashboard[kpi.growthKey];
          const display = kpi.format ? kpi.format(value) : String(value);
          const Icon = kpi.icon;
          const accent = kpi.accent;

          return (
            <motion.div
              key={kpi.key}
              variants={fadeUp}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(15,23,42,0.05)' }}
              style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                border: '1px solid #f1f5f9',
                cursor: 'default',
                transition: 'all 0.25s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Thin top bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: accent }} />

              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: accent + '18' }}
                  >
                    <Icon style={{ width: 16, height: 16, color: accent }} />
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: kpi.bg, color: kpi.text }}
                  >
                    Active
                  </span>
                </div>

                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', margin: '0 0 2px 0' }}>
                    {kpi.label}
                  </p>
                  <h3 style={{ fontSize: 26, fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="lg:!grid-cols-[2fr_1fr]">

        {/* Revenue Chart */}
        <motion.div variants={fadeUp} style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #f1f5f9', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#fafafa',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: '#0d948818', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center'
              }}>
                <BarChart3 style={{ width: 18, height: 18, color: '#0d9488' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Revenue Trajectory</h2>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Monthly revenue performance</p>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '4px 10px', background: '#ecfdf5', borderRadius: 8,
            }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#065f46' }}>Live</span>
            </div>
          </div>

          {/* Chart */}
          <div style={{ padding: '20px 10px 10px 10px', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.revenueChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={8} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={val => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`} />
                <Tooltip content={<ChartTooltip />}
                  cursor={{ stroke: '#0d9488', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="revenue"
                  stroke="#0d9488" strokeWidth={2.5}
                  fill="url(#dashRevGrad)" fillOpacity={1}
                  dot={{ r: 3, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} style={{
          background: '#fff', borderRadius: 16,
          border: '1px solid #f1f5f9', overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid #f1f5f9',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
            background: '#fafafa',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: '#6366f118', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Sparkles style={{ width: 18, height: 18, color: '#6366f1' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>Recent Activity</h2>
              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Latest updates</p>
            </div>
          </div>

          {/* List */}
          <div className="custom-scrollbar" style={{ padding: 12, overflowY: 'auto', flex: 1, maxHeight: 310 }}>
            {!dashboard.recentActivities || dashboard.recentActivities.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
                height: '100%', textAlign: 'center', padding: '48px 0',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: '#f8fafc',
                  display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', marginBottom: 12,
                }}>
                  <Info style={{ width: 20, height: 20, color: '#cbd5e1' }} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', margin: 0 }}>No recent activity</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {dashboard.recentActivities.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.15 }}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: 10, borderRadius: 10, cursor: 'default',
                      transition: 'background 0.15s ease',
                    }}
                    className="hover:bg-slate-50"
                  >
                    <ActivityIcon type={activity.type} accent={ACCENT_COLORS[i % ACCENT_COLORS.length]} />
                    <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                        <h4 style={{
                          fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {activity.title}
                        </h4>
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: '#94a3b8', whiteSpace: 'nowrap',
                          background: '#f8fafc', padding: '2px 6px', borderRadius: 6, flexShrink: 0,
                        }}>
                          {formatTimeAgo(activity.createdAt)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: 11, color: '#64748b', margin: '2px 0 0', lineHeight: 1.4,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      }}>
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
            <div style={{
              padding: '10px 16px', borderTop: '1px solid #f1f5f9', flexShrink: 0,
              background: '#fafafa',
            }}>
              <button style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                fontSize: 12, fontWeight: 800, color: '#0d9488',
                padding: '6px 0', borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', transition: 'background 0.15s ease',
              }}
                className="hover:bg-teal-50"
              >
                View all activity
                <ArrowUpRight style={{ width: 12, height: 12 }} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

const ACCENT_COLORS = ['#6366f1','#0ea5e9','#10b981','#f59e0b','#ec4899','#8b5cf6','#14b8a6','#f97316'];
