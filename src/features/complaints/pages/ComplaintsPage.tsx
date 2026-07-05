import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquareOff, ChevronLeft, ChevronRight, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useGetMyComplaintsQuery } from '../api/complaints';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ComplaintsPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useGetMyComplaintsQuery(pageIndex, pageSize);

  const complaints = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(dateStr));
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Complaints</h1>
        <p className="text-slate-500 mt-2">Track the status of your reported issues and resolutions.</p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-slate-100 shadow-sm animate-pulse">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded-full w-24"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-32 mt-4"></div>
              </CardContent>
            </Card>
          ))
        ) : isError ? (
          <div className="text-center py-12 bg-rose-50 rounded-2xl border border-rose-100">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-rose-900">Failed to load complaints</h3>
            <p className="text-rose-600 mt-1">Please try refreshing the page.</p>
          </div>
        ) : complaints.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5">
              <MessageSquareOff className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Complaints Found</h3>
            <p className="text-slate-500 text-center max-w-sm">
              You haven't submitted any complaints yet. We hope everything is going smoothly with your orders!
            </p>
          </div>
        ) : (
          // Data Display
          <div className="space-y-4">
            {complaints.map((complaint) => {
              const statusConfig = getStatusConfig(complaint.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Link key={complaint.id} to={`/complaints/${complaint.id}`} className="block">
                  <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                              {complaint.title}
                            </h3>
                            {complaint.orderId && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                Order #{complaint.orderId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-400">
                            Submitted on {formatDate(complaint.createdAt)}
                          </p>
                        </div>
                        <Badge variant="outline" className={`px-3 py-1 text-xs font-bold border flex items-center gap-1.5 shrink-0 ${statusConfig.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {complaint.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {complaint.description}
                        </p>
                      </div>

                      {/* Optional: Show resolution date if resolved */}
                      {complaint.status.toLowerCase() === 'resolved' && complaint.resolvedAt && (
                        <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 w-fit">
                          <CheckCircle2 className="w-4 h-4" />
                          Resolved on {formatDate(complaint.resolvedAt)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
              );
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
                <span className="text-sm text-slate-500 font-medium">
                  Page <span className="font-bold text-slate-900">{pageIndex}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                    disabled={pageIndex === 1 || isLoading}
                    className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                    disabled={pageIndex === totalPages || isLoading}
                    className="rounded-xl border-slate-200 text-slate-600 hover:text-slate-900"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
