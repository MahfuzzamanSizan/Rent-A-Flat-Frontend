import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AdminDashboard } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: AdminDashboard | null = null;
  loading = true;

  kpis: { label: string; key: keyof AdminDashboard; icon: string; color: string }[] = [
    { label: 'Total Users', key: 'totalUsers', icon: 'people', color: '#1565c0' },
    { label: 'Owners', key: 'totalOwners', icon: 'person', color: '#2e7d32' },
    { label: 'Tenants', key: 'totalTenants', icon: 'person_search', color: '#6a1b9a' },
    { label: 'Properties', key: 'totalProperties', icon: 'apartment', color: '#e65100' },
    { label: 'Pending Listings', key: 'pendingProperties', icon: 'pending', color: '#f57f17' },
    { label: 'Active Leases', key: 'activeLeases', icon: 'description', color: '#00695c' },
    { label: 'Open Complaints', key: 'openComplaints', icon: 'report', color: '#c62828' },
    { label: 'Subscriptions', key: 'totalSubscriptions', icon: 'card_membership', color: '#283593' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAdminDashboard().subscribe({
      next: (d) => { this.stats = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
