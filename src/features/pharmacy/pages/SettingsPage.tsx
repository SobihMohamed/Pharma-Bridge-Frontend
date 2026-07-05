import React from 'react';
import { User, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnerProfileForm from '../components/OwnerProfileForm';
import PharmacyRegGuard from '../components/PharmacyRegGuard';
import { useQueryClient } from '@tanstack/react-query';

export default function SettingsPage() {
  const queryClient = useQueryClient();

  const handleTabChange = (value: string) => {
    if (value === 'pharmacy') {
      // Force React Query to make a fresh network request when the tab is clicked
      queryClient.invalidateQueries({ queryKey: ['myPharmacyProfile'] });
    }
  };
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 p-6 md:p-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Account & Pharmacy Setup</h1>
        <p className="text-gray-500">Manage your personal profile, identification, and pharmacy registration details.</p>
      </div>
      
      <div className="h-px w-full bg-slate-200 my-6" />

      <Tabs defaultValue="profile" className="w-full flex flex-col" onValueChange={handleTabChange}>
        <TabsList className="flex w-full justify-start border-b border-slate-200 bg-transparent p-0 mb-8 rounded-none">
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-2 font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 rounded-none pb-3 pt-2 border-b-2 border-transparent px-4"
          >
            <User className="w-4 h-4" />
            Personal Profile
          </TabsTrigger>
          <TabsTrigger 
            value="pharmacy" 
            className="flex items-center gap-2 font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-teal-600 rounded-none pb-3 pt-2 border-b-2 border-transparent px-4"
          >
            <Building2 className="w-4 h-4" />
            Pharmacy Registration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="animate-in fade-in zoom-in-95 duration-200 w-full">
          <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <OwnerProfileForm />
          </div>
        </TabsContent>

        <TabsContent value="pharmacy" className="animate-in fade-in zoom-in-95 duration-200 w-full">
          <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">Pharmacy Registration</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your pharmacy credentials and operational details.</p>
            </div>
            <div className="p-6">
              <PharmacyRegGuard />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
