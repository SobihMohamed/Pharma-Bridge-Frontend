import { ComplaintDto } from '../types';

export const MOCK_COMPLAINTS: ComplaintDto[] = [
  {
    id: 'cmp_101',
    orderReference: 'ORD-9912',
    pharmacyName: 'El-Ezaby Pharmacy',
    title: 'Wrong Items Delivered',
    description: 'I ordered Panadol Extra but received regular Panadol instead. Please resolve this as soon as possible.',
    status: 'Pending',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'cmp_102',
    orderReference: 'ORD-9850',
    pharmacyName: 'Seif Pharmacies',
    title: 'Late Delivery',
    description: 'The estimated delivery time was 45 mins, but the order arrived after 2 hours without any prior notice.',
    status: 'InProgress',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    adminReply: 'We apologize for the inconvenience. We have contacted the pharmacy to investigate the delay. Our team will follow up with you shortly.',
  },
  {
    id: 'cmp_103',
    orderReference: 'ORD-9701',
    pharmacyName: 'Roshdy Pharmacies',
    title: 'Damaged Packaging',
    description: 'The medicine box was completely crushed when it arrived. The blister packs inside seem intact but I am concerned about the quality.',
    status: 'Resolved',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    adminReply: 'We sincerely apologize for this experience. A full refund has been issued to your original payment method, and a replacement has been dispatched free of charge.',
  }
];
