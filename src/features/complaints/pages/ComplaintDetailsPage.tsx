import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetComplaintByIdQuery } from '../api/complaints';
import { 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function ComplaintDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: complaint, isLoading, isError } = useGetComplaintByIdQuery(id);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const getStatusConfig = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock };
      case 'inprogress':
        return { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: AlertCircle };
      case 'resolved':
        return { color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 };
      default:
        return { color: 'text-slate-700 bg-slate-50 border-slate-200', icon: AlertCircle };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-300">
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
        <div className="h-12 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse mb-8" />
        <Card className="border-slate-100 dark:border-slate-800 dark:bg-[#0f172a] shadow-sm">
          <CardContent className="p-8 space-y-4">
            <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !complaint) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>
        <div className="text-center py-20 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-rose-900 dark:text-rose-300">Complaint Not Found</h3>
          <p className="text-rose-600 dark:text-rose-400 mt-2">The complaint you're looking for doesn't exist or could not be loaded.</p>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(complaint.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 transition-colors duration-300">
      {/* Header Section */}
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 -ml-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Complaints
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {complaint.title}
          </h1>
          <Badge variant="outline" className={`px-4 py-1.5 text-sm font-bold border flex items-center gap-2 shrink-0 ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4" />
            {complaint.status}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-medium border-b border-slate-100 dark:border-slate-800 pb-6">
          <span>Submitted on {formatDate(complaint.createdAt)}</span>
          {complaint.orderId && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-md">
                Related to Order #{complaint.orderId}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Patient's Voice Section */}
      <Card className="border-slate-200 dark:border-slate-800 dark:bg-[#0f172a] shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-slate-50/50 dark:bg-[#0b0f19] px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Your Message</h3>
          </div>
          <div className="p-6 bg-white dark:bg-[#0f172a]">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Admin Feedback Section */}
      {complaint.adminNotes && (
        <Card className="border-l-4 border-teal-500 bg-teal-50/30 dark:bg-teal-950/20 shadow-sm rounded-2xl overflow-hidden mt-8">
          <CardContent className="p-0">
            <div className="px-6 py-4 flex items-center gap-2 border-b border-teal-100/50 dark:border-teal-900/50">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              </div>
              <h3 className="font-bold text-teal-900 dark:text-teal-300 text-lg">Admin Response</h3>
            </div>
            <div className="p-6">
              <p className="text-teal-900 dark:text-teal-200 leading-relaxed whitespace-pre-wrap">
                {complaint.adminNotes}
              </p>
              
              <div className="mt-6 pt-4 border-t border-teal-100 dark:border-teal-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-sm font-medium text-teal-700/80 dark:text-teal-400/80">
                  Resolved by <strong className="text-teal-800 dark:text-teal-300">{complaint.resolvedByName || 'Admin Team'}</strong>
                </span>
                {complaint.resolvedAt && (
                  <span className="text-sm font-medium text-teal-700/80 dark:text-teal-400/80 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 opacity-70" />
                    {formatDate(complaint.resolvedAt)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
