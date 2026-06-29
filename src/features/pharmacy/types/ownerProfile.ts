export type OwnerProfileStatus = 'Pending' | 'Approved' | 'Rejected';

export interface PharmaOwnerProfileDto {
  id: string;
  fullName: string;
  status: OwnerProfileStatus;
  email: string;
  phoneNumber: string;
  nationalId: string;
  nationalIdFront: string;
  nationalIdBack: string;
  syndicateCardImage: string;
}

export interface CreatePharmaOwnerProfileDto {
  nationalId: string;
  nationalIdFront: File;
  nationalIdBack: File;
  syndicateCardImage: File;
}

export interface UpdatePharmaOwnerProfileDto {
  fullName: string;
  phoneNumber: string;
  nationalId: string;
  nationalIdFront: File | null;
  nationalIdBack: File | null;
  syndicateCardImage: File | null;
}
