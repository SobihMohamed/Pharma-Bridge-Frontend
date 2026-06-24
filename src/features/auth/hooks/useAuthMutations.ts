import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '@/types/api.types';
import { RegisterDto, LoginDto, ForgetPasswordDto, VerifyOtpDto, ResetPasswordDto } from '@/types/auth.types';

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

export const useForgetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: ForgetPasswordDto) => authService.forgetPassword(data),
    onSuccess: (_, variables) => {
      toast.success('OTP sent to your email');
      navigate('/verify-otp', { state: { email: variables.email } });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to process request. Please try again.');
      }
    }
  });
};

export const useVerifyOtpMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: VerifyOtpDto) => authService.verifyOtp(data),
    onSuccess: (_, variables) => {
      toast.success('OTP verified successfully');
      navigate('/reset-password', { state: { email: variables.email, otp: variables.otp } });
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Invalid or incorrect OTP.');
    }
  });
};

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: ResetPasswordDto) => authService.resetPassword(data),
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Your password has changed successfully');
      navigate('/', { replace: true });
    },
    onError: (error: ApiError) => {
      if (error.errors && error.errors.length > 0) {
        error.errors.forEach(err => toast.error(err));
      } else {
        toast.error(error.message || 'Failed to reset password. Please try again.');
      }
    }
  });
};

