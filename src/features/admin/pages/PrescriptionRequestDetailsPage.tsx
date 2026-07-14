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
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0 border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors duration-300">{label}</p>
        <div className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight transition-colors duration-300">{value}</div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6 md:p-8">
      <div className="h-4 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
        <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function BidItemsTable({ items }: { items: AdminBidItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold py-4 text-center">No items listed in this offer.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm mt-3 transition-colors duration-300">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Item Name</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Qty</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Unit Price</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Line Total</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Alt?</th>
            <th className="px-5 py-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 bg-white dark:bg-[#0f172a] transition-colors duration-300">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors duration-300 group">
              <td className="px-5 py-4 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Tag className="w-3.5 h-3.5" />
                </div>
                {item.itemName}
              </td>
              <td className="px-5 py-4 text-slate-600 dark:text-slate-300 text-center font-medium">{item.quantity}</td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-right font-medium">EGP {item.unitPrice.toFixed(2)}</td>
              <td className="px-5 py-4 text-slate-800 dark:text-white font-black text-right">EGP {item.lineTotal.toFixed(2)}</td>
              <td className="px-5 py-4 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold">
                    Alt
                  </span>
                ) : (
                  <span className="text-slate-300 dark:text-slate-600 font-bold text-[11px] uppercase">—</span>
                )}
              </td>
              <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium max-w-[180px] truncate" title={item.alternativeNote || undefined}>
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
    <div className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-[#0f172a] shadow-sm hover:shadow-md transition-all duration-300 relative group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-80" />
      {/* Bid Header */}
      <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-black text-xs">
            #{index + 1}
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-white text-base block transition-colors duration-300">{bid.pharmacyName}</span>
            {bid.pharmacyPhone && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold flex items-center gap-1 mt-0.5 transition-colors duration-300">
                <Phone className="w-3 h-3" />
                {bid.pharmacyPhone}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={bid.status} />
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight transition-colors duration-300">
            EGP {bid.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Bid Meta */}
      <div className="px-6 py-3 text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-1.5 bg-slate-50/30 dark:bg-slate-800/30 transition-colors duration-300">
        <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        Submitted: {formatDateTime(bid.submittedAt)}
      </div>

      {/* Bid Items */}
      <div className="p-6">
        <BidItemsTable items={bid.bidItems} />
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
      <div className="p-6 space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] min-h-screen transition-colors duration-300">
        {/* Back Navigation */}
        <div>
          <button
            onClick={() => navigate("/admin/prescription-requests")}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-300 text-sm font-bold bg-white dark:bg-[#0f172a] px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:bg-slate-800/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests List
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
            <AlertCircle className="w-12 h-12 mx-auto text-rose-500 mb-4 opacity-80" />
            <h4 className="text-xl font-bold">Failed to load request details</h4>
            <p className="text-sm mt-2 text-rose-600 dark:text-rose-400 font-medium">
              Could not fetch prescription request data. The request may not exist or the API may be offline.
            </p>
          </div>
        ) : (
          <>
            {/* Page Title Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight transition-colors duration-300">Request Details</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors duration-300">
                  Auditing Request ID: <span className="font-bold text-slate-700 dark:text-slate-300">#{details.id}</span>
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
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-colors duration-300">
                      <Info className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">
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
                    <div className="mt-4 p-5 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 transition-colors duration-300">Full Address Details</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed transition-colors duration-300">{details.fullAddress}</p>
                    </div>
                  )}

                  {details.patientNotes && (
                    <div className="mt-4 p-5 bg-slate-50/80 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5 transition-colors duration-300">Patient Notes</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed transition-colors duration-300">{details.patientNotes}</p>
                    </div>
                  )}
                </div>

                {/* Bids Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors duration-300">
                      <Tag className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white tracking-tight transition-colors duration-300">
                      Submitted Offers ({details.bids?.length || 0})
                    </h4>
                  </div>

                  {!details.bids || details.bids.length === 0 ? (
                    <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm transition-colors duration-300">
                      <Tag className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3 transition-colors duration-300" />
                      <p className="text-slate-600 dark:text-slate-300 text-base font-bold transition-colors duration-300">No offers submitted yet</p>
                      <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1 transition-colors duration-300">Pharmacies have not placed bids on this request.</p>
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
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-80" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center transition-colors duration-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">
                      Prescription File
                    </span>
                  </div>

                  {details.imageUrl ? (
                    <div className="space-y-3">
                      <a
                        href={details.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-sm transition-colors duration-300"
                      >
                        <img
                          src={details.imageUrl}
                          alt="Prescription Scan"
                          className="w-full max-h-72 object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <span className="bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-2 opacity-0 group-hover:opacity-100 shadow-xl transition-opacity">
                            <ExternalLink className="w-4 h-4" />
                            Open Full Size
                          </span>
                        </div>
                      </a>
                    </div>
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center gap-3 transition-colors duration-300">
                      <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600 transition-colors duration-300" />
                      <div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 transition-colors duration-300">No Image Uploaded</p>
                        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 max-w-[200px] mt-1 transition-colors duration-300">Patient requested medication by name without uploading a prescription file.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* platform Audit Trail */}
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 opacity-80" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-colors duration-300">
                      <History className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest transition-colors duration-300">
                      History / Logs
                    </span>
                  </div>

                  {!details.history || details.history.length === 0 ? (
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold italic py-4 text-center transition-colors duration-300">No platform history available.</p>
                  ) : (
                    <div className="space-y-5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800 animate-fadeIn transition-colors duration-300">
                      {details.history.map((entry, idx) => (
                        <div key={idx} className="flex gap-4 relative pl-8 group">
                          {/* Timeline dot */}
                          <div className="absolute left-[10px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-amber-500 transition-colors border border-white dark:border-[#0f172a] ring-4 ring-white dark:ring-[#0f172a] shadow-sm" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight transition-colors duration-300">
                              {entry.oldStatus
                                ? `Status changed from ${entry.oldStatus} to ${entry.newStatus}`
                                : `Status set to ${entry.newStatus}`}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-bold tracking-wide transition-colors duration-300">
                              {entry.changedByName || "System / Patient"} <span className="mx-1 text-slate-300 dark:text-slate-600">•</span> {formatDateTime(entry.changedAt)}
                            </p>
                            {entry.notes && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 font-medium p-3 rounded-xl border border-slate-100 dark:border-slate-700 mt-2 transition-colors duration-300">
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
