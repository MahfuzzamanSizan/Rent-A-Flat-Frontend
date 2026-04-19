import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Lease, RentPayment } from '../../../core/models';

@Component({ selector: 'app-leases', templateUrl: './leases.component.html', styleUrls: ['./leases.component.scss'] })
export class LeasesComponent implements OnInit {
  leases: Lease[] = [];
  loading = false;
  selectedLease: Lease | null = null;
  payments: RentPayment[] = [];
  paymentsLoading = false;
  columns = ['property', 'owner', 'dates', 'rent', 'status', 'actions'];
  paymentColumns = ['dueDate', 'amount', 'status', 'paidAt'];

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getMyLeases().subscribe({
      next: r => { this.leases = r; this.loading = false; },
      error: () => this.loading = false
    });
  }

  sign(lease: Lease): void {
    this.api.signLease(lease.id).subscribe({
      next: updated => { Object.assign(lease, updated); this.snack.open('Lease signed!', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Failed to sign', 'Close', { duration: 2000 })
    });
  }

  viewPayments(lease: Lease): void {
    this.selectedLease = lease;
    this.paymentsLoading = true;
    this.api.getLeasePayments(lease.id).subscribe({
      next: r => { this.payments = r; this.paymentsLoading = false; },
      error: () => this.paymentsLoading = false
    });
  }

  statusColor(s: string): string {
    return { ACTIVE: 'primary', DRAFT: 'accent', TERMINATED: 'warn', EXPIRED: '' }[s] || '';
  }
}
