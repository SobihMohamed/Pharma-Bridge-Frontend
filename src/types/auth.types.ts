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
