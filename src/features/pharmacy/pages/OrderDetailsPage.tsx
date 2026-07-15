import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Phone, MapPin, Receipt, AlertTriangle, 
  CreditCard, Package, CheckCircle, AlertCircle, 
  Clock, Truck, ChefHat, CircleDot, Copy, Check, Star, MessageSquare
} from 'lucide-react';
import { useGetPharmacyOrderDetailsQuery, useUpdateOrderStatusMutation } from '../api/orders';
import { Button } from '@/components/ui/button';
import { usePagination } from '@/shared/hooks/usePagination';
import { formatLocalDateTime } from '@/utils/formatTime';
import { Badge } from '@/components/ui/badge';
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

/* ─── Constants ─────────────────────────────────────────────────────────── */
const STEPS = [
  { key: 'Accepted', label: 'Accepted', icon: CheckCircle, color: '#0ea5e9' },
  { key: 'Preparing', label: 'Preparing', icon: ChefHat, color: '#f59e0b' },
  { key: 'In Transit', label: 'In Transit', icon: Truck, color: '#6366f1' },
  { key: 'Completed', label: 'Completed', icon: CircleDot, color: '#10b981' },
];

const STATUS_STYLES: Record<string, { badgeClass: string; dotClass: string }> = {
  Pending:    { badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400', dotClass: 'bg-blue-500' },
  Accepted:   { badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400', dotClass: 'bg-blue-500' },
  Preparing:  { badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400', dotClass: 'bg-amber-500' },
  InTransit:  { badgeClass: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400', dotClass: 'bg-indigo-500' },
  Completed:  { badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400', dotClass: 'bg-emerald-500' },
  Delivered:  { badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400', dotClass: 'bg-emerald-500' },
  Cancelled:  { badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400', dotClass: 'bg-rose-500' },
  Returned:   { badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400', dotClass: 'bg-rose-500' },
};

/* ─── Animations ────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/* ─── Page Component ────────────────────────────────────────────────────── */
export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  
  const { data: order, isLoading, isError } = useGetPharmacyOrderDetailsQuery(orderId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatusMutation(orderId);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-12 h-12 rounded-full border-[3px] border-slate-200 dark:border-slate-700 animate-spin"
            style={{ borderTopColor: '#0284c7' }}
          />
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wide">Loading order...</span>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-rose-100 dark:bg-rose-950/20" 
        >
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Order not found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">The order you are looking for does not exist or you do not have permission to view it.</p>
        <Button 
          onClick={() => navigate('/pharmacy/orders')} 
          variant="outline" 
          className="mt-4 rounded-xl border-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  /* ── Derived state ── */
  const isCancelledOrReturned = order.orderStatus === 'Cancelled' || order.orderStatus === 'Returned';
  const isTerminalState = isCancelledOrReturned || order.orderStatus === 'Completed' || order.orderStatus === 'Delivered';
  
  let displayStatus = order.orderStatus;
  if (displayStatus === 'Pending') displayStatus = 'Accepted';
  if (displayStatus === 'Delivered') displayStatus = 'Completed';
  if (displayStatus === 'InTransit') displayStatus = 'In Transit';
  const currentStepIndex = STEPS.findIndex(s => s.key === displayStatus);

  const statusStyle = STATUS_STYLES[order.orderStatus] || STATUS_STYLES.Pending;
  const isCashOnDelivery = order.paymentMethod?.toLowerCase().includes('cash');

  const formatDate = (dateString: string) => {
    return formatLocalDateTime(dateString);
  };

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

  const handleCopyAddress = () => {
    if (order.deliveryAddress) {
      navigator.clipboard.writeText(order.deliveryAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  /* ── Next action button config ── */
  const getNextAction = () => {
    if (isTerminalState) return null;
    if (displayStatus === 'Accepted' || displayStatus === 'Pending')
      return { label: 'Start Preparing', status: 'Preparing', color: '#f59e0b', hoverColor: '#d97706' };
    if (displayStatus === 'Preparing')
      return { label: 'Dispatch Order', status: 'InTransit', color: '#6366f1', hoverColor: '#4f46e5' };
    if (displayStatus === 'In Transit')
      return { label: 'Mark Completed', status: 'Completed', color: '#10b981', hoverColor: '#059669' };
    return null;
  };

  const nextAction = getNextAction();

  return (
    <div 
      className="min-h-screen pb-24"
      style={{ paddingTop: '32px' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* ─── Page Header ─── */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <button 
              onClick={() => navigate('/pharmacy/orders')} 
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm shrink-0 mt-1"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Order #{order.id}
                </h1>
                <span 
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${statusStyle.badgeClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotClass}`} />
                  {order.orderStatus === 'InTransit' ? 'In Transit' : order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Received on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isTerminalState && (
            <div className="flex flex-wrap items-center gap-3">
              {nextAction && (
                <Button 
                  onClick={() => handleAction(nextAction.status)} 
                  disabled={isUpdating}
                  className="text-white font-bold text-xs rounded-xl h-10 px-5 shadow-sm transition-all"
                  style={{ background: nextAction.color }}
                >
                  {isUpdating ? 'Updating...' : nextAction.label}
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setIsCancelModalOpen(true)}
                disabled={isUpdating}
                className="font-bold text-xs rounded-xl h-10 px-5 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              >
                Cancel Order
              </Button>
            </div>
          )}
        </motion.div>

        {/* ─── Status Stepper or Cancelled Alert ─── */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {isCancelledOrReturned ? (
            <Alert 
              className="rounded-2xl shadow-sm border-none bg-rose-50 dark:bg-rose-950/10 text-rose-900 dark:text-rose-300"
            >
              <AlertCircle className="h-5 w-5 text-rose-500" />
              <AlertTitle className="font-black text-base">Order {order.orderStatus}</AlertTitle>
              <AlertDescription className="mt-1.5 text-sm font-medium text-rose-700 dark:text-rose-400">
                {order.cancelReason || "This order was cancelled."}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 overflow-hidden">
              <div className="relative flex items-center justify-between w-full max-w-3xl mx-auto">
                {/* Track background */}
                <div className="absolute left-[10%] top-5 w-[80%] h-[3px] bg-slate-100 dark:bg-slate-800 rounded-full z-0" />
                {/* Track progress */}
                <div 
                  className="absolute left-[10%] top-5 h-[3px] rounded-full z-0"
                  style={{ 
                    width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 80)}%`,
                    background: 'linear-gradient(90deg, #0ea5e9, #10b981)',
                    transition: 'width 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                />
                
                {STEPS.map((step, idx) => {
                  const isActive = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="relative z-10 flex flex-col items-center gap-2.5">
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.12, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500"
                        style={isActive ? {
                          background: isCurrent 
                            ? step.color 
                            : `${step.color}20`,
                          color: isCurrent ? '#fff' : step.color,
                          boxShadow: isCurrent ? `0 4px 14px ${step.color}40` : 'none',
                        } : {
                          backgroundColor: 'transparent',
                          border: '2px solid',
                          borderColor: '#e2e8f0',
                          color: '#94a3b8',
                        }}
                      >
                        {isActive ? <Icon className="w-4.5 h-4.5" /> : <span className="text-xs font-black">{idx + 1}</span>}
                      </motion.div>
                      <span 
                        className="text-[11px] font-bold transition-colors duration-300 text-center"
                        style={{ color: isActive ? (isCurrent ? step.color : '#475569') : '#94a3b8' }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* ── Left Column: Packing Checklist & Customer Details ── */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div 
              custom={2} 
              variants={fadeUp} 
              initial="hidden" 
              animate="visible" 
            >
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Thin top accent */}
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #0ea5e9, #10b981)' }} />
              
              <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-teal-50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/30"
                >
                  <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-black text-slate-900 dark:text-white">Packing Checklist</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold">Verify each item before dispatch</p>
                </div>
                <span 
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400"
                >
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              
              <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {order.items.map((item: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    custom={idx + 3} 
                    variants={fadeUp} 
                    initial="hidden" 
                    animate="visible"
                    className="p-5 sm:p-6 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20 group"
                  >
                    <div className="flex items-start gap-4">
                      {/* Item number indicator */}
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-black transition-colors bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      >
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {item.itemName}
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
                              <span className="font-bold text-sky-600 dark:text-sky-400">{item.quantity}×</span>
                              {' '}at {item.unitPrice.toFixed(2)} EGP each
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-black text-slate-900 dark:text-white">
                              {item.lineTotal.toFixed(2)}
                            </p>
                            <p className="text-[10px] text-slate-400 font-semibold">EGP</p>
                          </div>
                        </div>

                        {/* Alternative Warning */}
                        {item.isAlternative && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 rounded-xl p-3.5 flex items-start gap-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30"
                          >
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-amber-800 dark:text-amber-400">
                                Alternative Accepted
                              </p>
                              <p className="text-xs font-medium leading-relaxed text-amber-900 dark:text-amber-300">
                                {item.alternativeNote}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Customer Details Card */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
            <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
              
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30"
                >
                  <Phone className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Customer Details</h3>
              </div>

              <div className="p-5 space-y-5">
                {/* Patient Name */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Patient Name</p>
                  <p className="text-base font-black text-slate-900 dark:text-white">{order.patientName}</p>
                </div>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Contact */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Contact</p>
                  <a 
                    href={`tel:${order.patientPhone}`} 
                    className="inline-flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/30"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {order.patientPhone}
                  </a>
                </div>
                
                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Delivery Address */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Delivery Address</p>
                  <div 
                    className="rounded-xl p-3.5 flex items-start gap-3 bg-orange-50 dark:bg-orange-950/10 border border-orange-200/30 dark:border-orange-900/20"
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-orange-600 dark:text-orange-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                        {order.deliveryAddress || "Address not provided"}
                      </p>
                      <button 
                        onClick={handleCopyAddress}
                        className={`mt-2 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${copiedAddress ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
                      >
                        {copiedAddress ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedAddress ? 'Copied!' : 'Copy Address'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Right Column: Financials & Rating ── */}
        <div className="lg:col-span-4 space-y-6">

            {/* Financial Summary Card */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible">
              <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                <div style={{ height: '3px', background: 'linear-gradient(90deg, #0ea5e9, #0284c7)' }} />

                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div 
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/20 border border-sky-200/30 dark:border-sky-900/30"
                  >
                    <Receipt className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Financial Summary</h3>
                </div>

                <div className="p-5 space-y-4">
                  {/* Cash on Delivery Instruction */}
                  {isCashOnDelivery && order.paymentStatus !== 'Paid' && (
                    <div 
                      className="rounded-xl p-4 text-center bg-emerald-50 dark:bg-emerald-950/10 border-2 border-emerald-500 dark:border-emerald-400"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-emerald-800 dark:text-emerald-400">
                        Driver Instruction
                      </p>
                      <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        Collect {order.amount.toFixed(2)} EGP
                      </p>
                    </div>
                  )}

                  {/* Line Items */}
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Subtotal</span>
                      <span className="font-bold text-slate-900 dark:text-white">{order.subtotal.toFixed(2)} EGP</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Delivery Fee</span>
                      <span className="font-bold text-slate-900 dark:text-white">{order.deliveryFee.toFixed(2)} EGP</span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Discount</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">- {order.discountAmount.toFixed(2)} EGP</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Total */}
                  <div 
                    className="pt-4 flex justify-between items-end border-t-2 border-dashed border-slate-200 dark:border-slate-700"
                  >
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                        {order.amount.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold ml-1 text-sky-600/50 dark:text-sky-400/50">EGP</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div 
                    className="mt-3 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{order.paymentMethod}</span>
                    </div>
                    <span 
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400'}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Rich Pharmacy Rating Card */}
            {order.pharmacyRating && (
              <motion.div custom={4.5} variants={fadeUp} initial="hidden" animate="visible">
                <div className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, #facc15, #f59e0b)' }} />
                  
                  <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/30"
                    >
                      <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">Patient Rating</h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Rating Given</p>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-5 h-5 ${star <= order.pharmacyRating!.ratingValue ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 dark:text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {order.pharmacyRating.comment && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 mt-4">Comment</p>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <MessageSquare className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="leading-relaxed font-medium break-words">
                              {order.pharmacyRating.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>

      {/* ─── Cancel Order Modal ─── */}
      <AlertDialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md border-slate-200 dark:border-slate-700 dark:bg-slate-900">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#e11d48' }} className="font-black">Cancel Order</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-sm">
              Are you sure you want to cancel this order? Please provide a reason. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Reason for cancellation <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <Textarea 
              placeholder="e.g. Out of stock, Patient requested cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="resize-none rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm"
              rows={3}
              disabled={isUpdating}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel 
              disabled={isUpdating}
              className="rounded-xl font-bold text-xs dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleCancelOrder();
              }}
              disabled={!cancelReason.trim() || isUpdating}
              className="rounded-xl text-white font-bold text-xs"
              style={{ backgroundColor: '#e11d48' }}
            >
              {isUpdating ? 'Cancelling...' : 'Confirm Cancellation'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
