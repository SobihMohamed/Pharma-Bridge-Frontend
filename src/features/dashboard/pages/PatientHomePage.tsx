import { useNavigate } from 'react-router-dom';
import { useGetPatientHomeQuery } from '../hooks/usePatientHomeQuery';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Activity,
  CheckCircle2,
  XCircle,
  Truck,
  Timer
} from 'lucide-react';

// ─── Inline Skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
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

function getOrderIcon(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s === 'delivered') return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
  if (s === 'cancelled') return <XCircle className="w-3.5 h-3.5 mr-1" />;
  if (s === 'outfordelivery' || s === 'in transit') return <Truck className="w-3.5 h-3.5 mr-1" />;
  return <Timer className="w-3.5 h-3.5 mr-1" />;
}

function getOrderBadgeStyle(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s === 'delivered') return 'bg-emerald-500 text-white hover:bg-emerald-600 border-emerald-500';
  if (s === 'cancelled') return 'bg-red-500 text-white hover:bg-red-600 border-red-500';
  if (s === 'outfordelivery' || s === 'in transit') return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
  return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200';
}

function getRequestStatusBadge(status: string) {
  const s = status?.toLowerCase() ?? '';
  if (s === 'pending') return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 shadow-sm">Pending</Badge>;
  if (s.includes('bid')) return <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 shadow-sm">Has Bids</Badge>;
  if (s === 'completed' || s === 'accepted') return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-sm">Completed</Badge>;
  return <Badge variant="secondary" className="shadow-sm">{status}</Badge>;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function PatientHomePage() {
  const navigate = useNavigate();
  // Fetch exactly 5 of each for a rich dashboard view
  const { data, isLoading } = useGetPatientHomeQuery({ requestsCount: 5, ordersCount: 5 });

  const latestRequests = data?.latestRequests ?? [];
  const recentOrders = data?.recentOrders ?? [];

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-12">
      {/* ── Welcome Hero ── */}
      <section className="bg-gradient-to-br from-teal-700 to-emerald-900 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-white">Welcome back! 👋</h1>
          <p className="text-teal-100/90 max-w-xl text-base md:text-lg leading-relaxed mb-8">
            Manage your health seamlessly. Track active prescription requests, review incoming bids, and monitor recent deliveries—all from your dashboard.
          </p>
          <div className="flex gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/requests/new')}
              className="bg-white text-teal-900 hover:bg-teal-50 font-bold shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <Pill className="w-5 h-5 mr-2" />
              New Request
            </Button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── Two-Column Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

        {/* ── Column 1: Latest Requests ── */}
        <section className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200/60">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 bg-teal-100 rounded-lg text-teal-700">
                <Activity className="w-5 h-5" />
              </div>
              Recent Requests
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/requests')} className="text-teal-600 font-semibold text-sm hover:text-teal-800 hover:bg-teal-50">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="border border-slate-100 shadow-sm">
                  <CardContent className="p-5 flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-3 py-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : latestRequests.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50 shadow-none flex-1 flex flex-col items-center justify-center py-16 text-center min-h-[300px]">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                  <Stethoscope className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Active Requests</h3>
                <p className="text-slate-500 text-sm max-w-[250px] mb-6 leading-relaxed">
                  Upload a prescription image to start receiving competitive offers.
                </p>
                <Button onClick={() => navigate('/requests/new')} className="bg-teal-600 hover:bg-teal-700 shadow-md">
                  Start a new request
                </Button>
              </Card>
            ) : (
              latestRequests.map(req => (
                <Card 
                  key={req.id} 
                  onClick={() => navigate(`/requests/${req.id}`)}
                  className="group relative overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
                >
                  {/* Subtle left accent */}
                  <div className="absolute left-0 top-0 w-1 h-full bg-slate-200 group-hover:bg-teal-400 transition-colors" />
                  
                  <CardContent className="p-5 pl-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-teal-700 transition-colors">
                          {req.medicineName || 'Prescription Document'}
                        </h4>
                        {getRequestStatusBadge(req.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {formatRelativeTime(req.createdAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="line-clamp-1">{req.deliveryArea}</span>
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      {req.bidsCount > 0 ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-bold shadow-sm animate-pulse ring-2 ring-amber-500/20">
                          <Zap className="w-4 h-4" fill="currentColor" />
                          {req.bidsCount} Bids Available
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                          Awaiting Bids
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* ── Column 2: Recent Orders ── */}
        <section className="flex flex-col h-full">
          <div className="flex items-center justify-between pb-3 mb-5 border-b border-slate-200/60">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-700">
                <ShoppingBag className="w-5 h-5" />
              </div>
              Recent Orders
            </h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')} className="text-indigo-600 font-semibold text-sm hover:text-indigo-800 hover:bg-indigo-50">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <Card key={i} className="border border-slate-100 shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </CardContent>
                </Card>
              ))
            ) : recentOrders.length === 0 ? (
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50 shadow-none flex-1 flex flex-col items-center justify-center py-16 text-center min-h-[300px]">
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                  <PackageX className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Recent Orders</h3>
                <p className="text-slate-500 text-sm max-w-[250px] mb-6 leading-relaxed">
                  When you accept an offer from a pharmacy, tracking information will appear here.
                </p>
              </Card>
            ) : (
              recentOrders.map(order => (
                <Card 
                  key={order.id} 
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="group relative border border-slate-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                          Order #{order.id} <span className="w-1 h-1 rounded-full bg-slate-300" /> {formatRelativeTime(order.createdAt)}
                        </p>
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-indigo-700 transition-colors line-clamp-1">
                          {order.pharmacyName}
                        </h4>
                      </div>
                      <Badge className={`px-2.5 py-1 text-xs font-bold shadow-sm flex items-center ${getOrderBadgeStyle(order.orderStatus)}`}>
                        {getOrderIcon(order.orderStatus)}
                        {order.orderStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-50/80 rounded-xl p-3 border border-slate-100/80">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">Amount</span>
                          <span className="font-black text-slate-800 tracking-tight">EGP {order.amount?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> {order.paymentMethod}
                          </span>
                          <span className={`text-xs font-extrabold ${order.paymentStatus?.toLowerCase() === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
