import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { useGetPatientProfileByUserIdQuery } from '../hooks/useAdminPatientDetailsQuery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Activity, 
  MessageSquare, 
  Star,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

// ─── Inline Skeleton ────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />
);

// ─── Helpers ────────────────────────────────────────────────────────────────
function getInitials(name: string): string {
  if (!name) return 'PT';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

// ─── Component ──────────────────────────────────────────────────────────────
export default function AdminPatientDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const resolvedUserId = id;

  const { data: patient, isLoading, isError } = useGetPatientProfileByUserIdQuery(resolvedUserId);

  // ─── Loading State ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <AdminLayout title="Patient Details">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-40" />
          
          {/* Header Skeleton */}
          <Card className="border-0 shadow-sm"><CardContent className="p-8 flex gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3 flex-1 py-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent></Card>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-36 w-full rounded-xl" />)}
          </div>

          {/* Addresses Skeleton */}
          <Skeleton className="h-8 w-48 mt-8 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ─── Empty / Error State ────────────────────────────────────────────────
  if (isError || !patient) {
    return (
      <AdminLayout title="Patient Details">
        <div className="p-6 max-w-6xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Patient Not Found</h2>
          <p className="text-slate-500 max-w-sm mb-6">
            The patient profile you are looking for does not exist, or you do not have permission to view it.
          </p>
          <Button onClick={() => navigate('/admin/patients')} className="bg-slate-900 hover:bg-slate-800 text-white shadow-md">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Directory
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // ─── Main Content ───────────────────────────────────────────────────────
  return (
    <AdminLayout title="Patient Details">
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-16">
        
        {/* Navigation Action */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin/patients')}
          className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 -ml-3 mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>

        {/* ── Patient Identity Header ── */}
        <Card className="border border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="h-4 bg-gradient-to-r from-teal-500 to-emerald-600" />
          <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-slate-400 shrink-0 uppercase">
              {getInitials(patient.fullName)}
            </div>
            
            <div className="flex-1 text-center sm:text-left pt-2">
              <h1 className="text-3xl font-black text-slate-900 mb-2">{patient.fullName}</h1>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-600 mt-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">{patient.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-700">{patient.phoneNumber || 'No phone provided'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── KPI / Analytics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Activity Card */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Prescription Activity</p>
                  <h3 className="text-4xl font-black text-slate-900">{patient.totalPrescriptionRequests}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">Total requests submitted</p>
            </CardContent>
          </Card>

          {/* Orders Breakdown Card */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10" />
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Orders</p>
                  <h3 className="text-4xl font-black text-slate-900">{patient.ordersCount}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              
              {/* Mini Breakdown */}
              <div className="flex gap-4 border-t border-slate-100 pt-4">
                <div className="flex-1 flex flex-col items-center p-2 rounded-lg bg-emerald-50/50">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Done</span>
                  <span className="font-bold text-emerald-700">{patient.completedOrders}</span>
                </div>
                <div className="flex-1 flex flex-col items-center p-2 rounded-lg bg-amber-50/50">
                  <Clock className="w-4 h-4 text-amber-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Pending</span>
                  <span className="font-bold text-amber-700">{patient.pendingOrders}</span>
                </div>
                <div className="flex-1 flex flex-col items-center p-2 rounded-lg bg-red-50/50">
                  <XCircle className="w-4 h-4 text-red-500 mb-1" />
                  <span className="text-[10px] uppercase font-bold text-slate-500">Cancel</span>
                  <span className="font-bold text-red-700">{patient.cancelledOrders}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Card */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Engagement</p>
                  <h3 className="text-4xl font-black text-slate-900">{patient.totalPharmacyRatings + patient.complaintsSubmitted}</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Pharmacy Ratings</span>
                  <span className="font-bold text-slate-800">{patient.totalPharmacyRatings}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Complaints</span>
                  <span className="font-bold text-slate-800">{patient.complaintsSubmitted}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Addresses Section ── */}
        <section className="pt-4">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Saved Addresses
          </h2>
          
          {!patient.addresses || patient.addresses.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
              <p className="text-slate-500">This patient has no saved addresses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient.addresses.map(address => (
                <Card key={address.id} className={`border ${address.isDefault ? 'border-teal-200 bg-teal-50/10' : 'border-slate-200'} shadow-sm relative overflow-hidden`}>
                  {address.isDefault && (
                    <div className="absolute top-0 right-0 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                      DEFAULT
                    </div>
                  )}
                  <CardContent className="p-5 flex gap-3">
                    <div className="mt-0.5">
                      <MapPin className={`w-5 h-5 ${address.isDefault ? 'text-teal-500' : 'text-slate-400'}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-slate-900">{address.street}</p>
                      <p className="text-xs text-slate-500">{address.city}, {address.state} {address.zipCode}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>
    </AdminLayout>
  );
}
