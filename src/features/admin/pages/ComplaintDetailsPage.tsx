import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { formatLocalDateTime } from '@/utils/formatTime';
import {
  useComplaintDetailsQuery,
  useUpdateComplaintStatusMutation,
} from "../hooks/useAdminComplaintsQuery";
import {
  ArrowLeft,
  AlertCircle,
  Info,
  Calendar,
  User,
  MessageSquare,
  FileText,
  Edit,
  X,
  Loader2,
  Tag,
  CheckCircle,
} from "lucide-react";

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
  Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  Closed: "bg-indigo-50 text-indigo-700 border border-indigo-200/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500",
  InProgress: "bg-sky-500",
  Resolved: "bg-emerald-500",
  Closed: "bg-indigo-500",
  Rejected: "bg-rose-500",
};

// ---------- Helpers ----------

const formatDateTime = (iso: string | null) => {
  if (!iso) return "—";
  return formatLocalDateTime(iso);
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

function DetailBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: React.ReactNode, subValue?: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
      <div className="text-slate-400 dark:text-slate-500 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-words">{value}</div>
        {subValue && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subValue}</div>}
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/5" />
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md mx-4 p-6 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Change Status</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</label>
          <select
            className="w-full h-10 bg-slate-50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-700 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 dark:text-white outline-none transition-all appearance-none cursor-pointer"
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

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admin Notes</label>
          <textarea
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-250 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 dark:text-white outline-none transition-all resize-none"
            rows={4}
            placeholder="Add notes about this status change..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(status, adminNotes)}
            disabled={isSaving}
            className="h-10 px-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
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
    <AdminLayout title="Complaint Details">
      <div className="p-6 md:p-8 min-h-screen space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] transition-colors duration-300">
        {/* Back */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/complaints")}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Complaints
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <AlertCircle className="w-10 h-10 mx-auto text-rose-500 dark:text-rose-400 mb-2" />
            <h4 className="text-lg font-bold">Failed to load complaint details</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-500">
              Could not fetch complaint data. The complaint may not exist or the API may be unavailable.
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading + Change Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Complaint Details</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Viewing complaint submitted by {details.submittedByName}
                </p>
              </div>
              <button
                onClick={() => setShowStatusModal(true)}
                className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors shadow-sm self-start sm:self-auto"
              >
                <Edit className="w-4 h-4" />
                Change Status
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* Left Column: Complaint Information Card */}
              <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
                  
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Complaint Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <DetailBox 
                        icon={<Tag className="w-4 h-4" />}
                        label="Title" 
                        value={details.title}
                      />
                    </div>
                    <DetailBox 
                      icon={<User className="w-4 h-4" />}
                      label="Submitted By" 
                      value={details.submittedByName}
                    />
                    <DetailBox 
                      icon={<Info className="w-4 h-4" />}
                      label="Status" 
                      value={<StatusBadge status={details.status} />}
                    />
                    <DetailBox 
                      icon={<Calendar className="w-4 h-4" />}
                      label="Created At" 
                      value={formatDateTime(details.createdAt)}
                    />
                    
                    {details.orderId ? (
                      <DetailBox 
                        icon={<FileText className="w-4 h-4" />}
                        label="Related Order ID" 
                        value={
                          <Link to={`/admin/orders/${details.orderId}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            #{details.orderId}
                          </Link>
                        }
                      />
                    ) : (
                      <DetailBox 
                        icon={<FileText className="w-4 h-4" />}
                        label="Related Order ID" 
                        value="N/A"
                      />
                    )}

                    {details.resolvedAt && (
                      <DetailBox 
                        icon={<CheckCircle className="w-4 h-4" />}
                        label="Resolved At" 
                        value={formatDateTime(details.resolvedAt)}
                      />
                    )}
                    {details.resolvedByName && (
                      <DetailBox 
                        icon={<User className="w-4 h-4" />}
                        label="Resolved By" 
                        value={details.resolvedByName}
                      />
                    )}
                  </div>
                </div>

                {/* Description & Notes Card */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 to-blue-500" />
                  
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Details & Notes</span>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Complaint Description
                      </span>
                      <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                        <p className="text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                          {details.description || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Admin Notes
                      </span>
                      <div className="bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100/50 dark:border-amber-800/30 rounded-xl p-4">
                        <p className="text-[14px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {details.adminNotes || "No admin notes have been added yet."}
                        </p>
                      </div>
                    </div>
                  </div>
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
