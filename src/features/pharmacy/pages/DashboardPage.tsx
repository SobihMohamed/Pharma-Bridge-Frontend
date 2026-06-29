import React, { useState } from 'react';
import { User, Building2 } from 'lucide-react';
import OwnerProfileForm from '../components/OwnerProfileForm';
import PharmacyRegGuard from '../components/PharmacyRegGuard';

type TabKey = 'profile' | 'pharmacy';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pharmacy Owner Dashboard</h1>
        <p className="text-gray-500">Manage your personal profile and pharmacy registration.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === 'profile'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-4 h-4" />
            Personal Profile
          </button>
          <button
            onClick={() => setActiveTab('pharmacy')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === 'pharmacy'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Pharmacy Registration
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'profile' && <OwnerProfileForm />}
        {activeTab === 'pharmacy' && <PharmacyRegGuard />}
      </div>
    </div>
  );
}
