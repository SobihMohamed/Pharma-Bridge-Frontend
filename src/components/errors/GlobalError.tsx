import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export default function GlobalError() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Something went wrong</h1>
      <p className="text-gray-500 max-w-md mb-8">
        We encountered an unexpected error. This might be due to a network issue or a temporary glitch.
        <br />
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
          {error?.statusText || error?.message || 'Unknown Error'}
        </span>
      </p>
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
      >
        <Home className="w-5 h-5" />
        Go to Home
      </button>
    </div>
  );
}
