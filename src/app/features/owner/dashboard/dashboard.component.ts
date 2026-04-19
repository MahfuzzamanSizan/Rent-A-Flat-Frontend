import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property, Inquiry, Lease, Subscription } from '../../../core/models';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html', styleUrls: ['./dashboard.component.scss'] })
export class DashboardComponent implements OnInit {
  properties: Property[] = [];
  inquiries: Inquiry[] = [];
  leases: Lease[] = [];
  subscription: Subscription | null = null;
  loading = true;
  fullName = '';

  constructor(private api: ApiService, private auth: AuthService) {}
  ngOnInit(): void {
    this.fullName = this.auth.currentUser?.fullName || '';
    Promise.all([
      this.api.getMyProperties().toPromise(),
      this.api.getOwnerInquiries().toPromise(),
      this.api.getMyLeases().toPromise(),
    ]).then(([props, inqs, leases]) => {
      this.properties = (props as any)?.content || [];
      this.inquiries = (inqs as any)?.content || [];
      this.leases = leases as Lease[] || [];
      this.loading = false;
    }).catch(() => this.loading = false);
    this.api.getMySubscription().subscribe({ next: s => this.subscription = s, error: () => {} });
  }

  get activeProperties() { return this.properties.filter(p => p.status === 'APPROVED'); }
  get pendingInquiries() { return this.inquiries.filter(i => i.status === 'PENDING'); }
  get activeLeases() { return this.leases.filter(l => l.status === 'ACTIVE'); }
}
