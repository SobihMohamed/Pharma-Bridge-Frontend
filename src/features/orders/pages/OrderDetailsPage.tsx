import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, Receipt, Star, AlertCircle } from 'lucide-react';
import { MOCK_ORDERS } from '../data/mockOrders';
import { OrderDto } from '../types';

import { formatLocalDateTime } from '@/utils/formatTime';
import OrderProgress from '../components/OrderProgress';
import RatePharmacyModal from '../components/RatePharmacyModal';
import CreateComplaintModal from '../components/CreateComplaintModal';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const fetchOrder = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); // fake delay
      
      const found = MOCK_ORDERS.find(o => o.id === id);
      setOrder(found || null);
      setIsLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="text-teal-600 hover:underline mt-4 font-medium">
          Go back to your orders
        </button>
      </div>
    );
  }

  const isDelivered = order.status === 'Delivered';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/orders')}
            className="p-2 text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.split('_')[1]}</h1>
            <p className="text-sm text-gray-500">Placed on {formatLocalDateTime(order.createdAt)}</p>
          </div>
        </div>
        
        {/* Post-order Actions (Visible when delivered or cancelled) */}
        {isDelivered && (
          <div className="hidden sm:flex items-center gap-3">
            {!order.hasComplaint && (
              <button 
                onClick={() => setIsComplaintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              >
                <AlertCircle className="w-4 h-4" />
                Report Issue
              </button>
            )}
            {!order.hasRating && (
              <button 
                onClick={() => setIsRatingModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors border border-yellow-200"
              >
                <Star className="w-4 h-4" />
                Rate Order
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Tracker */}
      <OrderProgress status={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details (Left/Top) */}
        <div className="md:col-span-2 space-y-6">
          {/* Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-bold text-gray-900">Order Items</h2>
            </div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="font-bold text-gray-900">
                    {item.price.toFixed(2)} EGP
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pharmacy & Delivery Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Fulfilled By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Store className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{order.pharmacyName}</p>
                  <p className="text-sm text-gray-500">{order.pharmacyPhone || 'No phone provided'}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Delivery Address</h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Saved Address ID: {order.deliveryAddressId}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    (In a real app, this would show the full formatted address)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right/Bottom) - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">Payment Summary</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">{order.subtotal.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-900">{order.deliveryFee.toFixed(2)} EGP</span>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-xl font-black text-teal-600">{order.totalAmount.toFixed(2)} EGP</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 text-end">Paid via Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Post-order Actions Floating Bar */}
      {isDelivered && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:hidden z-40 flex gap-3">
          {!order.hasComplaint && (
            <button 
              onClick={() => setIsComplaintModalOpen(true)}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
            >
              <AlertCircle className="w-4 h-4" />
              Report
            </button>
          )}
          {!order.hasRating && (
            <button 
              onClick={() => setIsRatingModalOpen(true)}
              className="flex-1 flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors"
            >
              <Star className="w-4 h-4" />
              Rate Order
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <RatePharmacyModal 
        orderId={order.id}
        pharmacyName={order.pharmacyName}
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        onSubmitSuccess={() => {
          setOrder({ ...order, hasRating: true });
        }}
      />

      <CreateComplaintModal 
        orderId={order.id}
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        onSubmitSuccess={() => {
          setOrder({ ...order, hasComplaint: true });
        }}
      />
    </div>
  );
}
