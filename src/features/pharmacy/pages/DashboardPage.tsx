import React from 'react';

export default function DashboardPage() {
  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      {/* Page Header & Global Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Pharmacy Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Overview of your performance and pending actions.</p>
        </div>
        <div className="flex items-center bg-surface border border-border-light rounded-lg p-1 shadow-sm w-full sm:w-auto overflow-x-auto">
          <button className="px-4 py-1.5 font-label-md text-label-md rounded-md bg-surface-gray text-on-surface-variant hover:bg-surface-container transition-colors whitespace-nowrap">Today</button>
          <button className="px-4 py-1.5 font-label-md text-label-md rounded-md bg-surface-container-low text-primary border border-primary/20 shadow-sm whitespace-nowrap">This Week</button>
          <button className="px-4 py-1.5 font-label-md text-label-md rounded-md bg-surface-gray text-on-surface-variant hover:bg-surface-container transition-colors whitespace-nowrap">This Month</button>
          <button className="px-4 py-1.5 font-label-md text-label-md rounded-md bg-surface-gray text-on-surface-variant hover:bg-surface-container transition-colors whitespace-nowrap flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">calendar_month</span> Custom
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Primary Metric Card (Revenue) - High Prominence */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-surface border border-border-light rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-primary/30 transition-colors">
          {/* Subtle background pattern or tint */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-container/5 rounded-full blur-3xl group-hover:bg-primary-container/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Revenue</h3>
              <div className="font-display-lg text-display-lg text-on-surface tracking-tight">$42,850.00</div>
            </div>
            <div className="p-3 bg-primary-container/10 rounded-lg">
              <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            <span className="flex items-center text-primary font-label-sm text-label-sm bg-primary-container/10 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span> +12.5%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">vs last week</span>
          </div>
        </div>

        {/* Active Bids - Blue / Neutral Focus */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:border-secondary-container/30 transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Bids</h3>
            <span className="material-symbols-outlined text-secondary-container bg-surface-container p-1.5 rounded-md text-[20px]">gavel</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2">342</div>
          <div className="mt-auto pt-2 border-t border-surface-gray">
            <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container"></span> 45 Active currently
            </span>
          </div>
        </div>

        {/* Won Orders - Green / Positive Focus */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:border-primary/30 transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Won Orders</h3>
            <span className="material-symbols-outlined text-primary bg-primary-container/10 p-1.5 rounded-md text-[20px]">workspace_premium</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2">128</div>
          <div className="mt-auto pt-2 border-t border-surface-gray">
            <span className="font-body-sm text-body-sm text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 8% win rate
            </span>
          </div>
        </div>

        {/* Pending Orders - Amber / Warning Focus (Action Required) */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:border-status-amber/30 transition-colors flex flex-col relative overflow-hidden">
          {/* Subtle urgent indicator */}
          <div className="absolute top-0 left-0 w-1 h-full bg-status-amber"></div>
          <div className="flex justify-between items-center mb-3 ml-2">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-status-amber font-bold">Pending Orders</h3>
            <span className="material-symbols-outlined text-status-amber bg-status-amber/10 p-1.5 rounded-md text-[20px]">pending_actions</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2 ml-2">24</div>
          <div className="mt-auto pt-2 border-t border-surface-gray ml-2">
            <a className="font-label-md text-label-md text-secondary-container hover:underline flex items-center gap-1" href="#">
              Review pending <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </a>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:border-border-light transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Completed</h3>
            <span className="material-symbols-outlined text-outline bg-surface-gray p-1.5 rounded-md text-[20px]">check_circle</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2">94</div>
          <div className="mt-auto pt-2 border-t border-surface-gray">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Avg processing: 1.2 days</span>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm hover:border-error/30 transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Cancelled</h3>
            <span className="material-symbols-outlined text-error bg-error-container p-1.5 rounded-md text-[20px]">cancel</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2">6</div>
          <div className="mt-auto pt-2 border-t border-surface-gray">
            <span className="font-body-sm text-body-sm text-error flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">warning</span> Needs review
            </span>
          </div>
        </div>

        {/* Completion Rate (%) - Small gauge or progress bar */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Completion Rate</h3>
            <span className="font-headline-sm text-headline-sm text-primary">94%</span>
          </div>
          <div className="w-full bg-surface-gray rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-right">Target: 95%</span>
        </div>

        {/* Total Platform Fee */}
        <div className="bg-surface border border-border-light rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Platform Fees</h3>
            <span className="material-symbols-outlined text-on-surface-variant bg-surface-gray p-1.5 rounded-md text-[20px]">receipt_long</span>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface mb-2">$857.00</div>
          <div className="mt-auto pt-2 border-t border-surface-gray">
            <span className="font-body-sm text-body-sm text-on-surface-variant">2% average fee rate</span>
          </div>
        </div>
      </div>

      {/* Optional Secondary Content Area (e.g., Recent Activity list to ground the dashboard) */}
      <div className="bg-surface border border-border-light rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light flex justify-between items-center bg-surface-bright">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Won Orders Requires Action</h2>
          <button className="font-label-md text-label-md text-secondary-container hover:underline bg-transparent border-none p-0 cursor-pointer">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-gray border-b border-border-light">
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Order ID</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Patient/Clinic</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Items</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Value</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Status</th>
                <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {/* High density row */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface font-medium">ORD-2023-8901</td>
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface-variant">Mercy General Hospital</td>
                <td className="py-3 px-6 font-body-sm text-body-sm text-on-surface-variant">Amoxicillin (500mg) x 200...</td>
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface">$1,450.00</td>
                <td className="py-3 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-status-amber/10 text-status-amber border border-status-amber/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-amber"></span> Pending Processing
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <button className="font-label-md text-label-md bg-primary text-on-primary px-3 py-1.5 rounded hover:bg-primary-container transition-colors shadow-sm focus:ring-2 focus:ring-primary focus:ring-offset-1">Process</button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-gray/50 transition-colors group">
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface font-medium">ORD-2023-8895</td>
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface-variant">Dr. Smith Clinic</td>
                <td className="py-3 px-6 font-body-sm text-body-sm text-on-surface-variant">Lisinopril (10mg) x 50</td>
                <td className="py-3 px-6 font-body-md text-body-md text-on-surface">$320.00</td>
                <td className="py-3 px-6">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-container/10 text-primary border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Ready for Pickup
                  </span>
                </td>
                <td className="py-3 px-6 text-right">
                  <button className="font-label-md text-label-md text-secondary-container hover:bg-surface-gray px-3 py-1.5 rounded border border-transparent hover:border-border-light transition-colors">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
