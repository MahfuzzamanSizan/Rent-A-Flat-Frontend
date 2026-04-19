import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserProfile, Property, Area, Inquiry, Lease, RentPayment,
  Subscription, SubscriptionPlan, Notification, Complaint, Transaction,
  AdminDashboard, PageResponse, Review
} from '../models';

const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ── Users ────────────────────────────────────────────────────────────────────
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API}/users/me`);
  }

  updateMyProfile(data: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API}/users/me`, data);
  }

  getUserProfile(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API}/users/${id}`);
  }

  // ── Properties ───────────────────────────────────────────────────────────────
  searchProperties(params: any): Observable<PageResponse<Property>> {
    return this.http.get<PageResponse<Property>>(`${API}/properties`, { params });
  }

  getProperty(id: string): Observable<Property> {
    return this.http.get<Property>(`${API}/properties/${id}`);
  }

  createProperty(data: any): Observable<Property> {
    return this.http.post<Property>(`${API}/properties`, data);
  }

  updateProperty(id: string, data: any): Observable<Property> {
    return this.http.put<Property>(`${API}/properties/${id}`, data);
  }

  deleteProperty(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/properties/${id}`);
  }

  getMyProperties(page = 0, size = 20): Observable<PageResponse<Property>> {
    return this.http.get<PageResponse<Property>>(`${API}/properties/my`, { params: { page, size } });
  }

  shortlistProperty(id: string): Observable<void> {
    return this.http.post<void>(`${API}/properties/${id}/shortlist`, {});
  }

  removeShortlist(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/properties/${id}/shortlist`);
  }

  getShortlist(): Observable<Property[]> {
    return this.http.get<Property[]>(`${API}/properties/shortlist`);
  }

  // ── Areas ────────────────────────────────────────────────────────────────────
  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${API}/areas`);
  }

  createArea(data: any): Observable<Area> {
    return this.http.post<Area>(`${API}/admin/areas`, data);
  }

  updateArea(id: string, data: any): Observable<Area> {
    return this.http.put<Area>(`${API}/admin/areas/${id}`, data);
  }

  toggleArea(id: string): Observable<Area> {
    return this.http.patch<Area>(`${API}/admin/areas/${id}/toggle`, {});
  }

  // ── Inquiries ────────────────────────────────────────────────────────────────
  createInquiry(data: any): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${API}/inquiries`, data);
  }

  getInquiry(id: string): Observable<Inquiry> {
    return this.http.get<Inquiry>(`${API}/inquiries/${id}`);
  }

  getOwnerInquiries(page = 0, size = 20): Observable<PageResponse<Inquiry>> {
    return this.http.get<PageResponse<Inquiry>>(`${API}/inquiries/owner`, { params: { page, size } });
  }

  getTenantInquiries(page = 0, size = 20): Observable<PageResponse<Inquiry>> {
    return this.http.get<PageResponse<Inquiry>>(`${API}/inquiries/tenant`, { params: { page, size } });
  }

  acceptInquiry(id: string, message?: string): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${API}/inquiries/${id}/accept`, { message });
  }

  rejectInquiry(id: string, message?: string): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${API}/inquiries/${id}/reject`, { message });
  }

  // ── Leases ───────────────────────────────────────────────────────────────────
  createLease(data: any): Observable<Lease> {
    return this.http.post<Lease>(`${API}/leases`, data);
  }

  getMyLeases(): Observable<Lease[]> {
    return this.http.get<Lease[]>(`${API}/leases`);
  }

  getLease(id: string): Observable<Lease> {
    return this.http.get<Lease>(`${API}/leases/${id}`);
  }

  signLease(id: string): Observable<Lease> {
    return this.http.post<Lease>(`${API}/leases/${id}/sign`, {});
  }

  terminateLease(id: string, reason: string): Observable<Lease> {
    return this.http.post<Lease>(`${API}/leases/${id}/terminate`, { reason });
  }

  recordPayment(leaseId: string, data: any): Observable<RentPayment> {
    return this.http.post<RentPayment>(`${API}/leases/${leaseId}/payments`, data);
  }

  getLeasePayments(leaseId: string): Observable<RentPayment[]> {
    return this.http.get<RentPayment[]>(`${API}/leases/${leaseId}/payments`);
  }

  // ── Subscriptions ────────────────────────────────────────────────────────────
  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${API}/subscriptions/plans`);
  }

  getPlan(id: string): Observable<SubscriptionPlan> {
    return this.http.get<SubscriptionPlan>(`${API}/subscriptions/plans/${id}`);
  }

  subscribe(planId: string, paymentReference?: string): Observable<Subscription> {
    return this.http.post<Subscription>(`${API}/subscriptions/subscribe/${planId}`, paymentReference ? { paymentReference } : {});
  }

  getMySubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(`${API}/subscriptions/my`);
  }

  // ── Notifications ─────────────────────────────────────────────────────────────
  getNotifications(page = 0, size = 20): Observable<PageResponse<Notification>> {
    return this.http.get<PageResponse<Notification>>(`${API}/notifications`, { params: { page, size } });
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${API}/notifications/unread-count`);
  }

  markAllRead(): Observable<void> {
    return this.http.post<void>(`${API}/notifications/mark-all-read`, {});
  }

  markOneRead(id: string): Observable<Notification> {
    return this.http.patch<Notification>(`${API}/notifications/${id}/read`, {});
  }

  // ── Reviews ───────────────────────────────────────────────────────────────────
  createReview(data: any): Observable<Review> {
    return this.http.post<Review>(`${API}/reviews`, data);
  }

  getPropertyReviews(propertyId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${API}/reviews/property/${propertyId}`);
  }

  // ── Admin ─────────────────────────────────────────────────────────────────────
  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${API}/admin/dashboard`);
  }

  getAdminUsers(page = 0, size = 20): Observable<PageResponse<UserProfile>> {
    return this.http.get<PageResponse<UserProfile>>(`${API}/admin/users`, { params: { page, size } });
  }

  updateUserStatus(userId: string, status: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${API}/admin/users/${userId}/status`, { status });
  }

  updateKycStatus(userId: string, kycStatus: string, rejectionReason?: string): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${API}/admin/users/${userId}/kyc`, { kycStatus, rejectionReason });
  }

  getAdminProperties(page = 0, size = 20): Observable<PageResponse<Property>> {
    return this.http.get<PageResponse<Property>>(`${API}/admin/properties`, { params: { page, size } });
  }

  getPendingProperties(page = 0, size = 20): Observable<PageResponse<Property>> {
    return this.http.get<PageResponse<Property>>(`${API}/admin/properties/pending`, { params: { page, size } });
  }

  updatePropertyStatus(propertyId: string, status: string, rejectionReason?: string): Observable<Property> {
    return this.http.patch<Property>(`${API}/admin/properties/${propertyId}/status`, { status, rejectionReason });
  }

  getComplaints(status?: string, page = 0, size = 20): Observable<PageResponse<Complaint>> {
    let params: any = { page, size };
    if (status) params['status'] = status;
    return this.http.get<PageResponse<Complaint>>(`${API}/admin/complaints`, { params });
  }

  updateComplaintStatus(id: string, status: string, adminNotes?: string): Observable<Complaint> {
    return this.http.patch<Complaint>(`${API}/admin/complaints/${id}/status`, { status, adminNotes });
  }

  getTransactions(page = 0, size = 20): Observable<PageResponse<Transaction>> {
    return this.http.get<PageResponse<Transaction>>(`${API}/admin/transactions`, { params: { page, size } });
  }

  broadcastNotification(title: string, body: string, targetRole?: string): Observable<void> {
    return this.http.post<void>(`${API}/admin/notifications/broadcast`, { title, body, targetRole });
  }

  getAdminPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<SubscriptionPlan[]>(`${API}/admin/plans`);
  }

  createPlan(data: any): Observable<SubscriptionPlan> {
    return this.http.post<SubscriptionPlan>(`${API}/admin/plans`, data);
  }

  updatePlan(id: string, data: any): Observable<SubscriptionPlan> {
    return this.http.put<SubscriptionPlan>(`${API}/admin/plans/${id}`, data);
  }

  togglePlan(id: string): Observable<SubscriptionPlan> {
    return this.http.patch<SubscriptionPlan>(`${API}/admin/plans/${id}/toggle`, {});
  }

  getAdminAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(`${API}/admin/areas`);
  }
}
