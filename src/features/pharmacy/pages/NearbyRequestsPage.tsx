import React from 'react';

export default function NearbyRequestsPage() {
  return (
    <div className="pt-8 px-4 md:px-8 pb-12 max-w-container-max mx-auto">
      {/* Page Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Nearby Requests</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Active patient prescriptions seeking fulfillment within your radius.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
            <input className="pl-9 pr-4 py-2 border border-border-light rounded-lg bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm w-full sm:w-64 transition-shadow" placeholder="Search medications..." type="text"/>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border-light rounded-lg hover:bg-surface-gray transition-colors font-label-md text-on-surface whitespace-nowrap">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card 1 */}
        <article className="bg-surface border border-border-light rounded-xl p-5 flex flex-col gap-5 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">JD</div>
              <div>
                <div className="font-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-outline">near_me</span>
                  2.4 km away
                </div>
                <div className="font-body-sm text-on-surface-variant mt-0.5">Submitted 10m ago</div>
              </div>
            </div>
            <span className="bg-surface-container-high text-secondary font-label-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary block"></span>
              New
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Amoxicillin 500mg</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">30 capsules, Take 1 capsule three times a day. Insurance approved.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Capsules</span>
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Antibiotic</span>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-tint transition-colors">
              View &amp; Bid
            </button>
          </div>
        </article>

        {/* Card 2 */}
        <article className="bg-surface border border-border-light rounded-xl p-5 flex flex-col gap-5 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">MP</div>
              <div>
                <div className="font-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-outline">near_me</span>
                  4.1 km away
                </div>
                <div className="font-body-sm text-on-surface-variant mt-0.5">Submitted 45m ago</div>
              </div>
            </div>
            <span className="bg-status-amber/10 text-status-amber font-label-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-amber block"></span>
              Expiring
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Lisinopril 10mg</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">90 tablets, 3 month supply. Patient requires brand name if possible.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Tablets</span>
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Blood Pressure</span>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-tint transition-colors">
              View &amp; Bid
            </button>
          </div>
        </article>

        {/* Card 3 */}
        <article className="bg-surface border border-border-light rounded-xl p-5 flex flex-col gap-5 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">AS</div>
              <div>
                <div className="font-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-outline">near_me</span>
                  1.2 km away
                </div>
                <div className="font-body-sm text-on-surface-variant mt-0.5">Submitted 1h ago</div>
              </div>
            </div>
            <span className="bg-surface-container-high text-secondary font-label-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary block"></span>
              New
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Ozempic 2mg</h3>
              <span className="material-symbols-outlined text-status-red text-[16px]" title="Urgent Fulfillment Requested">priority_high</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">1 pen (3mL). Urgent fill requested. Requires refrigeration.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Injection</span>
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Cold Storage</span>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-tint transition-colors">
              View &amp; Bid
            </button>
          </div>
        </article>

        {/* Card 4 */}
        <article className="bg-surface border border-border-light rounded-xl p-5 flex flex-col gap-5 hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-label-md text-primary font-bold">RK</div>
              <div>
                <div className="font-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-outline">near_me</span>
                  8.5 km away
                </div>
                <div className="font-body-sm text-on-surface-variant mt-0.5">Submitted 2h ago</div>
              </div>
            </div>
            <span className="bg-status-amber/10 text-status-amber font-label-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-amber block"></span>
              Expiring
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Atorvastatin 40mg</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">30 tablets, daily maintenance dose.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="border border-border-light rounded px-2 py-0.5 font-label-sm text-outline-variant">Tablets</span>
            </div>
          </div>
          <div className="mt-auto pt-2">
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-2.5 rounded-lg hover:bg-surface-tint transition-colors">
              View &amp; Bid
            </button>
          </div>
        </article>
      </div>
    </div>
  );
}
