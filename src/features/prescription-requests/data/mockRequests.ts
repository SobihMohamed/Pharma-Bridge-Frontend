import { PrescriptionRequestDetailsDto } from '../types';

export const MOCK_REQUESTS: PrescriptionRequestDetailsDto[] = [
  {
    id: 'req_123',
    status: 'HasBids',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 22).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    medicineName: null,
    patientNotes: 'Please ensure generic alternatives are provided if original is not available.',
    deliveryAddressId: 'addr_1',
    deliveryArea: 'Cairo - Home',
    bidsCount: 2,
    bids: [
      {
        id: 1,
        totalPrice: 250.50,
        deliveryFee: 15.00,
        status: 'Pending',
        notes: 'We have generic alternatives for Vitamin C.',
        submittedAt: new Date().toISOString(),
        deliveryTimeInMinutes: 30,
        pharmacyName: 'El-Ezaby Pharmacy',
        pharmacyRating: 4.8,
        bidItems: [
          { id: 101, itemName: 'Panadol Extra', quantity: 2, unitPrice: 22.50, isAlternative: false, lineTotal: 45.00 },
          { id: 102, itemName: 'Vitamin C 1000mg', quantity: 1, unitPrice: 160.50, isAlternative: true, alternativeNote: 'C-Retard generic', lineTotal: 160.50 }
        ]
      },
      {
        id: 2,
        totalPrice: 245.00,
        deliveryFee: 0,
        status: 'Pending',
        notes: null,
        submittedAt: new Date().toISOString(),
        deliveryTimeInMinutes: 60,
        pharmacyName: 'Seif Pharmacies',
        pharmacyRating: 4.5,
        bidItems: [
          { id: 201, itemName: 'Panadol Extra', quantity: 2, unitPrice: 22.50, isAlternative: false, lineTotal: 45.00 },
          { id: 202, itemName: 'Vitamin C 1000mg', quantity: 1, unitPrice: 155.00, isAlternative: false, lineTotal: 155.00 }
        ]
      }
    ]
  },
  {
    id: 'req_124',
    status: 'Pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 23.5).toISOString(),
    imageUrl: null,
    medicineName: 'Augmentin 1g',
    patientNotes: 'I need 2 boxes of Augmentin 1g. Fast delivery please.',
    deliveryAddressId: 'addr_1',
    deliveryArea: 'Cairo - Home',
    bidsCount: 0,
    bids: []
  },
  {
    id: 'req_125',
    status: 'Closed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800',
    medicineName: 'Insulin Glargine',
    patientNotes: 'Monthly diabetes medication.',
    deliveryAddressId: 'addr_2',
    deliveryArea: 'Alexandria - Work',
    bidsCount: 1,
    bids: [
      {
        id: 3,
        totalPrice: 1200.00,
        deliveryFee: 0,
        status: 'Accepted',
        notes: null,
        submittedAt: new Date().toISOString(),
        deliveryTimeInMinutes: 120,
        pharmacyName: 'Roshdy Pharmacies',
        pharmacyRating: 4.6,
        bidItems: [
          { id: 301, itemName: 'Insulin Glargine', quantity: 3, unitPrice: 400.00, isAlternative: false, lineTotal: 1200.00 }
        ]
      }
    ]
  },
  {
    id: 'req_126',
    status: 'Cancelled',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    imageUrl: null,
    medicineName: 'Panadol Extra',
    patientNotes: 'Needed it yesterday but got it from a local store.',
    deliveryAddressId: 'addr_1',
    deliveryArea: 'Cairo - Home',
    bidsCount: 0,
    bids: []
  }
];
