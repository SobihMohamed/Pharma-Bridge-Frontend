/**
 * adminService.ts
 * Centralized data access for the admin module. Every function currently
 * returns mock data via a resolved Promise so the pages can already be
 * written against an async API. Swap the bodies for real `fetch`/axios
 * calls once the backend endpoints exist — the page components don't need
 * to change.
 */
import api from "@/lib/api";
import { PaginationResponse } from "@/types/api.types";
import { PatientProfileDto } from "@/features/profile/types";

// ---------- Types ----------

export interface DashboardStats {
  totalPatients: number;
  totalPatientsDeltaPct: number;
  activeBids: number;
  bidsExpiringSoon: number;
  pendingComplaints: number;
  criticalComplaints: number;
  todaysOrders: number;
  fulfillmentRatePct: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  category: string;
  description: string;
  status: "Completed" | "Pending Review" | "Urgent";
  user: string;
}

export type PatientStatus = "Active" | "Pending" | "Suspended";

export interface Patient {
  id: string;
  name: string;
  initials: string;
  phone: string;
  joinDate: string;
  status: PatientStatus;
}

export interface AdminPrescriptionRequestDto {
  id: string | number;
  medicineName: string | null;
  status: string;
  createdAt: string;
  bidsCount: number;
  patientName: string;
  patientPhone: string | null;
  deliveryArea: string;
}

export interface AdminBidItemDto {
  itemName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  isAlternative: boolean;
  alternativeNote: string | null;
}

export interface AdminBidDto {
  id: string | number;
  pharmacyName: string;
  pharmacyPhone: string | null;
  status: string;
  totalPrice: number;
  submittedAt: string;
  items: AdminBidItemDto[];
}

export interface AdminHistoryEntryDto {
  action: string;
  performedBy: string;
  performedAt: string;
  notes: string | null;
}

export interface AdminPrescriptionRequestDetailsDto {
  id: string | number;
  medicineName: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
  imageUrl: string | null;
  patientName: string;
  patientPhone: string | null;
  patientNotes: string | null;
  deliveryArea: string;
  fullAddress: string | null;
  bidsCount: number;
  bids: AdminBidDto[];
  history: AdminHistoryEntryDto[];
}

export interface PlatformComplaintDto {
  id: string | number;
  title: string;
  submittedByName: string;
  status: string;
  orderId: string | number | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ComplaintDetailsDto {
  id: number;
  title: string;
  description: string;
  status: string;
  orderId: number | null;
  createdAt: string;
  resolvedAt: string | null;
  submittedByName: string;
  adminNotes: string | null;
  resolvedByName: string | null;
}

export interface PharmacyProfileDto {
  id: string;
  pharmacyName: string;
  email: string;
  phoneNumber: string | null;
}

export interface AdminOrderDto {
  id: number;
  patientName: string;
  pharmacyName: string;
  amount: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

export interface AdminOrderItemDto {
  itemName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  isAlternative: boolean;
  alternativeNote: string | null;
}

export interface AdminOrderDetailsDto {
  orderId: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  cancelledAt: string | null;
  deliveredAt: string | null;
  completedAt: string | null;
  cancelReason: string | null;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  amount: number;
  patientName: string;
  patientPhone: string | null;
  pharmacyName: string;
  pharmacyPhone: string | null;
  deliveryAddress: string | null;
  items: AdminOrderItemDto[];
}



export type BidStatus = "Accepted" | "Pending" | "Rejected";

export interface Bid {
  id: string;
  requestId: string;
  pharmacyName: string;
  pharmacyInitials: string;
  amount: number;
  status: BidStatus;
}

export interface BidLineItem {
  sku: string;
  medicationName: string;
  dosage: string;
  qty: number;
  unitPrice: number;
}

export interface BidDetails extends Bid {
  reference: string;
  submittedBy: string;
  expiresInLabel: string;
  createdAt: string;
  platformFeePct: number;
  platformFee: number;
  items: BidLineItem[];
  statusHistory: { label: string; timestamp: string; icon: string }[];
  pharmacy: {
    name: string;
    licence: string;
    rating: number;
    address: string;
    phone: string;
    email: string;
  };
}

export type ComplaintStatus = "Open" | "InProgress" | "Resolved" | "Rejected";

export interface Complaint {
  id: string;
  patientName: string;
  patientInitials: string;
  dateReported: string;
  status: ComplaintStatus;
}

export interface ComplaintDetails extends Complaint {
  sourceOrderId: string;
  dateFiled: string;
  description: string;
  evidence: { fileName: string; imageUrl: string }[];
  auditHistory: { label: string; source: string; timestamp: string }[];
}

export type OrderStatus = "Processing" | "In Transit" | "Delivered" | "Cancelled";

export interface Order {
  id: string;
  pharmacyName: string;
  pharmacyId: string;
  patientName: string;
  patientRef: string;
  amount: number;
  status: OrderStatus;
}

export interface OrderDetails {
  id: string;
  linkedBidId: string;
  prescriptionId: string;
  orderedAt: string;
  lifecycle: { label: string; timestamp: string; note?: string; state: "done" | "active" | "pending"; icon: string }[];
  pharmacy: { name: string; address: string; logoUrl?: string; verified: boolean };
  patient: { name: string; id: string; deliveryAddress: string };
  items: { name: string; sku: string; icon: string; qty: number; unitPrice: number }[];
  deliveryInstructions: string;
  requiresColdChain: boolean;
  financials: { subtotal: number; deliveryFee: number; discount: number; discountLabel: string; total: number };
  paymentLabel: string;
}

// ---------- Mock data ----------

const MOCK_STATS: DashboardStats = {
  totalPatients: 12482,
  totalPatientsDeltaPct: 3.2,
  activeBids: 843,
  bidsExpiringSoon: 42,
  pendingComplaints: 18,
  criticalComplaints: 5,
  todaysOrders: 1102,
  fulfillmentRatePct: 92,
};

const MOCK_ACTIVITY: ActivityLogEntry[] = [
  { id: "1", timestamp: "14:22:10", category: "Order Fulfillment", description: "Order #88291 dispatched from Region North", status: "Completed", user: "System_Auto" },
  { id: "2", timestamp: "14:18:45", category: "Bidding", description: "New bid received for Pfizer-01 Lot", status: "Pending Review", user: "External_API" },
  { id: "3", timestamp: "13:55:02", category: "Complaints", description: "High Priority Complaint: Temperature deviation reported", status: "Urgent", user: "J. Doe (Admin)" },
  { id: "4", timestamp: "13:40:12", category: "Patients", description: "New patient record #P-1120 created", status: "Completed", user: "S. Smith (Support)" },
];

const MOCK_PATIENTS: Patient[] = [
  { id: "#PB-9921", name: "Jameson Douglas", initials: "JD", phone: "+1 (555) 012-9921", joinDate: "Oct 12, 2023", status: "Active" },
  { id: "#PB-8843", name: "Maria Rodriguez", initials: "MR", phone: "+1 (555) 098-4432", joinDate: "Nov 05, 2023", status: "Pending" },
  { id: "#PB-7721", name: "Samuel Thompson", initials: "ST", phone: "+1 (555) 432-1100", joinDate: "Nov 18, 2023", status: "Active" },
  { id: "#PB-6651", name: "Elena Kostic", initials: "EK", phone: "+1 (555) 765-4421", joinDate: "Dec 01, 2023", status: "Suspended" },
  { id: "#PB-5542", name: "Aaliyah Bennett", initials: "AB", phone: "+1 (555) 231-8890", joinDate: "Dec 05, 2023", status: "Active" },
  { id: "#PB-5501", name: "George Harrison", initials: "GH", phone: "+1 (555) 887-2231", joinDate: "Jan 12, 2024", status: "Active" },
  { id: "#PB-4492", name: "Linda Carson", initials: "LC", phone: "+1 (555) 112-4455", joinDate: "Jan 15, 2024", status: "Pending" },
  { id: "#PB-3321", name: "Oliver White", initials: "OW", phone: "+1 (555) 998-0021", joinDate: "Feb 02, 2024", status: "Active" },
];

const MOCK_BIDS: Bid[] = [
  { id: "BID-9201-X", requestId: "REQ-4482", pharmacyName: "CVS Health #412", pharmacyInitials: "CV", amount: 1240.5, status: "Accepted" },
  { id: "BID-9202-A", requestId: "REQ-4482", pharmacyName: "Walgreens Specialty", pharmacyInitials: "WG", amount: 1310.0, status: "Pending" },
  { id: "BID-8891-B", requestId: "REQ-4390", pharmacyName: "Rite Aid Pharmacy", pharmacyInitials: "RA", amount: 950.25, status: "Rejected" },
  { id: "BID-9204-K", requestId: "REQ-4485", pharmacyName: "Local Pharma Hub", pharmacyInitials: "LP", amount: 1020.0, status: "Pending" },
  { id: "BID-9110-Z", requestId: "REQ-4401", pharmacyName: "Kinney Drugs Corp", pharmacyInitials: "KC", amount: 2440.0, status: "Rejected" },
];

const MOCK_BID_DETAILS: BidDetails = {
  id: "BID-123",
  reference: "#BID-123-X99",
  requestId: "REQ-4482",
  pharmacyName: "Green Cross Health Solutions",
  pharmacyInitials: "GC",
  amount: 1450.0,
  status: "Pending",
  submittedBy: "Dr. Sarah Jenkins",
  expiresInLabel: "02:14:55",
  createdAt: "Oct 24, 2023 • 14:20",
  platformFeePct: 3,
  platformFee: 45.0,
  items: [
    { sku: "LPI-449-01", medicationName: "Atorvastatin Calcium", dosage: "20mg Tablet", qty: 500, unitPrice: 1.2 },
    { sku: "LPI-882-12", medicationName: "Metformin HCl", dosage: "500mg ER", qty: 1000, unitPrice: 0.45 },
    { sku: "LPI-104-05", medicationName: "Lisinopril", dosage: "10mg Tablet", qty: 800, unitPrice: 0.5 },
  ],
  statusHistory: [
    { label: "Verification Complete", timestamp: "Today, 14:45", icon: "check" },
    { label: "Assigned to Review", timestamp: "Today, 14:25", icon: "assignment_ind" },
  ],
  pharmacy: {
    name: "Green Cross Health Solutions",
    licence: "#PHA-9921-22",
    rating: 4.2,
    address: "4821 Medical Parkway, Austin, TX 78756",
    phone: "(512) 555-0199",
    email: "procurement@greencross.com",
  },
};

const MOCK_COMPLAINTS: Complaint[] = [
  { id: "#PB-98421-C", patientName: "John Doe", patientInitials: "JD", dateReported: "Oct 24, 2023 14:30", status: "Open" },
  { id: "#PB-98319-C", patientName: "Alice Miller", patientInitials: "AM", dateReported: "Oct 24, 2023 11:15", status: "InProgress" },
  { id: "#PB-98255-C", patientName: "Robert King", patientInitials: "RK", dateReported: "Oct 23, 2023 09:45", status: "Resolved" },
  { id: "#PB-98112-C", patientName: "Sarah Williams", patientInitials: "SW", dateReported: "Oct 22, 2023 16:20", status: "Rejected" },
  { id: "#PB-97998-C", patientName: "Michael Brown", patientInitials: "MB", dateReported: "Oct 21, 2023 10:10", status: "Resolved" },
];

const MOCK_COMPLAINT_DETAILS: ComplaintDetails = {
  id: "CMP-456",
  patientName: "John Doe",
  patientInitials: "JD",
  dateReported: "Oct 24, 2023 14:30",
  status: "Open",
  sourceOrderId: "#ORD-88219-PH",
  dateFiled: "Oct 24, 2023 - 14:30 GMT",
  description:
    "The temperature-sensitive insulin shipment arrived with a broken seal. The data logger shows a temperature spike of 12°C during the final leg of transit. We require an immediate replacement and a formal investigation into the cold-chain breach.",
  evidence: [
    { fileName: "seal_damage_01.jpg", imageUrl: "" },
    { fileName: "temp_log_report.png", imageUrl: "" },
  ],
  auditHistory: [
    { label: "Complaint Assigned", source: "System", timestamp: "Oct 24, 14:35" },
    { label: "Evidence Uploaded", source: "Customer Portal", timestamp: "Oct 24, 14:32" },
    { label: "Ticket Created", source: "System", timestamp: "Oct 24, 14:30" },
  ],
};

const MOCK_ORDERS: Order[] = [
  { id: "#ORD-28911", pharmacyName: "CureAll Pharmacy", pharmacyId: "PH-0042", patientName: "Jonathan Harker", patientRef: "P-8821", amount: 245.0, status: "Processing" },
  { id: "#ORD-28912", pharmacyName: "Global Meds", pharmacyId: "PH-0911", patientName: "Mina Murray", patientRef: "P-2210", amount: 1120.5, status: "Delivered" },
  { id: "#ORD-28913", pharmacyName: "Downtown Wellness", pharmacyId: "PH-0112", patientName: "Arthur Holmwood", patientRef: "P-3341", amount: 89.99, status: "In Transit" },
  { id: "#ORD-28914", pharmacyName: "HealthLink Rx", pharmacyId: "PH-4491", patientName: "Lucy Westenra", patientRef: "P-5511", amount: 432.25, status: "Cancelled" },
  { id: "#ORD-28915", pharmacyName: "PharmaPlus", pharmacyId: "PH-0021", patientName: "Quincey Morris", patientRef: "P-9082", amount: 12.5, status: "Processing" },
];

const MOCK_ORDER_DETAILS: OrderDetails = {
  id: "ORD-789",
  linkedBidId: "#BID-4421",
  prescriptionId: "#PR-9003",
  orderedAt: "Oct 24, 2023 • 14:32",
  lifecycle: [
    { label: "Order Created", timestamp: "Oct 24, 14:32", note: "Order #ORD-789 successfully logged.", state: "done", icon: "check" },
    { label: "Payment Confirmed", timestamp: "Oct 24, 14:45", note: "Transaction ID: TXN_882910", state: "done", icon: "check" },
    { label: "Bid Accepted", timestamp: "Oct 24, 16:10", note: "Accepted bid from City Central Pharma.", state: "done", icon: "check" },
    { label: "Dispatched", timestamp: "Oct 25, 09:00", note: "Courier: PharmaLink Express (Tracking: PLX-001)", state: "active", icon: "local_shipping" },
    { label: "Delivered", timestamp: "Pending arrival", state: "pending", icon: "done_all" },
  ],
  pharmacy: { name: "City Central Pharma", address: "421 Healthcare Blvd, Central City", verified: true },
  patient: { name: "Sarah J. Miller", id: "PAT-22019", deliveryAddress: "152 Maple St, Apt 4B, South District" },
  items: [
    { name: "Atorvastatin 20mg", sku: "PH-ATV-020", icon: "pill", qty: 2, unitPrice: 24.0 },
    { name: "Amoxicillin 500mg", sku: "PH-AMX-500", icon: "medication", qty: 1, unitPrice: 12.5 },
    { name: "Sterile Saline Solution", sku: "PH-SLN-100", icon: "vaccines", qty: 5, unitPrice: 5.0 },
  ],
  deliveryInstructions:
    "Please leave with the concierge. Recipient is elderly and may take time to answer the doorbell. Temperature sensitive - please do not leave in direct sunlight.",
  requiresColdChain: true,
  financials: { subtotal: 85.5, deliveryFee: 12.0, discount: 10.0, discountLabel: "Discount (Voucher #PHARM10)", total: 87.5 },
  paymentLabel: "Paid via Visa ending in 4492",
};

// ---------- Service functions (mock async API) ----------

const delay = <T,>(value: T, ms = 200): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const adminService = {
  getDashboardStats: () => delay(MOCK_STATS),
  getRecentActivity: () => delay(MOCK_ACTIVITY),

  getPatients: async (params: { PageIndex: number; PageSize: number; Search?: string }): Promise<PaginationResponse<PatientProfileDto>> => {
    const response = await api.get<PaginationResponse<PatientProfileDto>>('/api/patient-profile/all', {
      params: {
        PageIndex: params.PageIndex,
        PageSize: params.PageSize,
        Search: params.Search || undefined,
      },
    });
    return (response as any).data;
  },

  getBids: () => delay(MOCK_BIDS),
  getBidDetails: (_bidId: string) => delay(MOCK_BID_DETAILS),

  getComplaints: () => delay(MOCK_COMPLAINTS),
  getComplaintDetails: (_complaintId: string) => delay(MOCK_COMPLAINT_DETAILS),
  updateComplaintStatus: (_complaintId: string, _status: ComplaintStatus, _resolutionNotes?: string) =>
    delay({ ok: true }, 800),

  getOrders: async (params: {
    PageIndex: number;
    PageSize: number;
    Search?: string;
    Status?: string;
    FromDate?: string;
    ToDate?: string;
    PharmacyId?: string;
    PatientId?: string;
  }): Promise<PaginationResponse<AdminOrderDto>> => {
    const cleanParams: Record<string, any> = { PageIndex: params.PageIndex, PageSize: params.PageSize };
    if (params.Search) cleanParams.Search = params.Search;
    if (params.Status) cleanParams.Status = params.Status;
    if (params.FromDate) cleanParams.FromDate = params.FromDate;
    if (params.ToDate) cleanParams.ToDate = params.ToDate;
    if (params.PharmacyId) cleanParams.PharmacyId = params.PharmacyId;
    if (params.PatientId) cleanParams.PatientId = params.PatientId;

    const response = await api.get<PaginationResponse<AdminOrderDto>>(
      '/api/orders/admin',
      { params: cleanParams }
    );
    return (response as any).data;
  },
  getOrderDetails: async (orderId: string | number): Promise<AdminOrderDetailsDto> => {
    const response = await api.get<AdminOrderDetailsDto>(`/api/orders/admin/${orderId}`);
    return (response as any).data;
  },

  getPrescriptionRequests: async (params: {
    PageIndex: number;
    PageSize: number;
    Search?: string;
    Status?: string;
    PatientId?: string;
    FromDate?: string;
    ToDate?: string;
    RadiusInKm?: number;
  }): Promise<PaginationResponse<AdminPrescriptionRequestDto>> => {
    // Strip undefined/empty values so they don't appear as query params
    const cleanParams: Record<string, any> = { PageIndex: params.PageIndex, PageSize: params.PageSize };
    if (params.Search) cleanParams.Search = params.Search;
    if (params.Status) cleanParams.Status = params.Status;
    if (params.PatientId) cleanParams.PatientId = params.PatientId;
    if (params.FromDate) cleanParams.FromDate = params.FromDate;
    if (params.ToDate) cleanParams.ToDate = params.ToDate;
    if (params.RadiusInKm !== undefined && params.RadiusInKm > 0) cleanParams.RadiusInKm = params.RadiusInKm;

    const response = await api.get<PaginationResponse<AdminPrescriptionRequestDto>>(
      '/api/admin/prescription-requests',
      { params: cleanParams },
    );
    return (response as any).data;
  },

  getPrescriptionRequestDetails: async (id: string | number): Promise<AdminPrescriptionRequestDetailsDto> => {
    const response = await api.get<AdminPrescriptionRequestDetailsDto>(
      `/api/admin/prescription-requests/${id}`,
    );
    return (response as any).data;
  },

  getPlatformComplaints: async (params: {
    PageIndex: number;
    PageSize: number;
    Search?: string;
    Status?: string;
    PharmacyId?: string;
  }): Promise<PaginationResponse<PlatformComplaintDto>> => {
    const cleanParams: Record<string, any> = { PageIndex: params.PageIndex, PageSize: params.PageSize };
    if (params.Search) cleanParams.Search = params.Search;
    if (params.Status) cleanParams.Status = params.Status;
    if (params.PharmacyId) cleanParams.PharmacyId = params.PharmacyId;

    const response = await api.get<PaginationResponse<PlatformComplaintDto>>(
      '/api/complaints/platform-complaints',
      { params: cleanParams },
    );
    return (response as any).data;
  },

  getAllPharmaciesForDropdown: async (): Promise<PaginationResponse<PharmacyProfileDto>> => {
    // Try /api/pharmacy-profile/all, fallback to /api/pharmacy/all or empty if needed
    try {
      const response = await api.get<PaginationResponse<PharmacyProfileDto>>('/api/pharmacy-profile/all', {
        params: { PageIndex: 1, PageSize: 200 },
      });
      return (response as any).data;
    } catch (e) {
      try {
        const response2 = await api.get<PaginationResponse<PharmacyProfileDto>>('/api/pharmacy/all', {
          params: { PageIndex: 1, PageSize: 200 },
        });
        return (response2 as any).data;
      } catch (e2) {
        return { data: [], totalCount: 0, pageIndex: 1, pageSize: 200, totalPages: 0 } as any;
      }
    }
  },

  getAllPatientsForDropdown: async (): Promise<PaginationResponse<PatientProfileDto>> => {
    const response = await api.get<PaginationResponse<PatientProfileDto>>('/api/patient-profile/all', {
      params: { PageIndex: 1, PageSize: 200 },
    });
    return (response as any).data;
  },

  getComplaintById: async (id: string | number): Promise<ComplaintDetailsDto> => {
    const response = await api.get<ComplaintDetailsDto>(`/api/complaints/${id}`);
    return (response as any).data;
  },

  updateComplaintStatusApi: async (id: string | number, payload: { status: string; adminNotes: string }): Promise<void> => {
    await api.put(`/api/complaints/${id}/status`, payload);
  },
};
