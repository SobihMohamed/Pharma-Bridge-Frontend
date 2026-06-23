import React, { useState } from 'react';
import { Package } from 'lucide-react';
import { MOCK_ORDERS } from '../data/mockOrders';
import OrderCard from '../components/OrderCard';

type FilterType = 'All' | 'Active' | 'Completed' | 'Cancelled';

export default function OrdersPage() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filteredOrders = MOCK_ORDERS.filter(order => {
    if (filter === 'All') return true;
    if (filter === 'Active') return order.status === 'Preparing' || order.status === 'OutForDelivery';
    if (filter === 'Completed') return order.status === 'Delivered';
    if (filter === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">Track and manage your active and past pharmacy orders.</p>
        </div>
      </div>

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

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500 text-sm">
            {filter !== 'All' 
              ? `You don't have any ${filter.toLowerCase()} orders.`
              : "You haven't placed any orders yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
