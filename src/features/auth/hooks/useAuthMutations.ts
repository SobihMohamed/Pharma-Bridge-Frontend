import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { ApiError } from '@/types/api.types';
import { RegisterDto, LoginDto, ForgetPasswordDto, VerifyOtpDto, ResetPasswordDto } from '@/types/auth.types';

// Helper to extract and display backend validation errors
const displayBackendErrors = (error: any, defaultMessage: string) => {
  // Safely navigate the error object, handling both AxiosError structure and our ApiError structure
  const backendErrors = error?.response?.data?.errors || error?.errors;
  let errorMessages: string[] = [];

  if (backendErrors) {
    if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
      // ASP.NET Core ValidationProblemDetails maps fields to arrays of strings
      Object.values(backendErrors).forEach((messages: any) => {
        if (Array.isArray(messages)) {
          errorMessages.push(...messages);
        } else if (typeof messages === 'string') {
          errorMessages.push(messages);
        }
      });
    } else if (Array.isArray(backendErrors)) {
      // Fallback if errors is just a string array
      errorMessages = backendErrors;
    }
  }

  if (errorMessages.length > 0) {
    // Display a clean, multi-line error Toast
    toast.error('Validation Error', {
      description: errorMessages.join('\n\n'),
      duration: 6000,
    });
  } else {
    toast.error(error?.message || defaultMessage);
  }
};

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterDto) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data);
      toast.success('Account Created Successfully');
      if (data.roles?.includes('PharmacyOwner')) {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/profile');
      }
    },
    onError: (error: any) => {
      displayBackendErrors(error, 'Registration failed. Please try again.');
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
      toast.success('Logged in successfully!');
      if (data.roles?.includes('PharmacyOwner')) {
        navigate('/pharmacy/dashboard');
      } else {
        navigate('/profile');
      }
    },
    onError: (error: any) => {
      displayBackendErrors(error, 'Login failed. Please check your credentials.');
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
    onError: (error: any) => {
      displayBackendErrors(error, 'Failed to process request. Please try again.');
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
    onError: (error: any) => {
      toast.error(error?.message || 'Invalid or incorrect OTP.');
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
    onError: (error: any) => {
      displayBackendErrors(error, 'Failed to reset password. Please try again.');
    }
  });
};
