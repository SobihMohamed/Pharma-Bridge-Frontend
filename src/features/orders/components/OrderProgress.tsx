import { CheckCircle2, Clock, Package, Truck, XCircle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderProgressProps {
  status: OrderStatus;
}

export default function OrderProgress({ status }: OrderProgressProps) {
  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-center gap-4">
        <XCircle className="w-10 h-10 text-red-500 shrink-0" />
        <div>
          <h3 className="text-lg font-bold text-red-800 mb-1">Order Cancelled</h3>
          <p className="text-sm text-red-600">This order has been cancelled and will not be delivered.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'Preparing', label: 'Preparing', icon: Package },
    { key: 'OutForDelivery', label: 'Out for Delivery', icon: Truck },
    { key: 'Delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status);
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status</h3>
      
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-gray-100 rounded-full hidden sm:block">
          <div 
            className="h-full bg-teal-500 rounded-full transition-all duration-500"
            style={{ 
              width: currentStepIndex === 0 ? '0%' : currentStepIndex === 1 ? '50%' : '100%' 
            }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-6 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex;
            
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex sm:flex-col items-center gap-4 sm:gap-3 flex-1 relative">
                {/* Mobile vertical line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-10 left-5 bottom-[-24px] w-0.5 bg-gray-100 sm:hidden">
                    <div 
                      className="w-full bg-teal-500 transition-all duration-500"
                      style={{ height: isCompleted ? '100%' : '0%' }}
                    />
                  </div>
                )}

                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-colors z-10
                    ${isCompleted ? 'border-teal-500 text-teal-600' : ''}
                    ${isCurrent ? 'border-teal-600 bg-teal-50 text-teal-700 ring-4 ring-teal-50' : ''}
                    ${isPending ? 'border-gray-200 text-gray-400' : ''}
                  `}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="sm:text-center">
                  <h4 className={`text-sm font-bold ${isPending ? 'text-gray-500' : 'text-gray-900'}`}>
                    {step.label}
                  </h4>
                  {isCurrent && status === 'OutForDelivery' && (
                    <p className="text-xs text-teal-600 font-medium flex items-center gap-1 mt-1 sm:justify-center">
                      <Clock className="w-3 h-3" /> Arriving soon
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
