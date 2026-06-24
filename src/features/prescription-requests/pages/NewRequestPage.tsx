import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import NewRequestForm from '../components/NewRequestForm';
import { CreatePrescriptionRequestDto } from '../types';

export default function NewRequestPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleCreateRequest = async (data: CreatePrescriptionRequestDto) => {
    setIsSubmitting(true);
    
    // Simulate network latency for mock submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    
    // Success feedback
    toast.success('Prescription request submitted successfully!', {
      description: 'Pharmacies will review your request and send bids shortly.',
    });
    
    // Redirect back to requests list
    navigate('/requests');
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <Link 
          to="/requests" 
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-teal-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Request New Prescription</h1>
        <p className="text-gray-500 mt-2">
          Upload your prescription and choose your preferred delivery address to receive offers from nearby pharmacies.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <NewRequestForm onSubmit={handleCreateRequest} isLoading={isSubmitting} />
      </div>
    </div>
  );
}
