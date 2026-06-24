import React from 'react';

export default function RegistrationPage() {
  return (
    <div className="bg-surface-gray min-h-screen antialiased text-on-surface pb-12">
      {/* Navbar for Registration */}
      <nav className="bg-surface border-b border-border-light flex justify-between items-center h-16 px-6 w-full fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_pharmacy</span>
          <span className="font-display-lg text-display-lg font-black text-primary tracking-tight">PHARMABRIDGE</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-body-md text-body-md text-on-surface-variant hidden sm:block">Sarah Jenkins</span>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-border-light">
              <img 
                alt="User profile photo of Sarah Jenkins" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKUd5xHTp40cDls_5a-7LlUGFVldz645T1AatFqc4mlekqO6dWP1HjgkQVpw5MGV-bJFpPAUMDv_Bbpdoci2tlG4JpqSgUFArUuAeKwvZgwbdc69VWMEvfnEY-dC93D0Yvdg70KZEAFpQzqapqgDnU_URVaomUvyxOPO43hRYirUoRxJJGV8L-JbPOwKz99h1BHvrCVgSrxkvmBGII6rc21dzc82x0KAoiTfK0fPlEEJk_QqCdRe0c36ek-WJf75in02tm_Nvs7bw"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto pt-28 px-margin-mobile md:px-0">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Pharmacy Registration</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Join PharmaBridge to manage your bids, orders, and nearby requests efficiently.</p>
        </div>

        {/* Form Container */}
        <div className="bg-surface rounded-xl border border-border-light p-8 shadow-sm">
          <form className="space-y-8" action="#" method="POST">
            {/* Section: Basic Information */}
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-border-light pb-2 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pharmacy Name */}
                <div className="col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="pharmacyName">PHARMACY NAME</label>
                  <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="pharmacyName" name="pharmacyName" placeholder="e.g., City Center Pharmacy" type="text"/>
                </div>
                {/* License Number */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="licenseNumber">LICENSE NUMBER</label>
                  <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="licenseNumber" name="licenseNumber" placeholder="e.g., L-12345678" type="text"/>
                </div>
                {/* Contact Phone */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="contactPhone">CONTACT PHONE</label>
                  <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="contactPhone" name="contactPhone" placeholder="e.g., +1 (555) 123-4567" type="tel"/>
                </div>
                {/* License Image Dropzone */}
                <div className="col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2">LICENSE DOCUMENT</label>
                  <div className="border-2 border-dashed border-border-light rounded-xl p-8 text-center bg-surface-gray hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-outline text-[48px] mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
                    <p className="font-headline-sm text-headline-sm text-on-surface mb-1">Drag and drop your license here</p>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">or click to browse from your computer</p>
                    <button className="bg-surface-lowest border border-border-light text-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:bg-surface-dim transition-colors" type="button">BROWSE FILES</button>
                    <p className="font-body-sm text-body-sm text-outline mt-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Location & Operations */}
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface border-b border-border-light pb-2 mb-6 mt-8">Location &amp; Operations</h2>
              <div className="space-y-6">
                {/* Location Selection (Map Area) */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-2">PIN LOCATION</label>
                  <div className="h-64 w-full bg-surface-container rounded-xl overflow-hidden border border-border-light relative group cursor-pointer">
                    <img alt="Map Location Picker" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnZK7fh1OQuD5e92IW2pz-MPHvhiD0FtYrEbBLIAeyHVbSH4XPTBQhKwOfctLw11WXTJo9v96J7U9fNacSbirsIstBeYdqU6W8BQpQ0N43Qlp5lbUbLl84ZPrSgFW_57OYDgPjonWb8KogE5N1QDF8Eoc3dB25PB3jreXOgLQWHE-2mMn-X72kDGISd-2xK4uvNla_In-iw9OHKeWzgIxCnTmFKjNWWWimTXGzqboPeMyN4i6gi411lGWgpumAwEaDmxdxfHS-IEg"/>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-surface px-4 py-2 rounded-lg shadow-sm border border-border-light font-label-md text-label-md text-primary flex items-center gap-2" type="button">
                        <span className="material-symbols-outlined text-[18px]">location_searching</span>
                        UPDATE LOCATION
                      </button>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="material-symbols-outlined text-status-red text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text Address */}
                  <div className="col-span-2">
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="address">STREET ADDRESS</label>
                    <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="address" name="address" placeholder="123 Medical Plaza, Suite 100" type="text"/>
                  </div>
                  {/* Area/Region */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="area">SERVICE AREA</label>
                    <select className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236c7a71%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]" id="area" name="area" defaultValue="">
                      <option disabled value="">Select an area</option>
                      <option value="north">North District</option>
                      <option value="south">South District</option>
                      <option value="east">East District</option>
                      <option value="west">West District</option>
                      <option value="central">Central Business District</option>
                    </select>
                  </div>
                  {/* Operating Hours */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block font-label-md text-label-md text-on-surface-variant">OPERATING HOURS</label>
                      <div className="flex items-center gap-2">
                        <input className="rounded border-border-light text-primary focus:ring-primary bg-surface-lowest cursor-pointer" id="twentyFourHours" type="checkbox"/>
                        <label className="font-body-sm text-body-sm text-on-surface-variant cursor-pointer" htmlFor="twentyFourHours">24 Hours</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-full">
                        <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="openTime" name="openTime" type="time" defaultValue="08:00"/>
                      </div>
                      <span className="text-outline">to</span>
                      <div className="relative w-full">
                        <input className="w-full border border-border-light rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface-lowest" id="closeTime" name="closeTime" type="time" defaultValue="22:00"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Area */}
            <div className="pt-8 border-t border-border-light flex justify-end gap-4 items-center">
              <button className="px-6 py-3 rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-gray transition-colors border border-transparent" type="button">
                SAVE DRAFT
              </button>
              <button className="bg-primary-container text-on-primary px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm" type="submit">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                SUBMIT REGISTRATION
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
