import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { usePharmaOwnerDetailsQuery, useUpdatePharmaOwnerStatusMutation } from "../hooks/useAdminPharmaOwnersQuery";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  FileText,
  User,
  Mail,
  Phone,
  Shield,
  Eye,
} from "lucide-react";

// ---------- Constants ----------

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50",
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/50",
  Blocked: "bg-slate-100 text-slate-700 border border-slate-350 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-amber-500 dark:bg-amber-500",
  Approved: "bg-emerald-500 dark:bg-emerald-500",
  Rejected: "bg-rose-500 dark:bg-rose-500",
  Blocked: "bg-slate-500 dark:bg-slate-500",
};

// ---------- Sub-components ----------

function StatusBadge({ status }: { status: string }) {
  const normalized = status || "Pending";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[normalized] || STATUS_STYLES.Pending}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[normalized] || STATUS_DOT.Pending}`} />
      {normalized}
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
    <div className="flex items-start gap-3 p-4 bg-slate-50/50 dark:bg-[#0b0f19]/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">{icon}</div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{value}</div>
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
      <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageThumbnail({ label, src }: { label: string; src: string | null | undefined }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
        {label}
      </span>
      {src ? (
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block group w-full max-w-sm">
          <div className="relative rounded-2xl border border-slate-250 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 hover:border-blue-500 transition-all duration-300 shadow-sm">
            <img
              src={src}
              alt={label}
              className="max-h-48 md:max-h-60 object-contain w-full mx-auto"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:group-hover:bg-black/40 flex items-center justify-center transition-colors">
              <span className="bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 shadow-md transition-opacity">
                <Eye className="w-3.5 h-3.5" />
                View Document
              </span>
            </div>
          </div>
        </a>
      ) : (
        <div className="max-w-sm h-36 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-[#0b0f19]/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5 p-4 transition-colors duration-300">
          <AlertCircle className="w-6 h-6 text-slate-350 dark:text-slate-600" />
          <span className="text-xs font-bold text-slate-450 dark:text-slate-500">Not Uploaded</span>
        </div>
      )}
    </div>
  );
}

export default function PharmaOwnerDetailsPage() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  const { data: details, isLoading, isError, error } = usePharmaOwnerDetailsQuery(ownerId || "");
  const updateMutation = useUpdatePharmaOwnerStatusMutation(ownerId || "");

  const handleUpdateStatus = (newStatus: string) => {
    updateMutation.mutate(newStatus, {
      onSuccess: () => {
        setShowBlockConfirm(false);
        toast.success(`Pharma owner status updated to ${newStatus} successfully.`);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update status.");
      },
    });
  };

  const currentStatus = details?.status || "Pending";
  const isUpdating = updateMutation.isPending;

  const showApprove = currentStatus === "Pending" || currentStatus === "Rejected" || currentStatus === "Blocked";
  const showReject = currentStatus === "Pending";
  const showBlock = currentStatus === "Pending" || currentStatus === "Approved" || currentStatus === "Rejected";

  return (
    <AdminLayout title="Owner verification">
      <div className="p-6 space-y-6 bg-[#F4F6FA] dark:bg-[#0b0f19] min-h-screen transition-colors duration-300">
        {/* Back Link */}
        <div>
          <button
            onClick={() => navigate("/admin/pharma-owners")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-[#0f172a] px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to owners list
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-750 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
            <AlertCircle className="w-8 h-8 mx-auto text-rose-500 mb-2" />
            <h4 className="text-lg font-bold">Failed to load pharma owner details</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-400">
              {(error as any)?.message ||
                "There was an issue retrieving the details. Please verify the endpoint is online."}
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading & Actions bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Owner Verification</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                  Reviewing credentials for ID: <span className="font-bold text-slate-700 dark:text-slate-300">{details.id}</span>
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {showApprove && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Approved")}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4.5 h-4.5" />
                    )}
                    Approve
                  </button>
                )}

                {showReject && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <XCircle className="w-4.5 h-4.5" />
                    )}
                    Reject
                  </button>
                )}

                {showBlock && (
                  <div className="relative">
                    <button
                      disabled={isUpdating}
                      onClick={() => setShowBlockConfirm((current) => !current)}
                      className="h-10 px-4 bg-slate-700 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                      Block Owner
                    </button>

                    {showBlockConfirm && !isUpdating && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <button
                          type="button"
                          aria-label="Close block confirmation"
                          onClick={() => setShowBlockConfirm(false)}
                          className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm"
                        />

                        <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0f172a] p-6 shadow-2xl space-y-4 transition-colors duration-300">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400">
                              <XCircle className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-base font-bold text-slate-900 dark:text-white">Block this pharma owner?</p>
                              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Are you sure you want to restrict this owner? They will lose access to login and manage their linked pharmacies.
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              onClick={() => setShowBlockConfirm(false)}
                              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateStatus("Blocked")}
                              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 shadow-sm transition-colors"
                            >
                              Confirm Block
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info Details container */}
            <div className="bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300">
              <div className="flex items-center gap-2 border-b border-slate-50 dark:border-slate-800 pb-3">
                <Info className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                  Profile Information
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <DetailItem
                  label="Full Name"
                  value={details.fullName}
                  icon={<User className="w-4 h-4" />}
                />
                <DetailItem
                  label="Verification Status"
                  value={<StatusBadge status={details.status} />}
                  icon={<Shield className="w-4 h-4" />}
                />
                <DetailItem
                  label="Email Address"
                  value={details.email}
                  icon={<Mail className="w-4 h-4" />}
                />
                <DetailItem
                  label="Phone Number"
                  value={details.phoneNumber || "—"}
                  icon={<Phone className="w-4 h-4" />}
                />
                <DetailItem
                  label="National ID Number"
                  value={details.nationalId || "—"}
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>

              {/* Images Grid */}
              <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                    Verification Documents
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <ImageThumbnail label="National ID Front" src={details.nationalIdFront} />
                  <ImageThumbnail label="National ID Back" src={details.nationalIdBack} />
                  <ImageThumbnail label="Syndicate Card Scan" src={details.syndicateCardImage} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
