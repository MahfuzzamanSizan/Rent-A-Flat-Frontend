export interface AuthResponse {
  userId: string;
  phone: string;
  fullName: string;
  role: 'ADMIN' | 'OWNER' | 'TENANT';
  newUser: boolean;
  accessToken: string;
  refreshToken: string;
  devOtp?: string;
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  fullName: string;
  role: 'ADMIN' | 'OWNER' | 'TENANT';
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  profilePhotoUrl?: string;
  occupation?: string;
  incomeRange?: string;
  active: boolean;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  areaId: string;
  fullAddress?: string;
  latitude?: number;
  longitude?: number;
  rentAmount: number;
  negotiable: boolean;
  securityDeposit?: number;
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  floorNumber?: number;
  totalFloors?: number;
  sizeSqft?: number;
  availableFrom?: string;
  amenities?: string[];
  houseRules?: string;
  preferredTenant?: string;
  videoUrl?: string;
  status: PropertyStatus;
  rejectionReason?: string;
  approvedAt?: string;
  boosted: boolean;
  boostUntil?: string;
  viewsCount: number;
  inquiriesCount?: number;
  shortlistsCount: number;
  photoUrls?: string[];
  createdAt: string;
  updatedAt?: string;
}

export type PropertyType = 'APARTMENT' | 'SUBLET' | 'MESS' | 'BACHELOR' | 'FAMILY';
export type PropertyStatus = 'PENDING' | 'APPROVED' | 'RENTED' | 'REJECTED' | 'EXPIRED';

export interface Area {
  id: string;
  city: string;
  district: string;
  areaName: string;
  subArea?: string;
  latitude?: number;
  longitude?: number;
  active: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  tenantId: string;
  propertyId: string;
  ownerId: string;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  ownerResponseMessage?: string;
  respondedAt?: string;
  chatThreadId?: string;
  createdAt: string;
}

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  securityDeposit: number;
  rentDueDay: number;
  noticePeriodDays: number;
  terms?: string;
  status: 'DRAFT' | 'ACTIVE' | 'TERMINATED' | 'EXPIRED';
  ownerSignedAt?: string;
  tenantSignedAt?: string;
  terminationReason?: string;
  terminatedById?: string;
  terminatedAt?: string;
  leaseDocumentUrl?: string;
  createdAt: string;
}

export interface RentPayment {
  id: string;
  leaseId: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  transactionReference?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED';
  receiptUrl?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentReference?: string;
  createdAt: string;
  plan?: SubscriptionPlan;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  targetRole: 'OWNER' | 'TENANT';
  price: number;
  durationDays: number;
  maxListings: number;
  maxPhotos: number;
  boostCredits: number;
  maxContacts: number;
  features?: Record<string, unknown>;
  active: boolean;
  createdAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  referenceId?: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  filedById: string;
  againstId: string;
  propertyId?: string;
  complaintType: string;
  description: string;
  evidenceUrls?: string[];
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  gateway?: string;
  gatewayReference?: string;
  status: string;
  createdAt: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  totalProperties: number;
  pendingProperties: number;
  activeLeases: number;
  openComplaints: number;
  totalSubscriptions: number;
  totalRevenue: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  targetId: string;
  propertyId?: string;
  leaseId: string;
  rating: number;
  comment?: string;
  published: boolean;
  createdAt: string;
}
