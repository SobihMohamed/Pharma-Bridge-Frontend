import { Link } from 'react-router-dom';
import { Package, Clock, ChevronRight, Store, MapPin } from 'lucide-react';
import { OrderDto } from '../types';

interface OrderCardProps {
  order: OrderDto;
}

export default function OrderCard({ order }: OrderCardProps) {
  const statusColors = {
    Preparing: 'bg-yellow-100 text-yellow-800',
    OutForDelivery: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Order #{order.id.split('_')[1]}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[order.status]}`}>
            {order.status === 'OutForDelivery' ? 'On The Way' : order.status}
          </span>
        </div>

        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Store className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="font-medium">{order.pharmacyName}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-1">Delivering to Address ID: {order.deliveryAddressId}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="text-sm font-bold text-gray-900">
            {order.totalAmount.toFixed(2)} EGP
            <span className="text-xs text-gray-500 font-medium ms-1">
              ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
            </span>
          </div>

          <Link 
            to={`/orders/${order.id}`}
            className="inline-flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Track Order
            <ChevronRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
