export type ComplaintStatus = 'Pending' | 'InProgress' | 'Resolved';

export interface CreateComplaintDto {
  orderId: string;
  subject: string;
  description: string;
  images?: File[];
}

export interface ComplaintDto {
  id: string;
  orderReference: string;
  pharmacyName: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  date: string;
  adminReply?: string;
}

export interface RatingDto {
  orderId: string;
  pharmacyId: string;
  score: number;
  review?: string;
  createdAt: string;
}
