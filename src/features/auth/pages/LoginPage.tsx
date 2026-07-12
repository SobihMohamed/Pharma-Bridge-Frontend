import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Pill, Mail, Lock } from 'lucide-react';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { useGoogleAuthMutation } from '../hooks/useGoogleAuthMutation';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    <path fill="none" d="M1 1h22v22H1z" />
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutate: regularLogin, isPending: isRegularPending } = useLoginMutation();
  const { mutate: googleLogin, isPending: isGooglePending } = useGoogleAuthMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    regularLogin(formData);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      googleLogin(
        { idToken: codeResponse.access_token },
        {
          onSuccess: (res) => {
            const payload = res.data || res;
            // Exact same flow as regular email/password login
            setAuth(payload as any);
            toast.success('Logged in successfully!');
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <Pill className="w-10 h-10 text-white -rotate-3" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-teal-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">

          {/* Google Login Button — OUTSIDE the <form>, type="button" to prevent any submit */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              loginWithGoogle();
            }}
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
              <span className="px-3 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <Link to="/forget-password" className="text-sm font-medium text-teal-600 hover:text-teal-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
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
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
