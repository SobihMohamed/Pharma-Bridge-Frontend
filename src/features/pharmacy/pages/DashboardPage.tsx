import React from 'react';
import { Activity, TrendingUp, Users, Package } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { name: 'Active Bids', value: '12', icon: Activity, change: '+2.5%', changeType: 'positive' },
    { name: 'Revenue', value: '4,200 EGP', icon: TrendingUp, change: '+12.3%', changeType: 'positive' },
    { name: 'New Patients', value: '4', icon: Users, change: '-1.0%', changeType: 'negative' },
    { name: 'Completed Orders', value: '89', icon: Package, change: '+5.4%', changeType: 'positive' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Pharmacy Dashboard</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Overview of your pharmacy's performance and active metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{stat.name}</p>
                <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-full flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className={`font-medium ${stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change}
              </span>
              <span className="text-gray-400 dark:text-slate-500 ml-2">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-center items-center h-96 text-center">
          <TrendingUp className="w-12 h-12 text-gray-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-sm">
            Revenue charts and analytics will appear here once you start processing more orders.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-center items-center h-96 text-center">
          <Activity className="w-12 h-12 text-gray-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-sm">
            A real-time feed of accepted bids and deliveries will be logged here.
          </p>
        </div>
      </div>
    </div>
  );
}
