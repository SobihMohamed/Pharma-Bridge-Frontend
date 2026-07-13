import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Phone, Mail, Clock, MapPin, Star, 
  Award, ShieldCheck, Edit3, Map, CheckCircle2, 
  AlertCircle, Activity, Globe, HeartHandshake, Eye
} from 'lucide-react';
import { useMyPharmacyProfileQuery } from '../hooks/usePharmacyProfile';
import UpdatePharmacyForm from '../components/UpdatePharmacyForm';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { data: profile, isLoading, isError } = useMyPharmacyProfileQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full border-[3px] border-slate-200 dark:border-slate-800 animate-spin"
            style={{ borderTopColor: '#0284c7' }}
          />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-6">
        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-450" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile not found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">We encountered an issue loading your pharmacy profile. Please try registering or contact support.</p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
    }
  };

  return (
    <div 
      className="p-margin-mobile md:p-gutter max-w-container-max mx-auto w-full pb-24"
      style={{ paddingTop: '32px' }}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-150 dark:border-slate-800/80 p-6 md:p-8 shadow-sm"
          >
            <UpdatePharmacyForm 
              initialData={profile} 
              onCancel={() => setIsEditing(false)} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="profile-view"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header Section */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                  <Building2 className="w-7 h-7 text-sky-600 dark:text-sky-400" />
                  Pharmacy Profile
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                  Manage your pharmacy details, storefront branding, and operations.
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto font-bold text-xs h-10 px-5 rounded-xl shadow-sm transition-all"
                style={{ background: 'linear-gradient(135deg,#0284c7,#0369a1)', color: '#fff' }}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              
              {/* Main Info Card (Col Span 8) */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden"
              >
                {/* Thin top accent */}
                <div style={{ height: '3.5px', background: 'linear-gradient(90deg, #0ea5e9, #6366f1)' }} />
                
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-6 mb-6">
                    <div className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900">
                      <img 
                        alt="Pharmacy Storefront" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=300"
                      />
                      <div className="absolute inset-0 bg-black/5 dark:bg-black/25" />
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white truncate">
                          {profile.pharmacyName}
                        </h2>
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide shrink-0"
                          style={profile.isApproved 
                            ? { backgroundColor: '#ecfdf5', color: '#065f46' }
                            : { backgroundColor: '#fffbeb', color: '#92400e' }
                          }
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full mr-1.5"
                            style={{ backgroundColor: profile.isApproved ? '#059669' : '#d97706' }}
                          />
                          {profile.status}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3.5 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                        {profile.area}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1.5" style={{ color: '#ea580c' }}>
                          <Star className="w-4.5 h-4.5 fill-current" />
                          <span className="text-slate-800 dark:text-slate-200">4.8</span>
                          <span className="text-slate-400 dark:text-slate-500 font-semibold">(124 Reviews)</span>
                        </div>
                        <div className="hidden sm:block h-3.5 w-px bg-slate-200 dark:bg-slate-700" />
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                          <span className="text-slate-800 dark:text-slate-200">1,432</span>
                          <span className="text-slate-400 dark:text-slate-500 font-semibold">Orders Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">License Number</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.licenseNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Contact Phone</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.contactPhone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Street Address</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{profile.textAddress}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Operating Hours</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {profile.is24Hours ? 'Open 24 Hours' : `${profile.openTime.slice(0, 5)} - ${profile.closeTime.slice(0, 5)}`}
                      </p>
                    </div>
                  </div>

                  {/* License Image View */}
                  {profile.licenseImageUrl && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3.5">Verified License Document</p>
                      <a 
                        href={profile.licenseImageUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors shadow-sm bg-white dark:bg-slate-900"
                      >
                        <Eye className="w-4 h-4" />
                        View Uploaded License File
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Location Map Card (Col Span 4) */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden flex flex-col"
              >
                {/* Thin top accent */}
                <div style={{ height: '3.5px', background: 'linear-gradient(90deg, #6366f1, #a855f7)' }} />

                <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#eef2ff', border: '1px solid #e0e7ff' }}
                  >
                    <Map className="w-4.5 h-4.5" style={{ color: '#6366f1' }} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Registered Location</h3>
                </div>

                <div className="flex-1 relative min-h-[220px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                  {/* Digital styled grid background placeholder for maps */}
                  <div className="absolute inset-0 opacity-10 dark:opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                  <div className="relative text-center p-6 space-y-3 z-10">
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center mx-auto shadow-md"
                      style={{ backgroundColor: '#f0fdf4', color: '#16a34a', boxShadow: '0 4px 12px rgba(22,163,74,0.15)' }}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Map Coordinates</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                        Lat: {profile.latitude?.toFixed(5) || '0.00'} / Lng: {profile.longitude?.toFixed(5) || '0.00'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-800/80">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                    {profile.textAddress || 'No street address registered.'}
                  </p>
                </div>
              </motion.div>

              {/* Quick Stats / Secondary Info (Full Width) */}
              <motion.div 
                variants={itemVariants}
                className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#fdf2f8', border: '1px solid #fce7f3' }}
                  >
                    <Globe className="w-6 h-6" style={{ color: '#db2777' }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Service Radius</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">5 Miles</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1' }}
                  >
                    <Activity className="w-6 h-6" style={{ color: '#0d9488' }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Avg Response Time</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">12 mins</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#ecfdf5', border: '1px solid #d1fae5' }}
                  >
                    <ShieldCheck className="w-6 h-6" style={{ color: '#059669' }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Verification Status</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">Fully Verified</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
