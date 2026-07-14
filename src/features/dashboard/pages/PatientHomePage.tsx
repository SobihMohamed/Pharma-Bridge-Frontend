import { useNavigate } from 'react-router-dom';
import { useGetPatientHomeQuery } from '../hooks/usePatientHomeQuery';
import {
  Pill,
  Clock,
  MapPin,
  Zap,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  PackageX,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Truck,
  Timer,
  Shield,
  Headphones,
  ArrowRight,
  PlusCircle,
  Receipt
} from 'lucide-react';

// ─── Inline Skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-slate-700 ${className}`} />
);

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatRelativeTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today at ${time}`;

    // Check if yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) {
      return `Yesterday at ${time}`;
    }

    return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${time}`;
  } catch {
    return isoString;
  }
}

function getOrderStatusStyle(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s === 'delivered') return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> };
  if (s === 'cancelled') return { bg: 'bg-red-50 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> };
  if (s === 'outfordelivery' || s === 'in transit') return { bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: <Truck className="w-3 h-3" /> };
  return { bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Timer className="w-3 h-3" /> };
}

function getRequestStatusBadge(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s === 'pending') return <span className="bg-[#FFDCBC] text-[#402300] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">Pending</span>;
  if (s.includes('bid')) return <span className="bg-[#C8E6FF] text-[#006591] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">Has Bids</span>;
  if (s === 'completed' || s === 'accepted') return <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">Completed</span>;
  if (s === 'closed') return <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">Closed</span>;
  return <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold">{status}</span>;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PatientHomePage() {
  const navigate = useNavigate();
  // Fetch exactly 5 of each for a rich dashboard view
  const { data, isLoading } = useGetPatientHomeQuery({ requestsCount: 5, ordersCount: 5 });

  const latestRequests = data?.latestRequests ?? [];
  const recentOrders = data?.recentOrders ?? [];

  return (
    <div className="space-y-8 max-w-[1440px] mx-auto pb-12 transition-colors duration-300">
      {/* ── Hero Banner Section ── */}
      <section className="relative pb-10">
        {/* Main hero content container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#009ADA] to-[#006591] p-8 md:p-10 min-h-[280px] flex flex-col justify-center text-white shadow-lg animate-[bottomWave_8s_ease-in-out_infinite]" style={{ borderRadius: '24px 24px 60% 40% / 24px 24px 5% 8%' }}>
          {/* Animated Floating Orbs */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute right-1/4 -bottom-20 w-64 h-64 bg-white/8 rounded-full blur-3xl pointer-events-none animate-[float_10s_ease-in-out_2s_infinite_reverse]" />
          <div className="absolute left-1/3 top-0 w-48 h-48 bg-[#88CEFF]/15 rounded-full blur-2xl pointer-events-none animate-[float_12s_ease-in-out_4s_infinite]" />

          {/* Animated Wave Pattern inside */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-[60%] animate-[waveScroll_15s_linear_infinite]"
              viewBox="0 0 2000 400"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M0 200 Q250 120 500 200 T1000 200 T1500 200 T2000 200 V400 H0 Z" fill="white" opacity="0.06" />
            </svg>
            <svg
              className="absolute bottom-0 left-0 w-[200%] h-[50%] animate-[waveScroll_12s_linear_1s_infinite_reverse]"
              viewBox="0 0 2000 400"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path d="M0 250 Q300 180 600 250 T1200 250 T1800 250 T2000 250 V400 H0 Z" fill="white" opacity="0.04" />
            </svg>
          </div>

          {/* Animated Pill / Medical Icons floating in background */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 opacity-[0.12] pointer-events-none">
            <Pill className="w-16 h-16 animate-[floatSpin_9s_ease-in-out_infinite]" />
            <Shield className="w-12 h-12 animate-[floatSpin_7s_ease-in-out_2s_infinite_reverse] ml-8" />
            <Stethoscope className="w-14 h-14 animate-[floatSpin_11s_ease-in-out_1s_infinite]" />
          </div>

          {/* Hero Content with entrance animations */}
          <div className="relative z-10 max-w-2xl animate-[slideUp_0.8s_ease-out_both]">
            <h1 className="text-3xl md:text-[40px] font-extrabold mb-4 tracking-tight leading-tight animate-[slideUp_0.6s_ease-out_0.1s_both]">
              Welcome back! <span className="inline-block animate-[waveHand_2.5s_ease-in-out_1s_infinite]">👋</span>
            </h1>
            <p className="text-base md:text-lg opacity-90 mb-8 leading-relaxed max-w-xl animate-[slideUp_0.6s_ease-out_0.3s_both]">
              Manage your health seamlessly. Track active prescription requests, review incoming bids, and monitor recent deliveries—all from your dashboard.
            </p>
            <button
              onClick={() => navigate('/requests/new')}
              className="bg-white text-[#009ADA] px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#C8E6FF] transition-all active:scale-95 shadow-md group animate-[slideUp_0.6s_ease-out_0.5s_both] hover:shadow-xl hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              New Request
            </button>
          </div>
        </div>



        {/* Inline keyframes */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          @keyframes waveScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes waveHand {
            0%, 60%, 100% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
          }
          @keyframes floatSpin {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-16px) rotate(12deg); }
          }
          @keyframes bottomWave {
            0%, 100% {
              border-radius: 24px 24px 60% 40% / 24px 24px 5% 8%;
            }
            25% {
              border-radius: 24px 24px 40% 60% / 24px 24px 8% 4%;
            }
            50% {
              border-radius: 24px 24px 55% 45% / 24px 24px 6% 10%;
            }
            75% {
              border-radius: 24px 24px 45% 55% / 24px 24px 9% 5%;
            }
          }
        `}</style>
      </section>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Column 1: Recent Requests ── */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C8E6FF] rounded-xl text-[#009ADA]">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Requests</h2>
            </div>
            <button
              onClick={() => navigate('/requests')}
              className="text-[#009ADA] text-sm font-bold flex items-center gap-1 hover:underline group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Request Cards Stack */}
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 p-6 rounded-2xl animate-pulse transition-colors duration-300">
                  <div className="flex gap-4">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-52" />
                  </div>
                </div>
              ))
            ) : latestRequests.length === 0 ? (
              <div className="bg-white dark:bg-[#0f172a] border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center py-16 text-center min-h-[300px] transition-colors duration-300">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#0b0f19] rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Stethoscope className="w-8 h-8 text-gray-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300 mb-1">No Active Requests</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm max-w-[250px] mb-6 leading-relaxed">
                  Upload a prescription image to start receiving competitive offers.
                </p>
                <button
                  onClick={() => navigate('/requests/new')}
                  className="bg-[#006591] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md"
                >
                  Start a new request
                </button>
              </div>
            ) : (
              latestRequests.map(req => (
                <div
                  key={req.id}
                  onClick={() => navigate(`/requests/${req.id}`)}
                  className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-4 hover:border-[#009ADA] transition-all cursor-pointer group hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#006591] dark:group-hover:text-[#009ADA] transition-colors">
                        {req.medicineName || 'Prescription Document'}
                      </h3>
                      {getRequestStatusBadge(req.status)}
                    </div>
                    <div className="flex flex-col gap-1 text-gray-500 dark:text-slate-400">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(req.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{req.deliveryArea}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {req.bidsCount > 0 ? (
                      <div className="bg-[#FFDCBC] text-[#402300] px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 w-full md:w-auto justify-center">
                        <Zap className="w-4 h-4" fill="currentColor" />
                        {req.bidsCount} Bids Available
                      </div>
                    ) : (
                      <div className="bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 px-6 py-3 rounded-xl text-sm font-semibold text-center w-full md:w-auto">
                        Awaiting Bids
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Column 2: Recent Orders ── */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#85CBFD] rounded-xl text-[#00567C]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Orders</h2>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="text-[#009ADA] text-sm font-bold flex items-center gap-1 hover:underline group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Order Cards */}
          <div className="space-y-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-pulse transition-colors duration-300">
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="p-6 bg-gray-50 dark:bg-[#0b0f19]">
                    <Skeleton className="h-12 w-full rounded-xl" />
                  </div>
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <div className="bg-white dark:bg-[#0f172a] border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center py-16 text-center min-h-[300px] transition-colors duration-300">
                <div className="w-16 h-16 bg-gray-50 dark:bg-[#0b0f19] rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <PackageX className="w-8 h-8 text-gray-300 dark:text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 dark:text-slate-300 mb-1">No Recent Orders</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm max-w-[250px] mb-6 leading-relaxed">
                  When you accept an offer from a pharmacy, tracking information will appear here.
                </p>
              </div>
            ) : (
              recentOrders.map(order => {
                const statusStyle = getOrderStatusStyle(order.orderStatus);
                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                          Order #{order.id} • {formatRelativeTime(order.createdAt)}
                        </p>
                        <h3 className="text-xl font-bold text-[#009ADA] group-hover:text-[#006591] transition-colors">
                          {order.pharmacyName}
                        </h3>
                      </div>
                      <span className={`${statusStyle.bg} border px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1`}>
                        {statusStyle.icon}
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Order Details */}
                    <div className="p-6 bg-gray-50 dark:bg-[#0b0f19] grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Amount</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">EGP {order.amount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1 text-gray-400 dark:text-slate-500">
                          <CreditCard className="w-3.5 h-3.5" />
                          <p className="text-xs font-bold uppercase tracking-widest">{order.paymentMethod}</p>
                        </div>
                        <p className={`text-sm font-bold ${order.paymentStatus?.toLowerCase() === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {order.paymentStatus || 'Pending Payment'}
                        </p>
                      </div>
                    </div>

                    {/* Click to view hint */}
                    <div className="p-6 flex justify-center">
                      <div className="w-full h-20 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 opacity-60">
                        <Receipt className="w-5 h-5 mb-1" />
                        <p className="text-sm">Click to view prescription details</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* ── Featured Section (Bento Style) ── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-6 transition-colors duration-300">
          <div className="w-24 h-24 shrink-0 bg-[#C8E6FF] rounded-2xl flex items-center justify-center text-[#009ADA]">
            <Shield className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Health Shield Protection</h4>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Your prescriptions are verified by licensed pharmacists before every bid is placed. Ensuring precision in every drop.
            </p>
          </div>
        </div>
        <div
          onClick={() => navigate('/complaints')}
          className="bg-[#85CBFD] text-[#00567C] rounded-2xl p-6 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all min-h-[160px]"
        >
          <div className="flex justify-between items-start">
            <Headphones className="w-8 h-8" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
          <div>
            <h4 className="text-lg font-bold">24/7 Support</h4>
            <p className="text-sm opacity-80">Need help with an order?</p>
          </div>
        </div>
      </section>
    </div>
  );
}
