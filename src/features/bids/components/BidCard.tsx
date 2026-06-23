import { Star, Clock, Check, X, ShieldCheck } from 'lucide-react';
import { BidDto } from '../types';

interface BidCardProps {
  bid: BidDto;
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
}

export default function BidCard({ bid, onAccept, onReject }: BidCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5 flex justify-between items-start border-b border-gray-100 bg-gray-50/50">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {bid.pharmacyName}
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </h3>
          <div className="flex items-center gap-1 mt-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(bid.rating) ? 'fill-current text-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
            <span className="text-sm text-gray-600 ms-1 font-medium">{bid.rating}</span>
          </div>
        </div>
        <div className="text-end">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Offer</p>
          <p className="text-2xl font-bold text-teal-600">{bid.totalPrice.toFixed(2)} EGP</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg inline-flex">
          <Clock className="w-4 h-4" />
          <span className="font-medium">Estimated Delivery: {bid.deliveryTime}</span>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items in Offer</h4>
          <ul className="space-y-2">
            {bid.items.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 font-medium">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-900 font-semibold">{item.price.toFixed(2)} EGP</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {bid.status === 'Pending' && (
        <div className="p-5 border-t border-gray-100 flex gap-3 bg-gray-50">
          <button 
            onClick={() => onReject(bid.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 hover:text-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button 
            onClick={() => onAccept(bid.id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 shadow-sm transition-colors"
          >
            <Check className="w-4 h-4" />
            Accept Offer
          </button>
        </div>
      )}
    </div>
  );
}
