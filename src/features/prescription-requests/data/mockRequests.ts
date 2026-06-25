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
        id: 'bid_1',
        pharmacyId: 'phar_1',
        pharmacyName: 'El-Ezaby Pharmacy',
        rating: 4.8,
        totalPrice: 250.50,
        deliveryTime: '30-45 mins',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'item_1', name: 'Panadol Extra', quantity: 2, price: 45.00 },
          { id: 'item_2', name: 'Vitamin C 1000mg', quantity: 1, price: 160.50 }
        ]
      },
      {
        id: 'bid_2',
        pharmacyId: 'phar_2',
        pharmacyName: 'Seif Pharmacies',
        rating: 4.5,
        totalPrice: 245.00,
        deliveryTime: '1-2 hours',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'item_1', name: 'Panadol Extra', quantity: 2, price: 45.00 },
          { id: 'item_2', name: 'Vitamin C 1000mg', quantity: 1, price: 155.00 }
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
        id: 'bid_3',
        pharmacyId: 'phar_3',
        pharmacyName: 'Roshdy Pharmacies',
        rating: 4.6,
        totalPrice: 1200.00,
        deliveryTime: 'Same day',
        status: 'Accepted',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'item_3', name: 'Insulin Glargine', quantity: 3, price: 400.00 }
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
