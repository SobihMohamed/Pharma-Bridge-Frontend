import React, { useState } from 'react';
import { FileText, Filter } from 'lucide-react';
import { MOCK_REQUESTS } from '../data/mockRequests';
import RequestCard from '../components/RequestCard';

type FilterType = 'All' | 'Active' | 'Completed' | 'Cancelled';

export default function RequestsPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredRequests = MOCK_REQUESTS.filter(req => {
    if (filter === 'All') return true;
    if (filter === 'Active') return req.status === 'Pending' || req.status === 'Bidding';
    if (filter === 'Completed') return req.status === 'Completed';
    if (filter === 'Cancelled') return req.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-sm text-gray-500">Track your prescription requests and pharmacy offers.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {(['All', 'Active', 'Completed', 'Cancelled'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-gray-900 text-white' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No requests found</h3>
          <p className="text-gray-500 text-sm">
            {filter !== 'All' 
              ? `You don't have any ${filter.toLowerCase()} requests.`
              : "You haven't made any prescription requests yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      )}
    </div>
  );
}
