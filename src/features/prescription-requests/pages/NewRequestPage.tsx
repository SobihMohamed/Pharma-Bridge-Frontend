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
    <main className="flex-grow max-w-4xl mx-auto w-full px-4 md:px-8 py-8 font-sans transition-colors duration-300">
      {/* Breadcrumb / Back Link */}
      <Link 
        to="/requests" 
        className="inline-flex items-center gap-1 text-[#006590] hover:text-[#00567c] dark:text-sky-400 dark:hover:text-sky-300 transition-colors mb-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">Back to Requests</span>
      </Link>
      
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-[40px] leading-[48px] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Request New Prescription</h1>
        <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Upload your prescription or type a medicine name, and choose your preferred delivery address to receive offers from nearby pharmacies.
        </p>
      </div>

      {/* Submission Form Container */}
      <section className="bg-white dark:bg-[#0f172a] border border-[#bec8d1] dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 transition-colors duration-300">
        <NewRequestForm onSubmit={handleCreateRequest} isLoading={isPending} />
      </section>

      {/* Support Help Card */}
      <div className="mt-8 p-6 rounded-2xl border border-[#85cbfd] dark:border-sky-800 bg-[#c8e6ff]/30 dark:bg-sky-950/30 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#85cbfd] dark:bg-sky-800 flex items-center justify-center text-[#00567c] dark:text-sky-300 shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">Need help with your request?</p>
            <p className="text-sm text-gray-500 dark:text-slate-400">Our support team is available 24/7 to assist you.</p>
          </div>
        </div>
        <button className="px-6 py-2 border border-[#006590] dark:border-sky-500 text-[#006590] dark:text-sky-400 rounded-full text-sm font-semibold hover:bg-[#006590] hover:text-white dark:hover:bg-sky-600 dark:hover:text-white transition-all whitespace-nowrap">
          Contact Support
        </button>
      </div>
    </main>
  );
}
