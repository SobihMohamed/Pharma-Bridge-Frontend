import { Link } from 'react-router-dom';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import NewRequestForm from '../components/NewRequestForm';
import { useCreateRequestMutation } from '../hooks/usePrescriptionRequestMutations';

export default function NewRequestPage() {
  const { mutate, isPending } = useCreateRequestMutation();

  const handleCreateRequest = (formData: FormData) => {
    mutate(formData);
  };

  return (
    <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 py-8 font-sans">
      {/* Breadcrumb / Back Link */}
      <Link 
        to="/requests" 
        className="inline-flex items-center gap-1 text-[#006590] hover:text-[#00567c] transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">Back to Requests</span>
      </Link>
      
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[40px] leading-[48px] font-bold text-gray-900 mb-2 tracking-tight">Request New Prescription</h1>
        <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
          Upload your prescription or type a medicine name, and choose your preferred delivery address to receive offers from nearby pharmacies.
        </p>
      </div>

      {/* Submission Form Container */}
      <section className="bg-white border border-[#bec8d1] rounded-2xl shadow-sm p-6 md:p-8">
        <NewRequestForm onSubmit={handleCreateRequest} isLoading={isPending} />
      </section>

      {/* Support Help Card */}
      <div className="mt-8 p-6 rounded-2xl border border-[#85cbfd] bg-[#c8e6ff]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#85cbfd] flex items-center justify-center text-[#00567c] shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Need help with your request?</p>
            <p className="text-sm text-gray-500">Our support team is available 24/7 to assist you.</p>
          </div>
        </div>
        <button className="px-6 py-2 border border-[#006590] text-[#006590] rounded-full text-sm font-semibold hover:bg-[#006590] hover:text-white transition-all whitespace-nowrap">
          Contact Support
        </button>
      </div>
    </main>
  );
}
