import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Sliders, ShieldCheck } from 'lucide-react';
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
    <div 
      className="w-full max-w-5xl mx-auto space-y-8 p-6 md:p-10 pb-24"
      style={{ paddingTop: '32px' }}
    >
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-3"
      >
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sky-50 dark:bg-sky-950/20 border border-sky-200/30 dark:border-sky-900/30"
        >
          <Sliders className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">Manage your personal profile, credentials, and pharmacy registration details.</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full flex flex-col" onValueChange={handleTabChange}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <TabsList className="flex w-full justify-start border-b border-slate-100 dark:border-slate-800 bg-transparent p-0 mb-8 rounded-none">
            <TabsTrigger 
              value="profile" 
              className="flex items-center gap-2 font-bold pb-3 pt-2 px-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 transition-all text-xs cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-700 hover:-translate-y-[1px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-600 dark:data-[state=active]:border-sky-400 data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400"
            >
              <User className="w-4 h-4" />
              Personal Profile
            </TabsTrigger>
            <TabsTrigger 
              value="pharmacy" 
              className="flex items-center gap-2 font-bold pb-3 pt-2 px-4 border-b-2 border-transparent text-slate-500 dark:text-slate-400 transition-all text-xs cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-300 dark:hover:border-sky-700 hover:-translate-y-[1px] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-sky-600 dark:data-[state=active]:border-sky-400 data-[state=active]:text-sky-600 dark:data-[state=active]:text-sky-400"
            >
              <Building2 className="w-4 h-4" />
              Pharmacy Registration
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="profile" className="animate-in fade-in zoom-in-98 duration-300 w-full outline-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 md:p-8 shadow-sm overflow-hidden"
          >
            {/* Thin top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500" />
            <OwnerProfileForm />
          </motion.div>
        </TabsContent>

        <TabsContent value="pharmacy" className="animate-in fade-in zoom-in-98 duration-300 w-full outline-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30"
              >
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white">Pharmacy Verification Details</h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Manage your pharmacy credentials and operational settings.</p>
              </div>
            </div>
            <div className="p-6">
              <PharmacyRegGuard />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
