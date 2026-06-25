import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NewRequestForm from '../components/NewRequestForm';
import { useCreateRequestMutation } from '../hooks/usePrescriptionRequestMutations';

export default function NewRequestPage() {
  const { mutate, isPending } = useCreateRequestMutation();

  const handleCreateRequest = (formData: FormData) => {
    mutate(formData);
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
          Upload your prescription or type a medicine name, and choose your preferred delivery address to receive offers from nearby pharmacies.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <NewRequestForm onSubmit={handleCreateRequest} isLoading={isPending} />
      </div>
    </div>
  );
}
