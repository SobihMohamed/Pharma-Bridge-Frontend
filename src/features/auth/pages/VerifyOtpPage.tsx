import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, KeyRound, ArrowLeft } from 'lucide-react';
import { useVerifyOtpMutation } from '../hooks/useAuthMutations';

interface LocationState {
  email?: string;
}

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const { mutate, isPending } = useVerifyOtpMutation();
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (!state?.email) {
      navigate('/forget-password', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.email) return null; // Wait for redirect

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      mutate({ email: state.email!, otp });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center shadow-sm border border-teal-100">
            <ShieldCheck className="w-8 h-8 text-teal-600" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Verify OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 px-6">
          Enter the 6-digit code sent to <span className="font-semibold">{state.email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-teal-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="otp">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-lg sm:tracking-[0.5em] transition-shadow text-center font-mono"
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9a-zA-Z]/g, '').toUpperCase())}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isPending || !otp}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>
          </form>

          {/* Back Action */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
            <Link 
              to="/forget-password" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Email Address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
