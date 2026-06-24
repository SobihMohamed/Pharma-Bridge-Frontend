import React from 'react';

export default function OrderDetailsPage() {
  return (
    <div className="p-6 lg:p-gutter overflow-y-auto bg-background">
      <div className="max-w-container-max mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <a className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back to Orders
              </a>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface flex items-center gap-3">
              Order #ORD-2023-8942
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-status-amber/10 text-status-amber">
                Preparing
              </span>
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Placed on Oct 24, 2023 at 09:42 AM</p>
          </div>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:bg-surface-tint transition-colors shadow-sm flex items-center gap-2 w-full md:w-auto justify-center">
            <span className="material-symbols-outlined text-[18px]">update</span>
            Update Status
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Timeline & Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Timeline Card */}
            <div className="bg-surface rounded-xl border border-border-light p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                Tracking
              </h2>
              <div className="relative pl-4 space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-border-light before:to-transparent">
                {/* Step 1: Placed */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-primary text-on-primary shrink-0 absolute -left-7 md:mx-auto shadow z-10">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)]">
                    <div className="font-label-md text-label-md text-on-surface">Order Placed</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">09:42 AM</div>
                  </div>
                </div>
                {/* Step 2: Accepted */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-primary bg-primary text-on-primary shrink-0 absolute -left-7 md:mx-auto shadow z-10">
                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)]">
                    <div className="font-label-md text-label-md text-on-surface">Order Accepted</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">09:55 AM</div>
                  </div>
                </div>
                {/* Step 3: Preparing (Current) */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-status-amber bg-surface text-status-amber shrink-0 absolute -left-7 md:mx-auto shadow z-10">
                    <span className="material-symbols-outlined text-[12px] font-bold">hourglass_empty</span>
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)]">
                    <div className="font-label-md text-label-md text-primary">Preparing Items</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">Current Status</div>
                  </div>
                </div>
                {/* Step 4: Out for Delivery */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-border-light bg-surface text-border-light shrink-0 absolute -left-7 md:mx-auto shadow z-10"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)]">
                    <div className="font-label-md text-label-md text-on-surface-variant opacity-50">Out for Delivery</div>
                  </div>
                </div>
                {/* Step 5: Delivered */}
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-border-light bg-surface text-border-light shrink-0 absolute -left-7 md:mx-auto shadow z-10"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)]">
                    <div className="font-label-md text-label-md text-on-surface-variant opacity-50">Delivered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-surface rounded-xl border border-border-light p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Patient Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold">
                    MK
                  </div>
                  <div>
                    <div className="font-label-md text-label-md text-on-surface">Michael Kowalski</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant">+1 (555) 867-5309</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">DOB: 05/12/1980</div>
                  </div>
                </div>
                <hr className="border-border-light"/>
                <div>
                  <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Delivery Address</div>
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5">home</span>
                    <div className="font-body-md text-body-md text-on-surface">
                      1245 Evergreen Terrace<br/>
                      Apt 3B<br/>
                      Springfield, OR 97477
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items & Financials */}
          <div className="lg:col-span-2 space-y-6">
            {/* Itemized List Card */}
            <div className="bg-surface rounded-xl border border-border-light overflow-hidden">
              <div className="p-6 border-b border-border-light flex justify-between items-center bg-surface-gray">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">medication</span>
                  Prescription Items
                </h2>
                <span className="font-label-md text-label-md bg-surface-container px-3 py-1 rounded-full text-on-surface">3 Items</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="font-label-sm text-label-sm text-on-surface-variant uppercase p-4">Medication</th>
                      <th className="font-label-sm text-label-sm text-on-surface-variant uppercase p-4">Dosage</th>
                      <th className="font-label-sm text-label-sm text-on-surface-variant uppercase p-4 text-center">Qty</th>
                      <th className="font-label-sm text-label-sm text-on-surface-variant uppercase p-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    <tr className="hover:bg-surface-gray transition-colors group">
                      <td className="p-4">
                        <div className="font-body-md text-body-md font-semibold text-on-surface">Amoxicillin</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Capsules</div>
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">500mg</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-surface-container font-label-md text-label-md text-on-surface">30</span>
                      </td>
                      <td className="p-4 text-right font-label-md text-label-md text-on-surface">$12.50</td>
                    </tr>
                    <tr className="hover:bg-surface-gray transition-colors group">
                      <td className="p-4">
                        <div className="font-body-md text-body-md font-semibold text-on-surface">Lisinopril</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Tablets</div>
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">10mg</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-surface-container font-label-md text-label-md text-on-surface">90</span>
                      </td>
                      <td className="p-4 text-right font-label-md text-label-md text-on-surface">$8.00</td>
                    </tr>
                    <tr className="hover:bg-surface-gray transition-colors group">
                      <td className="p-4">
                        <div className="font-body-md text-body-md font-semibold text-on-surface">Atorvastatin</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Tablets</div>
                      </td>
                      <td className="p-4 font-body-md text-body-md text-on-surface">20mg</td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-surface-container font-label-md text-label-md text-on-surface">30</span>
                      </td>
                      <td className="p-4 text-right font-label-md text-label-md text-on-surface">$15.75</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-surface rounded-xl border border-border-light p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Financial Summary
              </h2>
              <div className="bg-surface-gray rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                  <span>Subtotal</span>
                  <span>$36.25</span>
                </div>
                <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                  <span>Delivery Fee</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between items-center font-body-md text-body-md text-on-surface">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
                <hr className="border-border-light"/>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface">Total</span>
                  <span className="font-headline-sm text-headline-sm text-primary">$41.24</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-on-surface-variant bg-surface-container/50 p-3 rounded-lg border border-border-light/50">
                <span className="material-symbols-outlined text-[20px] text-primary">verified</span>
                <span className="font-body-sm text-body-sm">Payment successfully processed via Credit Card ending in 4242.</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-surface-container-low rounded-xl border border-border-light p-6 border-dashed">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
                Pharmacy Notes
              </div>
              <p className="font-body-md text-body-md text-on-surface">
                Patient requested child-proof caps on all medications. Ensure delivery driver leaves package at the front door if no answer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
