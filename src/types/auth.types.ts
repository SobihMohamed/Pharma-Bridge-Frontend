export interface AuthModelDto {
  message: string;
  isAuthenticated: boolean;
  name: string;
  email: string;
  token: string;
  expireOn: string;
  roles: string[];
}

export type UserRole = "Patient" | "PharmacyOwner" | "Admin";

export interface RegisterDto {
  displayName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgetPasswordDto {
  email: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ResetPasswordDto {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

