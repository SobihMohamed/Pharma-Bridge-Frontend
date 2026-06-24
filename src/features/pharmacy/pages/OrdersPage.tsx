import React from 'react';

export default function OrdersPage() {
  return (
    <div className="p-margin-mobile md:p-gutter">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Orders Management</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Review and manage recent prescription orders.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="pl-9 pr-4 py-2 bg-surface border border-border-light rounded-lg text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-full sm:w-64" placeholder="Search orders..." type="text"/>
          </div>
          <button className="bg-surface border border-border-light text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface rounded-xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-gray border-b border-border-light">
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Order ID</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Patient Name</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Amount</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Payment Method</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Payment Status</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Date</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap">Order Status</th>
                <th className="font-label-sm text-label-sm uppercase text-outline px-4 py-3 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-border-light">
              {/* Row 1: Processing */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-4 py-3 font-medium text-secondary">#ORD-2024-8901</td>
                <td className="px-4 py-3">Michael Chang</td>
                <td className="px-4 py-3 font-medium">$145.50</td>
                <td className="px-4 py-3 text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span> Credit Card
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Paid
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">Oct 24, 09:15 AM</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm border border-secondary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Processing
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-gray transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              {/* Row 2: Out for Delivery */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-4 py-3 font-medium text-secondary">#ORD-2024-8900</td>
                <td className="px-4 py-3">Emily Rodriguez</td>
                <td className="px-4 py-3 font-medium">$89.99</td>
                <td className="px-4 py-3 text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">account_balance</span> Bank Transfer
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Paid
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">Oct 24, 08:30 AM</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-status-amber font-label-sm text-label-sm border border-status-amber/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-amber"></span> Out for Delivery
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-gray transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              {/* Row 3: Delivered */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-4 py-3 font-medium text-secondary">#ORD-2024-8899</td>
                <td className="px-4 py-3">Robert Smith</td>
                <td className="px-4 py-3 font-medium">$210.00</td>
                <td className="px-4 py-3 text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span> Insurance
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Verified
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">Oct 23, 04:45 PM</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Delivered
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-gray transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              {/* Row 4: Cancelled */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-4 py-3 font-medium text-secondary">#ORD-2024-8895</td>
                <td className="px-4 py-3">Amanda Williams</td>
                <td className="px-4 py-3 font-medium">$45.20</td>
                <td className="px-4 py-3 text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span> Credit Card
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-error font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Refunded
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">Oct 23, 11:20 AM</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-error font-label-sm text-label-sm border border-error/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-red"></span> Cancelled
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-gray transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
              {/* Row 5: Delivered */}
              <tr className="hover:bg-surface-container-lowest transition-colors group">
                <td className="px-4 py-3 font-medium text-secondary">#ORD-2024-8892</td>
                <td className="px-4 py-3">David Chen</td>
                <td className="px-4 py-3 font-medium">$320.75</td>
                <td className="px-4 py-3 text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span> Cash
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Paid
                  </span>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">Oct 22, 02:15 PM</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Delivered
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-primary hover:text-primary-container font-label-md text-label-md px-3 py-1.5 rounded-lg hover:bg-surface-gray transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-border-light flex items-center justify-between bg-surface">
          <p className="font-body-sm text-body-sm text-outline">Showing 1 to 5 of 124 orders</p>
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-surface-gray text-outline disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary font-label-sm flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded hover:bg-surface-gray text-on-surface font-label-sm flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded hover:bg-surface-gray text-on-surface font-label-sm flex items-center justify-center">3</button>
            <span className="text-outline">...</span>
            <button className="p-1 rounded hover:bg-surface-gray text-on-surface">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
