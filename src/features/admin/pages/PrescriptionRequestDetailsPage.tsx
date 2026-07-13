import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminPrescriptionRequestDetailsQuery } from "../hooks/useAdminPrescriptionRequestsQuery";
import {
  AdminPrescriptionRequestDetailsDto,
  AdminBidDto,
  AdminBidItemDto,
} from "../services/adminService";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Tag,
  History,
  Image as ImageIcon,
  User,
  Hash,
  ExternalLink,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  HasBids: "bg-sky-50 text-sky-700 border border-sky-200/50",
  Closed: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
  Accepted: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  HasBids: "bg-sky-500",
  Closed: "bg-emerald-500",
  Cancelled: "bg-rose-500",
  Accepted: "bg-emerald-500",
  Rejected: "bg-rose-500",
};

// ---------- Helpers ----------

const formatDateTime = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

// ---------- Sub-components ----------

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.Pending}`} />
      {status}
    </span>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
      <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <div className="text-sm font-semibold text-slate-800 leading-tight">{value}</div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6 md:p-8">
      <div className="h-4 w-28 bg-slate-100 rounded" />
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BidItemsTable({ items }: { items: AdminBidItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic py-4 text-center">No items listed in this offer.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item Name</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Line Total</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Alt?</th>
            <th className="px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
              <td className="px-4 py-3 text-slate-800 font-semibold">{item.itemName}</td>
              <td className="px-4 py-3 text-slate-600 text-center font-medium">{item.quantity}</td>
              <td className="px-4 py-3 text-slate-500 text-right font-mono font-medium">EGP {item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-3 text-slate-800 font-bold text-right font-mono">EGP {item.lineTotal.toFixed(2)}</td>
              <td className="px-4 py-3 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold">
                    Alt
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 text-xs max-w-[180px] truncate" title={item.alternativeNote || undefined}>
                {item.alternativeNote || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BidCard({ bid, index }: { bid: AdminBidDto; index: number }) {
  return (
    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Bid Header */}
      <div className="bg-slate-50/50 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400">OFFER #{index + 1}</span>
          <span className="font-bold text-slate-800 text-base">{bid.pharmacyName}</span>
          {bid.pharmacyPhone && (
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              {bid.pharmacyPhone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={bid.status} />
          <span className="text-lg font-black text-slate-800 font-mono">
            EGP {bid.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Bid Meta */}
      <div className="px-5 py-3 text-xs text-slate-450 font-semibold border-b border-slate-50 flex items-center gap-1.5">
        <Clock className="w-3.5 h-3.5" />
        Submitted: {formatDateTime(bid.submittedAt)}
      </div>

      {/* Bid Items */}
      <div className="p-5">
        <BidItemsTable items={bid.items} />
      </div>
    </div>
  );
}

// ---------- Main Page ----------

export default function PrescriptionRequestDetailsPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useAdminPrescriptionRequestDetailsQuery(requestId || "");
  const details: AdminPrescriptionRequestDetailsDto | undefined = data;

  return (
    <AdminLayout title="Request Overview">
      <div className="p-6 space-y-6 bg-[#F4F6FA] min-h-screen">
        {/* Back Navigation */}
        <div>
          <button
            onClick={() => navigate("/admin/prescription-requests")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors bg-white px-3 py-2 rounded-xl border border-slate-200/60 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to requests list
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
            <h4 className="text-lg font-bold">Failed to load request details</h4>
            <p className="text-sm mt-1 text-rose-600">
              Could not fetch prescription request data. The request may not exist or the API may be offline.
            </p>
          </div>
        ) : (
          <>
            {/* Page Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Request Details</h3>
                <p className="text-sm text-slate-400 mt-0.5">
                  Auditing Request ID: <span className="font-bold text-slate-700">#{details.id}</span>
                </p>
              </div>
              <div>
                <StatusBadge status={details.status} />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: Info Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <Info className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Request Information
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailItem
                      label="Patient Name"
                      value={details.patientName}
                      icon={<User className="w-4 h-4" />}
                    />
                    <DetailItem
                      label="Patient Phone"
                      value={details.patientPhone || "—"}
                      icon={<Phone className="w-4 h-4" />}
                    />
                    <DetailItem
                      label="Medicine Name"
                      value={details.medicineName || "—"}
                      icon={<Hash className="w-4 h-4" />}
                    />
                    <DetailItem
                      label="Delivery Area"
                      value={details.deliveryArea || "—"}
                      icon={<MapPin className="w-4 h-4" />}
                    />
                    <DetailItem
                      label="Created At"
                      value={formatDateTime(details.createdAt)}
                      icon={<Calendar className="w-4 h-4" />}
                    />
                    <DetailItem
                      label="Expires At"
                      value={formatDateTime(details.expiresAt)}
                      icon={<Clock className="w-4 h-4" />}
                    />
                  </div>

                  {details.fullAddress && (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Address Details</p>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">{details.fullAddress}</p>
                    </div>
                  )}

                  {details.patientNotes && (
                    <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Notes</p>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">{details.patientNotes}</p>
                    </div>
                  )}
                </div>

                {/* Bids Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4.5 h-4.5 text-slate-500" />
                      <h4 className="text-base font-bold text-slate-800">
                        Submitted Offers ({details.bids?.length || 0})
                      </h4>
                    </div>
                  </div>

                  {!details.bids || details.bids.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
                      <Tag className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-555 text-sm font-semibold">No offers submitted yet</p>
                      <p className="text-xs text-slate-450 mt-1">Pharmacies have not placed bids on this request.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      {details.bids.map((bid, i) => (
                        <BidCard key={bid.id} bid={bid} index={i} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Verification Image & Platform Audit Trail */}
              <div className="space-y-6">
                
                {/* Prescription Image */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      Prescription File
                    </span>
                  </div>

                  {details.imageUrl ? (
                    <div className="space-y-3">
                      <a
                        href={details.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
                      >
                        <img
                          src={details.imageUrl}
                          alt="Prescription Scan"
                          className="w-full max-h-72 object-contain mx-auto group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                          <span className="bg-white/95 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 shadow-md transition-opacity">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Open full size
                          </span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50 flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="w-7 h-7 text-slate-350" />
                      <p className="text-xs font-bold text-slate-400">No Image Uploaded</p>
                      <p className="text-[10px] text-slate-400 max-w-[180px]">Patient requested medication by name without uploading a prescription file.</p>
                    </div>
                  )}
                </div>

                {/* platform Audit Trail */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-50">
                    <History className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-black text-slate-800 uppercase tracking-widest">
                      History / Logs
                    </span>
                  </div>

                  {!details.history || details.history.length === 0 ? (
                    <p className="text-slate-400 text-xs italic py-4 text-center">No platform history available.</p>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 animate-fadeIn">
                      {details.history.map((entry, idx) => (
                        <div key={idx} className="flex gap-4 relative pl-7 group">
                          {/* Timeline dot */}
                          <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-slate-300 group-hover:bg-blue-500 transition-colors border border-white ring-4 ring-white" />
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-800 leading-tight">
                              {entry.action}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold">
                              {entry.performedBy} · {formatDateTime(entry.performedAt)}
                            </p>
                            {entry.notes && (
                              <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
