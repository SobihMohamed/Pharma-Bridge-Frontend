import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSubmitComplaintMutation } from '../api/complaints';

const complaintSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters.').refine(val => !/^\d+$/.test(val), 'Title cannot be only numbers'),
  description: z.string().trim().min(15, 'Description must be at least 15 characters.'),
});

type ComplaintFormInput = z.input<typeof complaintSchema>;
type ComplaintFormOutput = z.output<typeof complaintSchema>;

interface ReportIssueDialogProps {
  orderId: number;
}

export function ReportIssueDialog({ orderId }: ReportIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const mutation = useSubmitComplaintMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ComplaintFormInput, any, ComplaintFormOutput>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: ComplaintFormOutput) => {
    mutation.mutate(
      {
        title: data.title,
        description: data.description,
        orderId,
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      mutation.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 font-bold rounded-xl"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report an Issue
          </Button>
        }
      />

      <DialogContent className="bg-white sm:max-w-[520px] p-0 rounded-2xl shadow-2xl border-0 z-50 overflow-hidden">
        {/* Decorative Header Band */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-5">
          <DialogHeader className="gap-2">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              Report an Issue
            </DialogTitle>
            <DialogDescription className="text-rose-100 text-sm leading-relaxed">
              Having a problem with <span className="font-bold text-white">Order #{orderId}</span>? Tell us what went wrong and our team will review it shortly.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-5 pb-6 space-y-5">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="complaint-title" className="text-sm font-bold text-slate-700">
              Subject <span className="text-rose-500">*</span>
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  id="complaint-title"
                  placeholder="e.g. Wrong medication delivered"
                  {...field}
                  className={`h-11 bg-slate-50 border-slate-200 focus-visible:ring-rose-500 focus:bg-white rounded-xl transition-colors ${
                    errors.title ? 'border-rose-300 bg-rose-50/30' : ''
                  }`}
                  disabled={mutation.isPending}
                />
              )}
            />
            {errors.title && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="complaint-description" className="text-sm font-bold text-slate-700">
              Description <span className="text-rose-500">*</span>
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="complaint-description"
                  placeholder="Please describe the issue in detail. Include any relevant information such as missing items, damaged packaging, incorrect dosage, etc."
                  {...field}
                  rows={5}
                  className={`bg-slate-50 border-slate-200 focus-visible:ring-rose-500 focus:bg-white resize-none rounded-xl transition-colors ${
                    errors.description ? 'border-rose-300 bg-rose-50/30' : ''
                  }`}
                  disabled={mutation.isPending}
                />
              )}
            />
            {errors.description && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 mt-1">
                <AlertTriangle className="w-3 h-3" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              disabled={mutation.isPending}
              className="w-full sm:w-auto text-slate-500 hover:text-slate-700 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl py-5 shadow-sm hover:shadow-md transition-all"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 mr-2" />
                  Submit Complaint
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
