import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePharmaOwnerProfileQuery } from '../../hooks/useOwnerProfile';
import { useMyPharmacyProfileQuery } from '../../hooks/usePharmacyProfile';
import { toast } from 'sonner';

interface PharmacyProtectedRouteProps {
  children: React.ReactNode;
}

export const PharmacyProtectedRoute: React.FC<PharmacyProtectedRouteProps> = ({ children }) => {
  const { data: ownerProfile, isLoading: isOwnerLoading } = usePharmaOwnerProfileQuery();
  const isOwnerApproved = ownerProfile?.status === 'Approved';
  const { data: pharmacyProfile, isLoading: isPharmacyLoading } = useMyPharmacyProfileQuery(isOwnerApproved);
  
  const location = useLocation();
  const navigate = useNavigate();

  const isLoading = isOwnerLoading || isPharmacyLoading;

  useEffect(() => {
    if (isLoading) return;

    const isOwnerMissing = !ownerProfile;
    const isOwnerPending = ownerProfile?.status === 'Pending';
    const actualPharmacyProfile = (pharmacyProfile as any)?.data || pharmacyProfile;
    const isPharmacyApproved = actualPharmacyProfile?.status === 'Approved' || actualPharmacyProfile?.status === 'Active' || actualPharmacyProfile?.isApproved;
    
    const isLocked = isOwnerMissing || isOwnerPending || !isPharmacyApproved;
    
    if (isLocked) {
      if (location.pathname !== '/pharmacy/settings') {
        let msg = "Your account or pharmacy is pending approval. Access restricted.";
        if (isOwnerMissing) msg = "Please complete your business profile to unlock the dashboard.";
        else if (isOwnerPending) msg = "Your account is pending admin approval.";
        else if (!pharmacyProfile) msg = "Please register your pharmacy location to unlock the dashboard.";
        
        toast.error(msg);
        navigate('/pharmacy/settings', { replace: true });
      }
    }
  }, [ownerProfile, pharmacyProfile, isLoading, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          <p className="text-teal-600 font-medium">Checking Profile Status...</p>
        </div>
      </div>
    );
  }

  // Prevent flicker of content before redirect completes
  const isOwnerMissing = !ownerProfile;
  const isOwnerPending = ownerProfile?.status === 'Pending';
  const actualPharmacyProfile = (pharmacyProfile as any)?.data || pharmacyProfile;
  const isPharmacyApproved = actualPharmacyProfile?.status === 'Approved' || actualPharmacyProfile?.status === 'Active' || actualPharmacyProfile?.isApproved;
  const isLocked = isOwnerMissing || isOwnerPending || !isPharmacyApproved;
  
  if (isLocked && location.pathname !== '/pharmacy/settings') {
    return null;
  }

  return <>{children}</>;
};
