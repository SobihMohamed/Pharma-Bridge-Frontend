import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { usePharmacyDetailsQuery, useUpdatePharmacyStatusMutation } from "../hooks/useAdminPharmaciesQuery";
import { useToast } from "@/hooks/useToast";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0">
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider sm:w-48 shrink-0">
        {label}
      </span>
      <span className="text-[14px] text-slate-800 dark:text-slate-200 font-medium">{children}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    Active: "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    Blocked: "bg-slate-100 text-slate-700 border border-slate-350 dark:bg-slate-500/10 dark:text-slate-300 dark:border-slate-500/20",
  };
  const dots: Record<string, string> = {
    Pending: "bg-amber-500 dark:bg-amber-400",
    Active: "bg-emerald-500 dark:bg-emerald-400",
    Blocked: "bg-slate-500 dark:bg-slate-400",
  };

  const normalized = status || "Pending";
  const badgeClass = styles[normalized] || "bg-slate-50 text-slate-700 border border-slate-200/50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  const dotClass = dots[normalized] || "bg-slate-500 dark:bg-slate-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${badgeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {normalized}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 transition-colors duration-300">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3" />
      </div>
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 transition-colors duration-300">
        <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded w-1/4" />
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-sm" />
      </div>
    </div>
  );
}

function ImageThumbnail({ label, src }: { label: string; src: string | null | undefined }) {
  return (
    <div className="space-y-1.5">
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
        {label}
      </span>
      {src ? (
        <a href={src} target="_blank" rel="noopener noreferrer" className="inline-block group w-full max-w-sm">
          <div className="relative rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 hover:border-primary dark:hover:border-primary transition-all duration-300 shadow-sm">
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
        <div className="max-w-sm h-36 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-1.5 p-4 transition-colors duration-300">
          <span className="material-symbols-outlined text-[24px]">image_not_supported</span>
          <span className="text-xs font-medium">Not Available</span>
        </div>
      )}
    </div>
  );
}

const formatDate = (isoString: string | null | undefined) => {
  if (!isoString) return "—";
  try {
    return new Date(isoString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

export default function PharmacyDetailsPage() {
  const { pharmacyId } = useParams<{ pharmacyId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const { data: details, isLoading, isError, error } = usePharmacyDetailsQuery(pharmacyId || "");
  const updateMutation = useUpdatePharmacyStatusMutation(pharmacyId || "");

  const handleUpdateStatus = (newStatus: string) => {
    updateMutation.mutate(newStatus, {
      onSuccess: () => {
        toast.success(`Pharmacy status updated to ${newStatus} successfully.`);
      },
      onError: (err: any) => {
        toast.error(err?.message || "Failed to update status.");
      },
    });
  };

  const currentStatus = details?.status || "Pending";
  const isUpdating = updateMutation.isPending;

  const showActivate = currentStatus === "Pending" || currentStatus === "Blocked";
  const showBlock = currentStatus === "Pending" || currentStatus === "Active";

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 md:p-8 min-h-[calc(100vh-48px)] space-y-6 bg-[#F8FAFC] dark:bg-[#0b0f19] transition-colors duration-300">
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/pharmacies")}
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Pharmacies
          </button>
        </div>

        {isLoading ? (
          <PageSkeleton />
        ) : isError || !details ? (
          <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-755 dark:text-rose-400 border border-rose-200/50 dark:border-rose-500/20 rounded-xl p-8 text-center max-w-xl mx-auto shadow-sm transition-colors duration-300">
            <span className="material-symbols-outlined text-[36px] mb-2 text-rose-500 dark:text-rose-400">warning</span>
            <h4 className="text-lg font-bold">Failed to load pharmacy details</h4>
            <p className="text-sm mt-1 text-rose-600 dark:text-rose-400/80">
              {(error as any)?.message ||
                "There was an issue retrieving the details. Please verify the endpoint is online."}
            </p>
          </div>
        ) : (
          <>
            {/* Page Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{details.pharmacyName}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  Comprehensive profile details and registration status verification.
                </p>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {showActivate && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Active")}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    )}
                    Activate
                  </button>
                )}

                {showBlock && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus("Blocked")}
                    className="h-10 px-4 bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
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

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Pharmacy Info & Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pharmacy Information Card */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">store</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Pharmacy Information
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailRow label="Pharmacy Name">{details.pharmacyName}</DetailRow>
                    <DetailRow label="Status">
                      <StatusBadge status={details.status} />
                    </DetailRow>
                    <DetailRow label="License Number">{details.licenseNumber}</DetailRow>
                    <DetailRow label="Contact Phone">{details.contactPhone || "—"}</DetailRow>
                    <DetailRow label="Area">{details.area || "—"}</DetailRow>
                    <DetailRow label="Address">{details.textAddress || "—"}</DetailRow>
                    <DetailRow label="Working Hours">
                      {details.is24Hours ? "Open 24 Hours" : `${details.openTime} - ${details.closeTime}`}
                    </DetailRow>
                    <DetailRow label="Registration Date">{formatDate(details.registrationDate)}</DetailRow>
                    <DetailRow label="Average Rating">
                      <div className="flex items-center gap-1 text-slate-800 dark:text-slate-200 font-medium">
                        <span className="material-symbols-outlined text-amber-500 text-[18px]">star</span>
                        <span className="font-bold">{details.averageRating != null ? details.averageRating.toFixed(1) : "0.0"}</span>
                        <span className="text-slate-400 dark:text-slate-500 text-xs">/ 5.0</span>
                      </div>
                    </DetailRow>
                    <DetailRow label="Completed Orders">
                      <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-semibold">
                        <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[18px]">shopping_bag</span>
                        <span>{details.completeOrderCount ?? 0} orders</span>
                      </div>
                    </DetailRow>
                  </div>
                </div>

                {/* Documents Card */}
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">assignment</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Verification Documents
                    </span>
                  </div>
                  <div>
                    <ImageThumbnail label="License Image" src={details.licenseImageUrl} />
                  </div>
                </div>
              </div>

              {/* Right Column - Owner Details */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6 transition-colors duration-300">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-[20px]">person</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      Pharmacy Owner
                    </span>
                  </div>

                  {details.owner ? (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Full Name
                        </span>
                        <span className="text-[14px] text-slate-800 dark:text-slate-200 font-bold">{details.owner.fullName}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Email Address
                        </span>
                        <a
                          href={`mailto:${details.owner.email}`}
                          className="text-[14px] text-primary hover:underline font-medium break-all"
                        >
                          {details.owner.email}
                        </a>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Phone Number
                        </span>
                        <span className="text-[14px] text-slate-800 dark:text-slate-200 font-medium">
                          {details.owner.phoneNumber || "—"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          Owner Status
                        </span>
                        <div>
                          <StatusBadge status={details.owner.status} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
                      <span className="material-symbols-outlined text-[36px]">no_accounts</span>
                      <p className="text-xs font-medium">No owner information linked</p>
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
