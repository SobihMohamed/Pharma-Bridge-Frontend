import { Clock, Store } from 'lucide-react';
import { BidDto } from '../types';
import BidCard from './BidCard';

interface BidsListProps {
  bids: BidDto[];
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
}

export default function BidsList({ bids, onAccept, onReject }: BidsListProps) {
  if (bids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Waiting for Offers</h3>
        <p className="text-gray-500 text-center max-w-sm text-sm">
          Pharmacies are currently reviewing your request. Offers will appear here shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-gray-500" />
          Received Offers
        </h2>
        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full">
          {bids.length} {bids.length === 1 ? 'Offer' : 'Offers'}
        </span>
      </div>
      
      {bids.map((bid) => (
        <BidCard 
          key={bid.id} 
          bid={bid} 
          onAccept={onAccept} 
          onReject={onReject} 
        />
      ))}
    </div>
  );
}
