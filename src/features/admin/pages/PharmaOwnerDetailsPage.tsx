import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { usePharmaOwnerDetailsQuery, useUpdatePharmaOwnerStatusMutation } from "../hooks/useAdminPharmaOwnersQuery";
import { useToast } from "@/hooks/useToast";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider sm:w-48 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800 font-medium">{children}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200/50",
    Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
    Rejected: "bg-rose-50 text-rose-700 border border-rose-200/50",
    Blocked: "bg-slate-100 text-slate-700 border border-slate-350",
  };
  const dots: Record<string, string> = {
    Pending: "bg-amber-500",
    Approved: "bg-emerald-500",
    Rejected: "bg-rose-500",
    Blocked: "bg-slate-500",
  };

  const normalized = status || "Pending";
  const badgeClass = styles[normalized] || "bg-slate-50 text-slate-700 border border-slate-200/50";
  const dotClass = dots[normalized] || "bg-slate-500";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {normalized}
    </span>
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
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-4">
        <div className="h-5 bg-slate-100 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-slate-100 rounded-lg" />
          <div className="h-48 bg-slate-100 rounded-lg" />
          <div className="h-48 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function ImageThumbnail({ label, src }: { label: string; src: string | null | undefined }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
        {label}
      </span>
      {src ? (
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block group w-full max-w-sm">
          <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50 hover:border-primary transition-all duration-300 shadow-sm">
            <img
              src={src}
              alt={label}
              className="max-h-48 md:max-h-60 object-contain w-full mx-auto"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity">
                open_in_new
              </span>
            </div>
          </div>
        </a>
      ) : (
        <div className="max-w-sm h-36 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
          <span className="material-symbols-outlined text-[24px]">image_not_supported</span>
          <span className="text-xs font-medium">Not Available</span>
        </div>
      )}
    </div>
  );
}

export default function PharmaOwnerDetailsPage() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: details, isLoading, isError, error } = usePharmaOwnerDetailsQuery(ownerId || "");
  const updateMutation = useUpdatePharmaOwnerStatusMutation(ownerId || "");

  const handleUpdateStatus = (newStatus: string) => {
    updateMutation.mutate(newStatus, {
      onSuccess: () => {
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
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC]">
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/pharma-owners")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Pharma Owners
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 text-rose-755 border border-rose-200/50 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500">warning</span>
            <h4 className="text-lg font-bold">Failed to load pharma owner details</h4>
            <p className="text-sm mt-1 text-rose-600">
              {(error as any)?.message ||
                "There was an issue retrieving the details. Please verify the endpoint is online."}
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">Pharma Owner Details</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  Viewing details for owner ID: {details.id}
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {showApprove && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Approved")}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    )}
                    Approve
                  </button>
                )}

                {showReject && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Rejected")}
                    className="h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                    )}
                    Reject
                  </button>
                )}

                {showBlock && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Blocked")}
                    className="h-10 px-4 bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">block</span>
                    )}
                    Block
                  </button>
                )}
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">info</span>
                <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                  Profile Information
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow label="Full Name">{details.fullName}</DetailRow>
                <DetailRow label="Status">
                  <StatusBadge status={details.status} />
                </DetailRow>
                <DetailRow label="Email">{details.email}</DetailRow>
                <DetailRow label="Phone Number">{details.phoneNumber || "—"}</DetailRow>
                <DetailRow label="National ID">{details.nationalId || "—"}</DetailRow>
              </div>

              {/* Images Grid */}
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">assignment</span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                    Verification Documents
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ImageThumbnail label="National ID Front" src={details.nationalIdFront} />
                  <ImageThumbnail label="National ID Back" src={details.nationalIdBack} />
                  <ImageThumbnail label="Syndicate Card Image" src={details.syndicateCardImage} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
