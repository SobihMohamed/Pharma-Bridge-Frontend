import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MapPin, Receipt, AlertTriangle, 
  CreditCard, Package, Square, CheckCircle, AlertCircle
} from 'lucide-react';
import { useGetPharmacyOrderDetailsQuery, useUpdateOrderStatusMutation } from '../api/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

const STEPS = ['Accepted', 'Preparing', 'In Transit', 'Completed'];

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  
  const { data: order, isLoading, isError } = useGetPharmacyOrderDetailsQuery(orderId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatusMutation(orderId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-center py-20 space-y-4 bg-slate-50 min-h-screen">
        <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
        <p className="text-slate-500">The order you are looking for does not exist or you do not have permission to view it.</p>
        <Button onClick={() => navigate('/pharmacy/orders')} variant="outline" className="mt-4 border-slate-300">
          Back to Orders
        </Button>
      </div>
    );
  }

  const isCancelledOrReturned = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';
  const isTerminalState = isCancelledOrReturned || order.orderStatus === 'Completed' || order.orderStatus === 'Delivered';
  
  let displayStatus = order.orderStatus;
  if (displayStatus === 'Pending') displayStatus = 'Accepted';
  if (displayStatus === 'Delivered') displayStatus = 'Completed';
  if (displayStatus === 'InTransit') displayStatus = 'In Transit';
  const currentStepIndex = STEPS.indexOf(displayStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Accepted':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Accepted</Badge>;
      case 'Preparing':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Preparing</Badge>;
      case 'InTransit':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">In Transit</Badge>;
      case 'Completed':
      case 'Delivered':
        return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Completed</Badge>;
      case 'Cancelled':
      case 'Returned':
        return <Badge className="bg-rose-100 text-rose-800 border-rose-200">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  const isCashOnDelivery = order.paymentMethod?.toLowerCase().includes('cash');

  const handleAction = (status: string) => {
    updateStatus({ orderStatus: status });
  };

  const handleCancelOrder = () => {
    if (!cancelReason.trim()) return;
    updateStatus({ orderStatus: 'Cancelled', cancelReason: cancelReason.trim() }, {
      onSuccess: () => {
        setIsCancelModalOpen(false);
        setCancelReason('');
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/pharmacy/orders')} 
              className="rounded-full shadow-sm hover:bg-slate-100 shrink-0 bg-white mt-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order #{order.id}</h1>
                {getStatusBadge(order.orderStatus)}
              </div>
              <p className="text-sm text-slate-500 mt-1 font-medium">Received on {formatDate(order.createdAt)}</p>
            </div>
          </div>

          {/* Action Bar (Order Status Controller) */}
          {!isTerminalState && (
            <div className="flex flex-wrap items-center gap-3">
              {(displayStatus === 'Pending' || displayStatus === 'Accepted') && (
                <Button 
                  onClick={() => handleAction('Preparing')} 
                  disabled={isUpdating}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold"
                >
                  Start Preparing
                </Button>
              )}
              {displayStatus === 'Preparing' && (
                <Button 
                  onClick={() => handleAction('InTransit')} 
                  disabled={isUpdating}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Dispatch (In Transit)
                </Button>
              )}
              {displayStatus === 'In Transit' && (
                <Button 
                  onClick={() => handleAction('Completed')} 
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Mark as Completed
                </Button>
              )}
              
              <Button 
                variant="destructive" 
                onClick={() => setIsCancelModalOpen(true)}
                disabled={isUpdating}
                className="font-bold border-red-200"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </div>

        {/* Status Stepper or Alert */}
        {isCancelledOrReturned ? (
          <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 rounded-2xl shadow-sm">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-bold text-lg">Order {order.orderStatus}</AlertTitle>
            <AlertDescription className="mt-2 text-red-800 text-base">
              {order.cancelReason || "This order was cancelled."}
            </AlertDescription>
          </Alert>
        ) : (
          <Card className="rounded-2xl shadow-sm border-slate-200 bg-white overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-[80%] h-1 bg-slate-100 rounded-full z-0"></div>
                <div 
                  className="absolute left-[10%] top-1/2 -translate-y-1/2 h-1 bg-teal-500 rounded-full z-0 transition-all duration-500 ease-in-out" 
                  style={{ width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 80)}%` }}
                ></div>
                
                {STEPS.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  return (
                    <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm transition-colors duration-300 ${
                        isActive ? 'bg-teal-600 text-white shadow-teal-200' : 'bg-white text-slate-400 border-2 border-slate-200'
                      }`}>
                        {isActive ? <CheckCircle className="w-5 h-5" /> : (idx + 1)}
                      </div>
                      <span className={`text-xs sm:text-sm font-bold transition-colors duration-300 ${isActive ? 'text-teal-700' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (The Packing Slip / Items) */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6 flex flex-row items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-teal-700" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  Packing Checklist
                </CardTitle>
                <Badge variant="secondary" className="ml-auto bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50">
                  {order.items.length} items
                </Badge>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-6 transition-colors hover:bg-slate-50/50 group">
                      <div className="flex items-start gap-4">
                        {/* Faux Checkbox for packing ops */}
                        <div className="mt-1 shrink-0 text-slate-300 group-hover:text-teal-500 transition-colors cursor-pointer">
                          <Square className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-lg font-bold text-slate-900 leading-tight">
                                <span className="text-teal-600">{item.quantity}x</span> {item.itemName}
                              </p>
                              <p className="text-sm text-slate-500 mt-1">{item.unitPrice.toFixed(2)} EGP each</p>
                            </div>
                            <div className="text-lg font-bold text-slate-900 text-right shrink-0">
                              {item.lineTotal.toFixed(2)} <span className="text-sm font-semibold text-slate-500">EGP</span>
                            </div>
                          </div>

                          {/* Critical Alternative Warning */}
                          {item.isAlternative && (
                            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-amber-900 text-sm mb-1 uppercase tracking-wider">
                                  Patient Accepted Alternative
                                </h4>
                                <p className="text-amber-800 font-medium leading-relaxed">
                                  {item.alternativeNote}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Logistics & Financials) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Customer & Delivery Info */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-indigo-500" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Patient Name</h3>
                  <p className="font-extrabold text-xl text-slate-900">{order.patientName}</p>
                </div>
                
                <div className="h-px bg-slate-100" />

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Contact Number</h3>
                  <a 
                    href={`tel:${order.patientPhone}`} 
                    className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {order.patientPhone}
                  </a>
                </div>

                <div className="h-px bg-slate-100" />

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address</h3>
                  <div className="flex items-start gap-3 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">
                    <MapPin className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-700 font-medium leading-relaxed">
                        {order.deliveryAddress || "Address not provided"}
                      </p>
                      <button 
                        onClick={() => {
                          if (order.deliveryAddress) {
                            navigator.clipboard.writeText(order.deliveryAddress);
                          }
                        }}
                        className="text-xs font-bold text-orange-600 hover:text-orange-700 mt-2 uppercase tracking-wide"
                      >
                        Copy Address
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Financial Summary */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIGZpbGw9IiNlMmU4ZjAiIHBvaW50cz0iMCwwIDQsNCA4LDAgOCw4IDAsOCIvPjwvc3ZnPg==')] bg-repeat-x opacity-50"></div>
              
              <CardHeader className="pt-6 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-slate-400" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                
                {/* Method & Status Highlight */}
                {isCashOnDelivery && order.paymentStatus !== 'Paid' && (
                  <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl p-4 text-center mb-6 shadow-sm">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">Driver Instruction</p>
                    <p className="text-xl font-black text-emerald-600">Collect Cash: {order.amount.toFixed(2)} EGP</p>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="text-slate-900">{order.subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Delivery Fee</span>
                    <span className="text-slate-900">{order.deliveryFee.toFixed(2)} EGP</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>- {order.discountAmount.toFixed(2)} EGP</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t-2 border-dashed border-slate-200 my-4 pt-4 flex justify-between items-end">
                  <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1">Total</span>
                  <div className="text-3xl font-extrabold text-teal-600 tracking-tight">
                    {order.amount.toFixed(2)} <span className="text-lg text-teal-600/60 font-bold">EGP</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="font-bold text-slate-700 text-sm">{order.paymentMethod}</span>
                  </div>
                  <Badge variant="outline" className={`px-2.5 py-0.5 font-bold ${order.paymentStatus === 'Paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? Please provide a reason. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-2">
            <label className="text-sm font-bold text-slate-700">Reason for cancellation <span className="text-red-500">*</span></label>
            <Textarea 
              placeholder="e.g. Out of stock, Patient requested cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="resize-none"
              rows={3}
              disabled={isUpdating}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Keep Order</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelOrder();
              }}
              disabled={!cancelReason.trim() || isUpdating}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdating ? 'Cancelling...' : 'Confirm Cancellation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
