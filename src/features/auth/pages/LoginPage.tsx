import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleMockLogin = () => {
    setAuth({
      message: 'Success',
      isAuthenticated: true,
      name: 'Test Patient',
      email: 'patient@example.com',
      token: 'mock-jwt-token',
      expireOn: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      roles: ['Patient'],
    });
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Login Page</h2>
      <p className="text-gray-500 text-center text-sm">
        You were redirected here because the root route is protected.
      </p>
      <button
        onClick={handleMockLogin}
        className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
      >
        Mock Login as Patient
      </button>
    </div>
  );
}
