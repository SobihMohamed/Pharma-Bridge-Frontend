import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Store, MapPin, Receipt, AlertTriangle, Phone, 
  Calendar, CreditCard, AlertCircle, CheckCircle, Package, Pill
} from 'lucide-react';
import { useGetOrderDetailsQuery } from '../api/orders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ReportIssueDialog } from '@/features/complaints/components/ReportIssueDialog';

const STEPS = ['Accepted', 'Preparing', 'In Transit', 'Completed'];

export default function PatientOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  
  const { data: order, isLoading, isError } = useGetOrderDetailsQuery(orderId);

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
        <p className="text-slate-500">The order you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/orders')} variant="outline" className="mt-4 border-slate-300">
          Back to Orders
        </Button>
      </div>
    );
  }

  const isCancelledOrReturned = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';
  // Map Accepted to Pending. Map Delivered to Completed for the stepper UI
  let displayStatus = order.orderStatus;
  if (displayStatus === 'Pending') displayStatus = 'Accepted';
  if (displayStatus === 'Delivered') displayStatus = 'Completed';
  if (displayStatus === 'InTransit') displayStatus = 'In Transit';
  const currentStepIndex = STEPS.indexOf(displayStatus);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/orders')} 
            className="rounded-full shadow-sm hover:bg-slate-100 shrink-0 bg-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order #{order.id}</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Status Stepper or Alert */}
        {isCancelledOrReturned ? (
          <Alert variant="destructive" className="bg-red-50 text-red-900 border-red-200 rounded-2xl shadow-sm">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-bold text-lg">Order {order.orderStatus}</AlertTitle>
            <AlertDescription className="mt-2 text-red-800 text-base">
              {order.cancelReason || "This order was cancelled and will not be fulfilled."}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Order Items) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
                  <Package className="w-6 h-6 text-teal-600" />
                  Order Items
                  <Badge variant="secondary" className="ml-2 bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors">{order.items.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3 transition-colors hover:bg-slate-100/50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                          <Pill className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="pt-0.5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold text-xs tracking-wide">
                              {item.quantity}x
                            </span>
                            <p className={`font-bold text-base leading-tight ${item.isAlternative ? 'text-amber-700' : 'text-slate-900'}`}>
                              {item.itemName}
                            </p>
                          </div>
                          <p className="text-sm text-slate-500 font-medium">{item.unitPrice.toFixed(2)} EGP each</p>
                        </div>
                      </div>
                      <div className="font-extrabold text-slate-900 text-lg shrink-0 mt-0.5 text-right">
                        {item.lineTotal.toFixed(2)} <span className="text-sm font-semibold text-slate-400">EGP</span>
                      </div>
                    </div>
                    
                    {/* Alternative Warning Box */}
                    {item.isAlternative && (
                      <div className="mt-1 ml-14 bg-amber-100/50 rounded-lg border border-amber-200/60 p-3 text-sm flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-900 block mb-0.5">Alternative Item Provided</span>
                          <span className="text-amber-800/90 leading-snug block">
                            {item.alternativeNote || "The pharmacy substituted this item based on availability."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Summary & Info) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Financial Summary (Receipt Style) */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white relative overflow-hidden">
              {/* Decorative Receipt Zigzag Top */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwb2x5Z29uIGZpbGw9IiNlMmU4ZjAiIHBvaW50cz0iMCwwIDQsNCA4LDAgOCw4IDAsOCIvPjwvc3ZnPg==')] bg-repeat-x opacity-50"></div>
              
              <CardHeader className="pt-8 pb-4">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-slate-800">
                  <Receipt className="w-6 h-6 text-slate-400" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="text-slate-900">{order.subtotal.toFixed(2)} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 font-medium">
                    <span>Delivery Fee</span>
                    <span className="text-slate-900">{order.deliveryFee.toFixed(2)} EGP</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-emerald-500 font-bold">
                      <span>Discount</span>
                      <span>- {order.discountAmount.toFixed(2)} EGP</span>
                    </div>
                  )}
                </div>
                
                {/* Dashed line for receipt feel */}
                <div className="border-t-2 border-dashed border-slate-200 my-4 pt-4 flex justify-between items-end">
                  <span className="text-sm font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Total</span>
                  <div className="text-4xl font-extrabold text-teal-600 tracking-tight">
                    {order.amount.toFixed(2)} <span className="text-xl text-teal-600/60 font-bold">EGP</span>
                  </div>
                </div>

                {/* Payment Status Badges */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-slate-700">{order.paymentMethod}</span>
                  </div>
                  <Badge variant="outline" className={`px-3 py-1 font-bold border-2 ${order.paymentStatus === 'Paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Pharmacy Info */}
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all rounded-2xl bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-extrabold text-slate-800">Fulfillment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-6">
                
                {/* Pharmacy Info */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Prepared By</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-inner">
                      <Store className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-extrabold text-lg text-slate-900 leading-tight">{order.pharmacyName}</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {order.pharmacyPhone || 'No phone provided'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Delivery Address */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Delivery Address</h3>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 shadow-inner">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-slate-700 font-semibold leading-relaxed mt-1">
                      {order.deliveryAddress || "Address not provided"}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Timestamps */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <span>Placed on {formatDate(order.createdAt)}</span>
                  </div>
                  {order.deliveredAt && (
                    <div className="flex items-center gap-3 text-sm font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span>Delivered on {formatDate(order.deliveredAt)}</span>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>

            {/* Report Issue Button (Only for Completed Orders) */}
            {order.orderStatus === 'Completed' && (
              <Card className="border-rose-100 shadow-sm rounded-2xl bg-rose-50/30 overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                  <p className="text-sm font-medium text-slate-600">
                    Something wrong with this order?
                  </p>
                  <ReportIssueDialog orderId={order.id} />
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
