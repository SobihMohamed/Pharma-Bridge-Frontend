export interface PatientProfileDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateProfileDto {
  name: string;
  phone: string;
}
