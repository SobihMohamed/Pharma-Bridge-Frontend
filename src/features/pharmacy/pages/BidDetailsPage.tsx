import React from 'react';

export default function BidDetailsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <a className="inline-flex items-center text-primary font-label-sm text-label-sm hover:underline mb-2 cursor-pointer">
              <span className="material-symbols-outlined text-[16px] mr-1" data-icon="arrow_back">arrow_back</span>
              Back to Bids
            </a>
            <div className="flex items-center gap-4">
              <h1 className="font-headline-md text-headline-md text-on-background">Bid #BID-2023-4567</h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0]">
                <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">Accepted</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">For Request #REQ-8492</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2 border border-border-light rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container transition-colors flex items-center justify-center gap-2 bg-surface">
              <span className="material-symbols-outlined text-[18px]" data-icon="print">print</span>
              Print
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed-dim hover:text-on-primary-fixed transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]" data-icon="check_circle">check_circle</span>
              Process Order
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Items & Timeline) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline Card */}
            <div className="bg-surface border border-border-light rounded-xl p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">Status &amp; Timeline</h2>
              <div className="relative flex items-center justify-between w-full">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-border-light -translate-y-1/2 z-0"></div>
                <div className="absolute top-1/2 left-4 w-2/3 h-[2px] bg-primary -translate-y-1/2 z-0"></div>
                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-surface text-on-primary">
                    <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface">Submitted</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Oct 24, 09:15 AM</div>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-surface text-on-primary">
                    <span className="material-symbols-outlined text-[16px]" data-icon="check">check</span>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface">Under Review</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Oct 24, 09:45 AM</div>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center border-4 border-surface text-primary border border-primary">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="font-label-md text-label-md text-on-surface">Accepted</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Oct 24, 10:30 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bid Items Card */}
            <div className="bg-surface border border-border-light rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border-light bg-surface-gray">
                <h2 className="font-headline-sm text-headline-sm text-on-background">Bid Items</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-light bg-surface-gray">
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Medication / Item</th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Qty</th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Unit Price</th>
                      <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    <tr className="hover:bg-surface-gray transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-body-md text-body-md text-on-surface font-medium">Amoxicillin 500mg Capsules</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">NDC: 00093-3109-01</div>
                      </td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface text-right">30</td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface text-right">$0.45</td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface font-medium text-right">$13.50</td>
                    </tr>
                    <tr className="hover:bg-surface-gray transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-body-md text-body-md text-on-surface font-medium">Ibuprofen 400mg Tablets</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">NDC: 00093-0047-01</div>
                      </td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface text-right">60</td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface text-right">$0.12</td>
                      <td className="py-3 px-6 font-body-md text-body-md text-on-surface font-medium text-right">$7.20</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (Context, Finances, Logistics) */}
          <div className="space-y-6">
            {/* Financial Summary Card */}
            <div className="bg-surface border border-border-light rounded-xl p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-4">Financial Summary</h2>
              <div className="space-y-3 font-body-md text-body-md">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>$20.70</span>
                </div>
                <div className="flex justify-between text-status-amber">
                  <span>Discount Applied</span>
                  <span>-$2.00</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Delivery Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="pt-3 border-t border-border-light flex justify-between font-headline-sm text-headline-sm text-on-background mt-3">
                  <span>Total Bid</span>
                  <span>$23.70</span>
                </div>
              </div>
            </div>

            {/* Patient Request Context Card */}
            <div className="bg-surface-gray border border-border-light rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[64px]" data-icon="description">description</span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface-variant uppercase mb-3 relative z-10">Original Request</h3>
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant" data-icon="person">person</span>
                  <span className="font-body-md text-body-md text-on-surface">Patient: <span className="font-medium">J. D.</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant" data-icon="calendar_today">calendar_today</span>
                  <span className="font-body-md text-body-md text-on-surface">Requested: <span className="font-medium">Oct 24, 2023</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant" data-icon="map">map</span>
                  <span className="font-body-md text-body-md text-on-surface">Distance: <span className="font-medium">1.2 miles</span></span>
                </div>
              </div>
            </div>

            {/* Logistics & Notes Card */}
            <div className="bg-surface border border-border-light rounded-xl p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-background mb-4">Logistics &amp; Notes</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[18px]" data-icon="local_shipping">local_shipping</span>
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Estimated Delivery Time</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">45 Minutes</div>
                  </div>
                </div>
                <div className="p-4 bg-surface-gray rounded-lg border border-border-light">
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]" data-icon="note">note</span>
                    Pharmacy Notes
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface italic">"Generic alternatives provided for better pricing. Ready for immediate dispatch upon acceptance."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
