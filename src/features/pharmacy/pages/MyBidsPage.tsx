import React from 'react';

export default function MyBidsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 flex-1 w-full max-w-container-max mx-auto flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-background m-0">My Bids</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage and track the status of your submitted bids.</p>
        </div>
        {/* Quick Filters / Actions */}
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg whitespace-nowrap shadow-sm hover:bg-surface-tint transition-colors">
            All Bids
          </button>
          <button className="px-4 py-2 bg-surface text-on-surface-variant border border-border-light font-label-md text-label-md rounded-lg whitespace-nowrap hover:bg-surface-gray transition-colors">
            Pending
          </button>
          <button className="px-4 py-2 bg-surface text-on-surface-variant border border-border-light font-label-md text-label-md rounded-lg whitespace-nowrap hover:bg-surface-gray transition-colors">
            Accepted
          </button>
        </div>
      </div>

      {/* Bento Grid Layout for Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        {/* Summary Card 1 */}
        <div className="bg-surface border border-border-light rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Active Bids</p>
            <p className="font-headline-md text-headline-md text-on-background">24</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
        </div>
        {/* Summary Card 2 */}
        <div className="bg-surface border border-border-light rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Win Rate</p>
            <p className="font-headline-md text-headline-md text-primary">68%</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined">trending_up</span>
          </div>
        </div>
        {/* Summary Card 3 */}
        <div className="bg-surface border border-border-light rounded-xl p-5 flex items-center justify-between">
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="font-headline-md text-headline-md text-on-background">$12,450</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>
      </div>

      {/* Main Data Table Section */}
      <div className="bg-surface border border-border-light rounded-xl overflow-hidden flex flex-col flex-1 shadow-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border-light flex flex-col sm:flex-row justify-between gap-4 bg-surface-gray/50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
            <span className="font-label-md text-label-md text-on-surface-variant">Filter by Date</span>
            <select className="ml-2 bg-surface border border-border-light text-body-sm font-body-sm rounded-md px-2 py-1 focus:outline-none focus:border-secondary">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-secondary border border-border-light rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md bg-surface">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-light bg-surface-gray">
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Request ID</th>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Submitted At</th>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Total Price</th>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Delivery Time</th>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {/* Row 1 (Pending) */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary">REQ-8024</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-body-md text-body-md text-on-background">Oct 24, 2023</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">14:30 EST</p>
                </td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-background font-medium">$450.00</td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">2 Hours</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-status-amber/10 text-status-amber font-label-md text-label-md border border-status-amber/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-amber"></span>
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary hover:text-secondary-container font-label-md text-label-md transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 ml-auto">
                    View Details
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 2 (Accepted) */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary">REQ-8019</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-body-md text-body-md text-on-background">Oct 23, 2023</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">09:15 EST</p>
                </td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-background font-medium">$1,250.50</td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">4 Hours</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary font-label-md text-label-md border border-primary-container/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Accepted
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary hover:text-secondary-container font-label-md text-label-md transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 ml-auto">
                    View Details
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 3 (Rejected) */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary">REQ-7995</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-body-md text-body-md text-on-background">Oct 21, 2023</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">16:45 EST</p>
                </td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-background font-medium">$85.00</td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">1 Hour</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-error font-label-md text-label-md border border-error/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    Rejected
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary hover:text-secondary-container font-label-md text-label-md transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 ml-auto">
                    View Details
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </td>
              </tr>
              {/* Row 4 (Accepted) */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary">REQ-7988</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-body-md text-body-md text-on-background">Oct 20, 2023</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">11:20 EST</p>
                </td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-background font-medium">$320.00</td>
                <td className="px-6 py-4 font-body-md text-body-md text-on-surface-variant">Same Day</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary font-label-md text-label-md border border-primary-container/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    Accepted
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-secondary hover:text-secondary-container font-label-md text-label-md transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-end gap-1 ml-auto">
                    View Details
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border-light flex items-center justify-between bg-surface-gray/30 mt-auto">
          <span className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 4 of 24 entries</span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled>
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button className="w-8 h-8 rounded bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded text-on-surface-variant hover:bg-surface-container font-label-md text-label-md flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded text-on-surface-variant hover:bg-surface-container font-label-md text-label-md flex items-center justify-center">3</button>
            <span className="w-8 h-8 flex items-center justify-center text-on-surface-variant">...</span>
            <button className="p-1 rounded text-on-surface-variant hover:bg-surface-container">
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
