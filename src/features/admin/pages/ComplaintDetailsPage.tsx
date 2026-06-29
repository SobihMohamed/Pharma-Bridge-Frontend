import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import {
  useComplaintDetailsQuery,
  useUpdateComplaintStatusMutation,
} from "../hooks/useAdminComplaintsQuery";

// ---------- Constants ----------

const STATUS_OPTIONS = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "InProgress" },
  { label: "Resolved", value: "Resolved" },
  { label: "Closed", value: "Closed" },
  { label: "Rejected", value: "Rejected" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
  InProgress: "bg-sky-50 text-sky-700 border border-sky-200/50",
  Resolved: "bg-primary/15 text-primary border border-primary/30",
  Closed: "bg-slate-50 text-slate-700 border border-slate-200/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  InProgress: "bg-sky-500",
  Resolved: "bg-primary",
  Closed: "bg-slate-500",
  Rejected: "bg-rose-500",
};

// ---------- Helpers ----------

const formatDateTime = (iso: string | null) => {
  if (!iso) return "N/A";
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
    </div>
  );
}

// ---------- Status Change Modal ----------

function ChangeStatusModal({
  currentStatus,
  onClose,
  onSave,
  isSaving,
}: {
  currentStatus: string;
  onClose: () => void;
  onSave: (status: string, adminNotes: string) => void;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [adminNotes, setAdminNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Change Status</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
          <select
            className="w-full h-10 bg-white border border-slate-200 rounded-lg px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Admin Notes */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Admin Notes</label>
          <textarea
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
            rows={4}
            placeholder="Add notes about this status change..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-label-md text-label-md rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status, adminNotes)}
            disabled={isSaving}
            className="h-10 px-5 bg-primary hover:opacity-90 text-white font-label-md text-label-md rounded-lg flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main Page ----------

export default function ComplaintDetailsPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();

  const { data: details, isLoading, isError } = useComplaintDetailsQuery(complaintId || "");
  const updateMutation = useUpdateComplaintStatusMutation(complaintId || "");

  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleSaveStatus = (status: string, adminNotes: string) => {
    updateMutation.mutate(
      { status, adminNotes },
      {
        onSuccess: () => setShowStatusModal(false),
      },
    );
  };

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/complaints")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Complaints
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-700 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load complaint details</h4>
            <p className="text-sm mt-1 text-rose-600">
              Could not fetch complaint data. The complaint may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading + Change Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Complaint Details</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Submitted by {details.submittedByName}
                </p>
              </div>
              <button
                onClick={() => setShowStatusModal(true)}
                className="h-10 px-5 bg-primary hover:opacity-90 text-white font-label-md text-label-md rounded-lg flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                Change Status
              </button>
            </div>

            {/* Complaint Info Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Complaint Information</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow label="Title">{details.title}</DetailRow>
                <DetailRow label="Status">
                  <StatusBadge status={details.status} />
                </DetailRow>
                <DetailRow label="Submitted By">{details.submittedByName}</DetailRow>
                <DetailRow label="Order ID">
                  {details.orderId != null ? (
                    <span className="font-semibold text-primary">{details.orderId}</span>
                  ) : (
                    "N/A"
                  )}
                </DetailRow>
                <DetailRow label="Created At">{formatDateTime(details.createdAt)}</DetailRow>
                <DetailRow label="Resolved At">{formatDateTime(details.resolvedAt)}</DetailRow>
                <DetailRow label="Resolved By">{details.resolvedByName || "N/A"}</DetailRow>
              </div>

              {/* Description — full-width */}
              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Description
                </span>
                <p className="text-[14px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {details.description || "—"}
                </p>
              </div>

              {/* Admin Notes — full-width */}
              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Admin Notes
                </span>
                <p className="text-[14px] text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {details.adminNotes || "—"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Change Status Modal */}
      {showStatusModal && details && (
        <ChangeStatusModal
          currentStatus={details.status}
          onClose={() => setShowStatusModal(false)}
          onSave={handleSaveStatus}
          isSaving={updateMutation.isPending}
        />
      )}
    </AdminLayout>
  );
}
