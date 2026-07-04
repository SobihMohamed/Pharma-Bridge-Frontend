import { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import { adminService, ActivityLogEntry, DashboardStats } from "../services/adminService";

const STATUS_STYLES: Record<ActivityLogEntry["status"], string> = {
  Completed: "bg-primary/10 text-primary",
  "Pending Review": "bg-secondary-container/30 text-secondary",
  Urgent: "bg-error-container/30 text-error",
};

function KpiCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  trendIcon,
  trendLabel,
  trendColor,
  hoverBorder = "hover:border-primary",
}: {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  trendIcon: string;
  trendLabel: string;
  trendColor: string;
  hoverBorder?: string;
}) {
  return (
    <div
      className={`bg-white border border-outline-variant p-4 rounded-lg flex flex-col justify-between ${hoverBorder} transition-colors cursor-default`}
    >
      <div className="flex justify-between items-start">
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">{label}</span>
        <div className={`w-8 h-8 rounded ${iconBg} flex items-center justify-center ${iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-display-sm text-display-sm font-extrabold text-on-surface">{value}</p>
        <p className={`font-mono-sm text-mono-sm ${trendColor} flex items-center gap-1 mt-1`}>
          <span className="material-symbols-outlined text-[14px]">{trendIcon}</span>
          {trendLabel}
        </p>
      </div>
    </div>
  );
}

function ModuleCard({
  imageUrl,
  imageAlt,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  primaryClass = "bg-primary text-on-primary",
}: {
  imageUrl: string;
  imageAlt: string;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  primaryClass?: string;
}) {
  return (
    <div className="group relative bg-white border border-outline-variant rounded-lg overflow-hidden flex h-48 hover:shadow-lg transition-all duration-300">
      <div className="w-1/3 h-full overflow-hidden">
        <img
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          src={imageUrl}
          alt={imageAlt}
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface">{title}</h4>
          <p className="text-body-sm text-on-surface-variant mt-1">{description}</p>
        </div>
        <div className="flex gap-2">
          <button className={`h-8 px-4 ${primaryClass} text-label-md rounded font-bold hover:opacity-90 transition-opacity`}>
            {primaryLabel}
          </button>
          <button className="h-8 px-4 border border-outline text-label-md rounded hover:bg-surface-container-low transition-colors">
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityLogEntry[]>([]);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats);
    adminService.getRecentActivity().then(setActivity);
  }, []);

  return (
    <AdminLayout title="PharmaBridge Admin">
      <div className="p-6 flex-1 space-y-8">
        {/* Header Section */}
        <section className="flex flex-col gap-1">
          <h2 className="font-display-sm text-display-sm text-on-surface">System Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Real-time logistics and patient management summary for today.
          </p>
        </section>

        {/* KPI Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <KpiCard
            label="Total Patients"
            value={stats ? stats.totalPatients.toLocaleString() : "—"}
            icon="group"
            iconBg="bg-primary/10"
            iconColor="text-primary"
            trendIcon="trending_up"
            trendLabel={stats ? `+${stats.totalPatientsDeltaPct}% vs last month` : ""}
            trendColor="text-primary"
          />
          <KpiCard
            label="Active Bids"
            value={stats ? stats.activeBids.toLocaleString() : "—"}
            icon="local_offer"
            iconBg="bg-secondary-container/30"
            iconColor="text-secondary"
            trendIcon="history"
            trendLabel={stats ? `${stats.bidsExpiringSoon} expiring soon` : ""}
            trendColor="text-secondary"
          />
          <KpiCard
            label="Pending Complaints"
            value={stats ? stats.pendingComplaints.toLocaleString() : "—"}
            icon="report_problem"
            iconBg="bg-error-container/30"
            iconColor="text-error"
            trendIcon="warning"
            trendLabel={stats ? `${stats.criticalComplaints} critical priority` : ""}
            trendColor="text-error"
            hoverBorder="hover:border-error"
          />
          <KpiCard
            label="Today's Orders"
            value={stats ? stats.todaysOrders.toLocaleString() : "—"}
            icon="shopping_cart"
            iconBg="bg-primary-fixed/20"
            iconColor="text-on-primary-container"
            trendIcon="check_circle"
            trendLabel={stats ? `${stats.fulfillmentRatePct}% fulfillment rate` : ""}
            trendColor="text-primary"
          />
        </section>

        {/* Quick Navigation Modules */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Module Quick Access</h3>
            <button className="px-3 py-1 border border-outline text-label-md rounded hover:bg-surface-container-low transition-colors">
              Configure Layout
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <ModuleCard
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC2BKmx_DEaVR4G81B1wF0106B1jgxVfUIKSHq4aQnjFHWrZctwfSp2IHi7AIvh0pq-Ct1agtE1wxZt3GR3FP2asfYV3SJXvH-gQJZ0W_YKMsd_orAON9RdYGWDTZLgSYGbjMP-mNX6w-IdBPH48eqA6wNhhIlRlSLBr5xPc9noLkthihrRCSjJIINV6Co82wA03OtQfdiU9pYGnk5u70nDX_9WcnqldVtRlxFeZifXM2St5IZ2ELPEviJ2QLX4bjq_lICE7EeouBVL"
              imageAlt="Patient management"
              title="Patient Directory"
              description="Manage enrollments, medical records, and eligibility statuses across all regions."
              primaryLabel="Open Module"
              secondaryLabel="Add Patient"
            />
            <ModuleCard
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuDg6iym8QG7T2g3YfnTXR7kKjS2vAH6rfIzmVciSmTSqrASOH7jo9TU4e-3N1IT0qpUkFUNFr7_l-mtykJoe7clWDZGKhFyxSGUwmquGzbmacPX6jhbp9ok7ihYSDCdrLdCf7lV-Hozh9Cx3Mx1t0gSzu4sV5tnwr3hHnq4gZ0jfX_Ae2A6TXWVHZcmtn1cl3vmXJVbV_LPU_fPK4l6swpzR6k_9tm2k9TtxEGpk7hXoDX94s0AI6Ww8cnfcz9kBKh4f7GeRkwlG766"
              imageAlt="Bidding engine"
              title="Bidding Engine"
              description="Review active procurement bids, negotiate contracts, and finalize logistics pricing."
              primaryLabel="Open Module"
              secondaryLabel="Active Reports"
            />
            <ModuleCard
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCcJx1PVSmFzatbj1y1w02ACHtha3h9VG3VSpuhczgip3pJpbBidMIFUEaXuRVQBv1I6ks2_vilINnKdRJimWXlNblwNJY01I256TJQXeUo8lD-fposOu6IKAayWbS0awUL8Mjb4XfLOmgnmcf2RAM8DDzEUN2zeyHPB5WR1CRXw7Wq-U7bb-wN_SASzxNgMDBMHxxehwbrkCwlBsEyULZbWa6XC_MW7YKJ06fjCTPTpfT6s70FxO7d3k0YoUlDS9WDw1jwuvZLODn8"
              imageAlt="Complaints center"
              title="Complaints Center"
              description="Track issues from pharmacies and patients. Ensure rapid resolution of logistics errors."
              primaryLabel="Review Pending"
              secondaryLabel="Archive"
              primaryClass="bg-error text-on-error"
            />
            <ModuleCard
              imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBLPWpIUzF5VVHRYAxukaws-AViDKwTvzq6HR58ncZ0T0KVN6Z3Ki0n62E7mbAMum8uuBr7Uj-UH-OHpsFVE4NeBi6w7eJNI9Sp6tUEt6r-ayS-pZQFmRd5VhaWvYjpwS4S26e1c1nWz_69FQRC4dUlNShVOY-rikdz4MFfhtnJU1PZP-h3wqfBgLfsju3q4cAQdWXs1-2oeBYKLPoq30E6qIf01moxXBstZK8YqqES28D9NuyzIBpYYcpr5BAdqxKmQez206Fv2UGf"
              imageAlt="Order management"
              title="Order Management"
              description="Full visibility of today's logistics pipeline, from warehouse dispatch to final delivery."
              primaryLabel="Open Module"
              secondaryLabel="Track Shipments"
            />
          </div>
        </section>

        {/* Recent Activity Table */}
        <section className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-slate-50">
            <h3 className="font-label-md text-label-md font-bold uppercase tracking-widest text-on-surface-variant">
              Recent System Activity
            </h3>
            <a className="text-primary font-label-md hover:underline" href="#">
              View Audit Log
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Timestamp</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Category</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Action Description</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">Status</th>
                  <th className="px-6 py-3 font-label-md text-label-md text-on-surface-variant">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {activity.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors h-table-row-height">
                    <td className="px-6 py-2 font-mono-sm text-mono-sm">{row.timestamp}</td>
                    <td className="px-6 py-2 text-body-sm">{row.category}</td>
                    <td className="px-6 py-2 text-body-sm">{row.description}</td>
                    <td className="px-6 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${STATUS_STYLES[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-2 text-body-sm">{row.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Footer / System Stats */}
      <footer className="mt-auto px-6 py-4 flex justify-between items-center border-t border-outline-variant bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface-variant">System Operational</span>
          </div>
          <span className="text-on-surface-variant/30">|</span>
          <span className="font-mono-sm text-mono-sm text-on-surface-variant">v2.4.12-stable</span>
        </div>
        <div className="text-on-surface-variant font-label-md">© 2024 PharmaBridge Logistics Solutions</div>
      </footer>
    </AdminLayout>
  );
}
