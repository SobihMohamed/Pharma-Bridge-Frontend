import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pill, Mail, Lock, User, Phone, BadgeAlert } from 'lucide-react';
import { useRegisterMutation } from '../hooks/useAuthMutations';
import { useGoogleAuthMutation } from '../hooks/useGoogleAuthMutation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth.types';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { mutate: regularRegister, isPending: isRegularPending } = useRegisterMutation();
  const { mutate: googleRegister, isPending: isGooglePending } = useGoogleAuthMutation();

  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'Patient' as UserRole
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    regularRegister(formData);
  };
  const registerWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleRegister(
        { idToken: codeResponse.access_token, role: formData.role },
        {
          onSuccess: (res) => {
            const payload = res.data || res;
            // Exact same flow as regular email/password registration
            setAuth(payload as any);
            toast.success('Account Created Successfully');
            if (payload.roles?.includes('PharmacyOwner')) {
              navigate('/pharmacy/dashboard');
            } else {
              navigate('/profile');
            }
          },
          onError: (error) => {
            toast.error(error?.message || 'Failed to authenticate with our servers');
          }
        }
      );
    },
    onError: () => toast.error('Google sign-in was cancelled or failed')
  });

  // Guard: validate role selection BEFORE opening the Google popup
  const handleGoogleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!formData.role) {
      toast.error('Please select your account type (Patient or Pharmacy) first.');
      return;
    }
    registerWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <Pill className="w-10 h-10 text-white -rotate-3" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Join PharmaBridge
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-teal-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* Role Selection — placed above Google button so user must pick first */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
              I am signing up as a:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeAlert className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="role"
                name="role"
                className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Patient">Patient (Customer)</option>
                <option value="PharmacyOwner">Pharmacy Owner</option>
                <option value="Admin">System Administrator</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1.5 ml-1">Select your role before continuing.</p>
          </div>

          {/* Google Register Button — OUTSIDE the <form>, type="button" + e.preventDefault() */}
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={isGooglePending || isRegularPending}
            className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mb-6"
          >
            {isGooglePending ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>

          {/* Elegant Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or register with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
                  placeholder="John Doe"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-shadow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isRegularPending || isGooglePending}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRegularPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Policy disclaimer */}
          <div className="mt-6">
            <p className="text-xs text-center text-gray-500 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="font-medium text-teal-600 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="font-medium text-teal-600 hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
