import React from 'react';

export default function ProfilePage() {
  return (
    <div className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Pharmacy Profile</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your pharmacy details and operational status.</p>
        </div>
        <button className="bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-md text-label-md px-6 py-2.5 rounded flex items-center justify-center gap-2 shadow-sm w-full md:w-auto">
          <span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
          Edit Profile
        </button>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Info Card (Col Span 8) */}
        <div className="md:col-span-8 bg-surface-container-lowest border border-border-light rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-border-light pb-6 mb-6">
            <img alt="Pharmacy Storefront" className="w-24 h-24 rounded-lg object-cover border border-border-light" data-alt="A clean, high-resolution exterior photo of a modern pharmacy storefront during the daytime. The signage is sleek and professional. The lighting is bright, creating a welcoming, sterile, yet friendly corporate medical environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGoTMlPrOPJVzZ4gorc89iPylRRhKfKXNlbSk14an7GkIuTTf95yp1azGo7CE8LyCeG9U9OC0Cg3_3McAbl5gI5onbhhHfUBZsfYXNBzwXJ4Xuo84We-WvEwoLbDkbB63EoRk18x9z1r7gzGLC56PMBRcc6sorvOSC5FBEKV_Q9TOP953fgXo3InF2jbFmQt69FR6XsdsTiAyg19xA4r7H8LLZ7Mdc4eA5Veqbe2Qg7Bu3IC4SEk5bmpaM25YDub607PGhl4Y0Gxc"/>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">MediCare Plus Pharmacy</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-container/20 text-primary font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-primary mr-1.5"></span>
                  Active
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary" data-icon="location_city">location_city</span>
                Downtown Medical District
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-status-amber">
                  <span className="material-symbols-outlined text-[18px]" data-icon="star" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-md text-label-md text-on-surface">4.8</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">(124 Reviews)</span>
                </div>
                <div className="hidden sm:block h-4 w-px bg-border-light"></div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-secondary" data-icon="check_circle">check_circle</span>
                  <span className="font-label-md text-label-md text-on-surface">1,432</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Orders Completed</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-1">License Number</p>
              <p className="font-body-md text-body-md text-on-surface font-medium">PHB-88392-XT</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-1">Contact Phone</p>
              <p className="font-body-md text-body-md text-on-surface font-medium">+1 (555) 867-5309</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-1">Email Address</p>
              <p className="font-body-md text-body-md text-on-surface font-medium">admin@medicareplus.com</p>
            </div>
            <div>
              <p className="font-label-sm text-label-sm uppercase text-on-surface-variant mb-1">Operating Hours</p>
              <p className="font-body-md text-body-md text-on-surface font-medium">Mon-Sat: 8:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Location Map Card (Col Span 4) */}
        <div className="md:col-span-4 bg-surface-container-lowest border border-border-light rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-border-light bg-surface-gray">
            <h3 className="font-label-md text-label-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" data-icon="map">map</span>
              Registered Location
            </h3>
          </div>
          <div className="flex-1 relative min-h-[200px]">
            <img alt="Map Location" className="absolute inset-0 w-full h-full object-cover" data-alt="A stylized, clean digital map view showing a specific location pin in a downtown grid. The map uses a light-mode color scheme with subtle blues, grays, and a prominent emerald green pin marker to match the brand aesthetic." data-location="New York" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnAwnStdapB56PCZYciHEnkPbfoYj6niJ1keqXaHRBgqA14fMT1jnOEPd4LPuA-NvJy16_fatGuFcJrDtGhcNpz9jYf8mqXIJcNnHHqIERLuWYJYrPvg0pCiK3wPqOfeF7TAzWUDin6LRHRpNmJ0BQEnr7B-RjocKtXfyGnCNW4HcQSxTAg1VEBf9lwUx5tPQyNsu6IssOVtCu-pLaZQ41ACrGPHWnpYFnC11vyXOBeYxhKaR1i0Qk65InWTM-4o9BQjir0KriQnQ"/>
          </div>
          <div className="p-4 bg-surface-gray border-t border-border-light">
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              1200 Healthway Drive, Suite 100<br/>
              Medical District, Metropolis 90210
            </p>
          </div>
        </div>

        {/* Quick Stats / Secondary Info (Full Width) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          <div className="bg-surface-container-lowest border border-border-light rounded-lg p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined" data-icon="local_shipping">local_shipping</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Delivery Radius</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">5 Miles</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-border-light rounded-lg p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined" data-icon="timer">timer</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Avg Response Time</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">12 mins</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-border-light rounded-lg p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
            </div>
            <div>
              <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Verification Status</p>
              <p className="font-headline-sm text-headline-sm text-on-surface">Fully Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
