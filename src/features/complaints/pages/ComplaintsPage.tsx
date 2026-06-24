import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { MOCK_COMPLAINTS } from '../data/mockComplaints';
import ComplaintCard from '../components/ComplaintCard';
import { ComplaintStatus } from '../types';

type FilterType = 'All' | ComplaintStatus;

export default function ComplaintsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredComplaints = MOCK_COMPLAINTS.filter(cmp => {
    if (filter === 'All') return true;
    return cmp.status === filter;
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-500">Track the status of your reported issues and admin replies</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['All', 'Pending', 'InProgress', 'Resolved'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'InProgress' ? 'In Progress' : f}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredComplaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No complaints found</h3>
          <p className="text-gray-500 text-sm">
            {filter !== 'All' 
              ? `You don't have any ${filter === 'InProgress' ? 'in progress' : filter.toLowerCase()} complaints.`
              : "You haven't submitted any complaints yet. We hope everything is going well!"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((cmp) => (
            <ComplaintCard key={cmp.id} complaint={cmp} />
          ))}
        </div>
      )}
    </div>
  );
}
