import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft } from 'lucide-react';
import { useForgetPasswordMutation } from '../hooks/useAuthMutations';

export default function ForgetPasswordPage() {
  const { mutate, isPending } = useForgetPasswordMutation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email cannot be empty');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Invalid email format');
      return;
    }

    if (email) {
      mutate({ email });
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 relative overflow-hidden">

  {/* Background Glow */}
  <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[30%] bg-[#bae6fd]/30 rounded-full blur-3xl" />
  <div className="absolute bottom-[-10%] left-[-10%] w-[35%] h-[25%] bg-[#0284c7]/10 rounded-full blur-3xl" />

  <div className="relative z-10 w-full max-w-md">
    
    {/* Icon */}
    <div className="flex justify-center mb-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] flex items-center justify-center shadow-xl shadow-[#0284c7]/20">
        <KeyRound className="w-10 h-10 text-white" />
      </div>
    </div>

    {/* Header */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#bae6fd]/30 text-[#0369a1] text-xs font-semibold mb-4">
        Reset your password securely
      </div>

      <h2 className="text-3xl font-bold text-[#0369a1] tracking-tight">
        Forgot Password?
      </h2>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed px-4">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>
    </div>

    {/* Card */}
    <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8">

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email Address
          </label>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {/* <Mail className="h-5 w-5 text-[#0284c7]" /> */}
            </div>

            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className={`w-full pl-14 pr-4 py-3 border ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-[#bae6fd] focus:ring-[#0284c7]/10 focus:border-[#0284c7]'}
              rounded-xl bg-[#F8FAFC]
              focus:outline-none
              focus:ring-4
              focus:bg-white
              transition-all`}
            />
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending || !email}
          className="w-full py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-[#0284c7] to-[#0369a1]
          hover:from-[#0369a1] hover:to-[#0284c7]
          shadow-lg shadow-[#0284c7]/20
          transition-all
          disabled:opacity-60
          disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex justify-center items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending OTP...
            </div>
          ) : (
            "Send Verification Code"
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0369a1] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </div>
  </div>
</div>
  );
}
