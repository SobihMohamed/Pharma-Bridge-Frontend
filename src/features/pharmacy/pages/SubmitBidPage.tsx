import React from 'react';

export default function SubmitBidPage() {
  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-2 text-on-surface-variant mb-2">
            <a className="hover:text-primary font-body-sm text-body-sm flex items-center gap-1 cursor-pointer">
              <span className="material-symbols-outlined text-sm" data-icon="arrow_back">arrow_back</span>
              Back to Requests
            </a>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Submit Bid <span className="text-on-surface-variant font-normal">| Request #REQ-8492</span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Provide pricing and delivery details for the requested items.</p>
        </div>

        {/* Dynamic Form Layout */}
        <form className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Items Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface rounded-xl border border-border-light p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Requested Items</h2>
                <button className="text-primary hover:text-primary-container font-label-md text-label-md flex items-center gap-1 transition-colors" type="button">
                  <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                  Add Item
                </button>
              </div>

              {/* Data Table High Density */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-light">
                      <th className="pb-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-2/5">Item Name</th>
                      <th className="pb-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-1/5">Qty</th>
                      <th className="pb-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-1/5">Unit Price ($)</th>
                      <th className="pb-3 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-center w-1/5">Alternative</th>
                      <th className="pb-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-light hover:bg-surface-gray/50 transition-colors">
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3" type="text" defaultValue="Amoxicillin 500mg Capsules"/>
                      </td>
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" type="number" defaultValue="100"/>
                      </td>
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" step="0.01" type="number" defaultValue="0.45"/>
                      </td>
                      <td className="py-3 text-center">
                        <input className="rounded border-border-light text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-on-surface-variant hover:text-status-red transition-colors" type="button">
                          <span className="material-symbols-outlined" data-icon="delete">delete</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-border-light hover:bg-surface-gray/50 transition-colors">
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3" type="text" defaultValue="Ibuprofen 400mg Tablets"/>
                      </td>
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" type="number" defaultValue="50"/>
                      </td>
                      <td className="py-3 pr-4">
                        <input className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" step="0.01" type="number" defaultValue="0.12"/>
                      </td>
                      <td className="py-3 text-center">
                        <input className="rounded border-border-light text-primary focus:ring-primary w-4 h-4" type="checkbox"/>
                      </td>
                      <td className="py-3 text-right">
                        <button className="text-on-surface-variant hover:text-status-red transition-colors" type="button">
                          <span className="material-symbols-outlined" data-icon="delete">delete</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-surface rounded-xl border border-border-light p-6">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Additional Notes</h2>
              <textarea className="w-full border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary p-3 resize-y" placeholder="Add any specific conditions, generic alternatives offered, or comments regarding availability..." rows={4}></textarea>
            </div>
          </div>

          {/* Right Column: Summary & Actions */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface rounded-xl border border-border-light p-6 sticky top-24">
              <h2 className="font-headline-sm text-headline-sm text-on-surface mb-6 border-b border-border-light pb-4">Bid Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-body-md text-body-md font-medium text-on-surface">$51.00</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-body-md text-body-md text-on-surface-variant w-1/2">Discount ($)</label>
                  <input className="w-1/2 border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" step="0.01" type="number" defaultValue="0.00"/>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-body-md text-body-md text-on-surface-variant w-1/2">Delivery Fee ($)</label>
                  <input className="w-1/2 border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" step="0.01" type="number" defaultValue="5.00"/>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-border-light">
                  <span className="font-body-lg text-body-lg font-bold text-on-surface">Total Bid</span>
                  <span className="font-body-lg text-body-lg font-bold text-primary ml-auto">$56.00</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h3 className="font-label-sm text-label-sm uppercase text-on-surface-variant tracking-wider">Logistics</h3>
                <div className="flex items-center gap-3">
                  <label className="font-body-md text-body-md text-on-surface-variant w-1/2">Est. Delivery (Mins)</label>
                  <input className="w-1/2 border-border-light rounded-md font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary h-9 px-3 text-right" type="number" defaultValue="45"/>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-surface-tint text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2" type="button">
                  <span className="material-symbols-outlined text-sm" data-icon="send">send</span>
                  Submit Bid
                </button>
                <button className="w-full bg-transparent border border-border-light hover:bg-surface-gray text-on-surface-variant font-label-md text-label-md py-3 px-4 rounded-lg transition-colors" type="button">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
