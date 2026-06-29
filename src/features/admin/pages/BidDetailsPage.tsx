import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import { adminService, BidDetails } from "../services/adminService";

export default function BidDetailsPage() {
  const { bidId = "" } = useParams();
  const navigate = useNavigate();
  const [bid, setBid] = useState<BidDetails | null>(null);

  useEffect(() => {
    adminService.getBidDetails(bidId).then(setBid);
  }, [bidId]);

  if (!bid) {
    return (
      <AdminLayout title="PharmaBridge Admin" showBack onBack={() => navigate("/admin/bids")}>
        <div className="ml-0 p-6 text-on-surface-variant">Loading bid…</div>
      </AdminLayout>
    );
  }

  const subtotal = bid.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);

  return (
    <AdminLayout title="PharmaBridge Admin">
      <main className="p-6 min-h-[calc(100vh-48px)] bg-background">
        {/* Breadcrumbs & Header */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-label-md text-on-surface-variant mb-2">
            <button onClick={() => navigate("/admin/bids")} className="hover:text-primary flex items-center gap-1">
              <span className="material-symbols-outlined !text-[14px]">arrow_back</span>
              Back to Bids
            </button>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">{bid.id}</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-display-sm text-display-sm font-extrabold text-on-surface mb-1">
                Bid Details / #{bid.id}
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Active Bid
                </span>
                <span className="text-label-md text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[16px]">calendar_month</span>
                  Created {bid.createdAt}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border border-secondary text-secondary px-4 h-8 font-label-md flex items-center gap-2 hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined !text-[18px]">close</span>
                Reject Bid
              </button>
              <button className="bg-primary text-white px-4 h-8 font-label-md flex items-center gap-2 hover:opacity-90 transition-all">
                <span className="material-symbols-outlined !text-[18px]">check</span>
                Approve Bid
              </button>
            </div>
          </div>
        </nav>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Bid Info Card */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border border-outline-variant p-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Bid Info
                </h3>
                <span className="material-symbols-outlined text-outline">info</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-variant">Bid Reference</span>
                  <span className="text-mono-sm font-bold">{bid.reference}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-variant">Total Value</span>
                  <span className="text-body-md font-bold text-on-surface">${bid.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-variant">Submitted By</span>
                  <span className="text-body-md">{bid.submittedBy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-on-surface-variant">Expiring In</span>
                  <span className="text-body-sm font-bold text-error">{bid.expiresInLabel}</span>
                </div>
                {/* Highlighted Platform Fee */}
                <div className="mt-6 p-3 bg-primary-fixed/20 border border-primary-fixed rounded-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-primary font-bold uppercase tracking-wider">Platform Fee</span>
                    <span className="text-headline-sm font-display-sm text-primary">${bid.platformFee.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-on-primary-fixed-variant mt-1">
                    Calculated as {bid.platformFeePct}% of the total wholesale value.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant p-4">
              <div className="flex justify-between items-center pb-3 border-b border-outline-variant mb-4">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Status History
                </h3>
              </div>
              <div className="space-y-4 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
                {bid.statusHistory.map((step, i) => (
                  <div key={i} className="flex gap-4 relative pl-7">
                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-4 ring-white">
                      <span className="material-symbols-outlined !text-[12px] text-white">{step.icon}</span>
                    </div>
                    <div>
                      <p className="text-body-sm font-bold">{step.label}</p>
                      <p className="text-[11px] text-on-surface-variant">{step.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Item Details & Pharmacy Info */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Item Details */}
            <div className="bg-white border border-outline-variant">
              <div className="flex justify-between items-center p-4 border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Item Details
                </h3>
                <span className="text-body-sm font-bold text-primary">{bid.items.length} Items Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">
                        SKU / Medication
                      </th>
                      <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase">Dosage</th>
                      <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                        Qty
                      </th>
                      <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                        Unit Price
                      </th>
                      <th className="px-4 py-2 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {bid.items.map((item) => (
                      <tr key={item.sku} className="hover:bg-surface-container-low transition-colors h-table-row-height">
                        <td className="px-4 py-2">
                          <div className="flex flex-col">
                            <span className="text-body-md font-bold">{item.medicationName}</span>
                            <span className="text-mono-sm text-on-surface-variant">{item.sku}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-body-sm">{item.dosage}</td>
                        <td className="px-4 py-2 text-body-sm text-right font-mono-sm">{item.qty}</td>
                        <td className="px-4 py-2 text-body-sm text-right font-mono-sm">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-2 text-body-sm text-right font-bold font-mono-sm">
                          ${(item.qty * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-surface-container-low border-t border-outline">
                      <td className="px-4 py-3 text-right font-label-md uppercase" colSpan={4}>
                        Subtotal
                      </td>
                      <td className="px-4 py-3 text-right font-display-sm text-headline-sm">${subtotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pharmacy Info */}
            <div className="bg-white border border-outline-variant overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b border-outline-variant">
                <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">
                  Pharmacy Info
                </h3>
                <a className="text-primary text-label-md font-bold hover:underline" href="#">
                  View Profile
                </a>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-outline-variant">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary !text-[32px]">local_pharmacy</span>
                    </div>
                    <div>
                      <h4 className="text-body-md font-bold">{bid.pharmacy.name}</h4>
                      <p className="text-body-sm text-on-surface-variant">Licence: {bid.pharmacy.licence}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={`material-symbols-outlined !text-[14px] ${
                              i < Math.round(bid.pharmacy.rating) ? "text-primary" : "text-outline-variant"
                            }`}
                            style={i < Math.round(bid.pharmacy.rating) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            star
                          </span>
                        ))}
                        <span className="text-[10px] text-on-surface-variant font-bold ml-1">({bid.pharmacy.rating})</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-body-sm">
                      <span className="material-symbols-outlined !text-[18px] text-on-surface-variant">location_on</span>
                      {bid.pharmacy.address}
                    </div>
                    <div className="flex items-center gap-2 text-body-sm">
                      <span className="material-symbols-outlined !text-[18px] text-on-surface-variant">phone</span>
                      {bid.pharmacy.phone}
                    </div>
                    <div className="flex items-center gap-2 text-body-sm">
                      <span className="material-symbols-outlined !text-[18px] text-on-surface-variant">mail</span>
                      {bid.pharmacy.email}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-0 relative min-h-[160px] bg-surface-container-high">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-sm border border-outline-variant p-3 shadow-sm flex flex-col items-center">
                      <span className="material-symbols-outlined text-primary mb-1">share_location</span>
                      <span className="text-label-md font-bold uppercase tracking-tighter">Verified Hub</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AdminLayout>
  );
}
