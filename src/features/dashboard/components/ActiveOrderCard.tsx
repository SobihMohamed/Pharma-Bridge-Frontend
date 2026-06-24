import { Package, Truck, MapPin, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActiveOrderCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-2 text-teal-700">
          <Package className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Active Order</h2>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <Truck className="w-3 h-3" />
          Out for Delivery
        </span>
      </div>
      
      <div className="p-5 flex-grow flex flex-col justify-center">
        <div className="flex items-center gap-1 mb-2 text-sm text-gray-500 font-mono">
          <span>ORD-9912</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-gray-700">
            <MapPin className="w-3 h-3" /> City Health Pharmacy
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Lisinopril 250mg</h3>
        
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Estimated Delivery Time</p>
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            Today by 5:00 PM
          </p>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-100 mt-auto">
        <Link 
          to="/orders/ORD-9912" 
          className="flex items-center justify-center gap-1 text-teal-600 font-medium hover:text-teal-700 transition-colors w-full"
        >
          Track Order
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
