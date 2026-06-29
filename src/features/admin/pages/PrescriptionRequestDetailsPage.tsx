import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { useAdminPrescriptionRequestDetailsQuery } from "../hooks/useAdminPrescriptionRequestsQuery";
import {
  AdminPrescriptionRequestDetailsDto,
  AdminBidDto,
  AdminBidItemDto,
  AdminHistoryEntryDto,
} from "../services/adminService";

// ---------- Constants ----------

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  HasBids: "bg-sky-50 text-sky-700 border border-sky-200/50",
  Closed: "bg-primary/15 text-primary border border-primary/30",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200/50",
  Accepted: "bg-primary/15 text-primary border border-primary/30",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  HasBids: "bg-sky-500",
  Closed: "bg-primary",
  Cancelled: "bg-rose-500",
  Accepted: "bg-primary",
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
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.Pending}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || STATUS_DOT.Pending}`} />
      {status}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider sm:w-40 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800">{children}</span>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
        <div className="h-4 bg-slate-100 rounded w-1/3" />
        <div className="h-4 bg-slate-100 rounded w-2/5" />
        <div className="h-4 bg-slate-100 rounded w-1/4" />
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="h-32 bg-slate-100 rounded" />
      </div>
    </div>
  );
}

function BidItemsTable({ items }: { items: AdminBidItemDto[] }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic py-2 pl-2">No items in this bid.</p>
    );
  }

  return (
    <div className="overflow-x-auto mt-3 rounded-lg border border-slate-100">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50/80">
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Qty</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-right">Line Total</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-center">Alt?</th>
            <th className="px-4 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Alt. Note</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
              <td className="px-4 py-2.5 text-slate-800 font-medium">{item.itemName}</td>
              <td className="px-4 py-2.5 text-slate-600 text-center">{item.quantity}</td>
              <td className="px-4 py-2.5 text-slate-600 text-right">{item.unitPrice.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-slate-800 font-semibold text-right">{item.lineTotal.toFixed(2)}</td>
              <td className="px-4 py-2.5 text-center">
                {item.isAlternative ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold">✓</span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
              <td className="px-4 py-2.5 text-slate-500 text-[13px] max-w-[180px] truncate" title={item.alternativeNote || undefined}>
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
    <div className="border border-slate-200/80 rounded-xl overflow-hidden">
      {/* Bid Header */}
      <div className="bg-slate-50/80 px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-bold text-slate-500">#{index + 1}</span>
          <span className="font-semibold text-slate-800 text-[14px]">{bid.pharmacyName}</span>
          {bid.pharmacyPhone && (
            <span className="text-[13px] text-slate-500">• {bid.pharmacyPhone}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={bid.status} />
          <span className="text-[14px] font-bold text-slate-800">
            EGP {bid.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Bid Meta */}
      <div className="px-5 py-3 text-[13px] text-slate-500 border-b border-slate-100">
        Submitted: {formatDateTime(bid.submittedAt)}
      </div>

      {/* Bid Items */}
      <div className="px-5 py-3">
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
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Back + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/prescription-requests")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Requests
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load request details</h4>
            <p className="text-sm mt-1 text-rose-600">
              Could not fetch prescription request data. The request may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Prescription Request Details</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                Request #{String(details.id)} — {details.patientName}
              </p>
            </div>

            {/* Request Info Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Request Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow label="Status">
                  <StatusBadge status={details.status} />
                </DetailRow>
                <DetailRow label="Patient Name">{details.patientName}</DetailRow>
                <DetailRow label="Patient Phone">{details.patientPhone || "—"}</DetailRow>
                <DetailRow label="Medicine Name">{details.medicineName || "—"}</DetailRow>
                <DetailRow label="Delivery Area">{details.deliveryArea || "—"}</DetailRow>
                <DetailRow label="Full Address">{details.fullAddress || "—"}</DetailRow>
                <DetailRow label="Created At">{formatDateTime(details.createdAt)}</DetailRow>
                <DetailRow label="Expires At">{formatDateTime(details.expiresAt)}</DetailRow>
                <DetailRow label="Bids Count">
                  <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
                    {details.bidsCount}
                  </span>
                </DetailRow>
                {details.patientNotes && (
                  <div className="md:col-span-2">
                    <DetailRow label="Patient Notes">{details.patientNotes}</DetailRow>
                  </div>
                )}
              </div>

              {/* Prescription Image */}
              {details.imageUrl && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                    Prescription Image
                  </span>
                  <a href={details.imageUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <img
                      src={details.imageUrl}
                      alt="Prescription"
                      className="max-w-sm max-h-64 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow object-contain"
                    />
                  </a>
                </div>
              )}
            </div>

            {/* Bids Section */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">local_offer</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Bids ({details.bids?.length || 0})
                </span>
              </div>

              {!details.bids || details.bids.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100 text-slate-400">
                    <span className="material-symbols-outlined text-[24px]">gavel</span>
                  </div>
                  <p className="text-slate-500 text-sm">No bids have been submitted for this request yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {details.bids.map((bid, i) => (
                    <BidCard key={bid.id} bid={bid} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* History Section */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">History</span>
              </div>

              {!details.history || details.history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 border border-slate-100 text-slate-400">
                    <span className="material-symbols-outlined text-[24px]">schedule</span>
                  </div>
                  <p className="text-slate-500 text-sm">No history available.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80">
                        <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                        <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Performed By</th>
                        <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-5 py-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {details.history.map((entry, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-5 py-3 text-[14px] text-slate-800 font-medium">{entry.action}</td>
                          <td className="px-5 py-3 text-[14px] text-slate-600">{entry.performedBy}</td>
                          <td className="px-5 py-3 text-[13px] text-slate-600">{formatDateTime(entry.performedAt)}</td>
                          <td className="px-5 py-3 text-[13px] text-slate-500">{entry.notes || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
