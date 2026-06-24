import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '@/types/api.types';
import { RegisterDto, LoginDto } from '@/types/auth.types';

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Account Created Successfully');
      navigate('/');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        // Display each validation error
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
  });
};

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => authService.login(data),
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Welcome back!');
      navigate('/');
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Login failed. Please check your credentials.');
      }
    }
  });
};

