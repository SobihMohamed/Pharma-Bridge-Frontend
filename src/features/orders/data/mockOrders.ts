import { OrderDto } from '../types';

export const MOCK_ORDERS: OrderDto[] = [
  {
    id: 'ord_59284',
    requestId: 'req_123',
    pharmacyId: 'phar_1',
    pharmacyName: 'El-Ezaby Pharmacy',
    pharmacyPhone: '19600',
    status: 'OutForDelivery',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hr ago
    estimatedDeliveryTime: 'In 15 mins',
    subtotal: 205.50,
    deliveryFee: 15.00,
    totalAmount: 220.50,
    deliveryAddressId: 'addr_1',
    hasComplaint: false,
    hasRating: false,
    items: [
      { id: 'item_1', name: 'Panadol Extra', quantity: 2, price: 45.00 },
      { id: 'item_2', name: 'Vitamin C 1000mg', quantity: 1, price: 160.50 }
    ]
  },
  {
    id: 'ord_59283',
    requestId: 'req_122',
    pharmacyId: 'phar_2',
    pharmacyName: 'Seif Pharmacies',
    pharmacyPhone: '19111',
    status: 'Preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(), // 20 mins ago
    estimatedDeliveryTime: 'In 45 mins',
    subtotal: 100.00,
    deliveryFee: 10.00,
    totalAmount: 110.00,
    deliveryAddressId: 'addr_1',
    hasComplaint: false,
    hasRating: false,
    items: [
      { id: 'item_3', name: 'Congestal Tablets', quantity: 1, price: 100.00 }
    ]
  },
  {
    id: 'ord_59282',
    requestId: 'req_120',
    pharmacyId: 'phar_3',
    pharmacyName: 'Roshdy Pharmacies',
    pharmacyPhone: '19999',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString(),
    subtotal: 400.00,
    deliveryFee: 20.00,
    totalAmount: 420.00,
    deliveryAddressId: 'addr_2',
    hasComplaint: false,
    hasRating: false, // User hasn't rated yet, so we can show rating button
    items: [
      { id: 'item_4', name: 'Insulin Glargine', quantity: 1, price: 400.00 }
    ]
  },
  {
    id: 'ord_59281',
    requestId: 'req_119',
    pharmacyId: 'phar_1',
    pharmacyName: 'El-Ezaby Pharmacy',
    pharmacyPhone: '19600',
    status: 'Cancelled',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    subtotal: 50.00,
    deliveryFee: 15.00,
    totalAmount: 65.00,
    deliveryAddressId: 'addr_1',
    hasComplaint: true, // Already complained
    hasRating: false,
    items: [
      { id: 'item_5', name: 'Aspirin 81mg', quantity: 1, price: 50.00 }
    ]
  }
];
