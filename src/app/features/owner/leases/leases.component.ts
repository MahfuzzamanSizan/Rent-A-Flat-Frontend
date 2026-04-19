import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  terminateDialog = false;
  terminationReason = '';
  columns = ['property', 'tenant', 'dates', 'rent', 'status', 'actions'];
  paymentColumns = ['dueDate', 'amount', 'status', 'paidAt', 'method', 'actions'];
  recordPaymentDialog = false;
  paymentAmount: number | null = null;
  paymentMethod = '';
  paymentRef = '';

  constructor(private api: ApiService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getMyLeases().subscribe({
      next: r => { this.leases = r; this.loading = false; },
      error: () => this.loading = false
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

  openRecordPayment(): void { this.recordPaymentDialog = true; this.paymentAmount = null; this.paymentMethod = ''; this.paymentRef = ''; }

  submitPayment(): void {
    if (!this.selectedLease || !this.paymentAmount) return;
    this.api.recordPayment(this.selectedLease.id, { amount: this.paymentAmount, paymentMethod: this.paymentMethod, transactionReference: this.paymentRef }).subscribe({
      next: () => { this.recordPaymentDialog = false; this.snack.open('Payment recorded', 'OK', { duration: 2000 }); this.viewPayments(this.selectedLease!); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }

  openTerminate(lease: Lease): void { this.selectedLease = lease; this.terminateDialog = true; this.terminationReason = ''; }

  terminate(): void {
    if (!this.selectedLease) return;
    this.api.terminateLease(this.selectedLease.id, this.terminationReason).subscribe({
      next: () => { this.terminateDialog = false; this.selectedLease = null; this.snack.open('Lease terminated', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }

  statusColor(s: string): string {
    return { ACTIVE: 'primary', DRAFT: 'accent', TERMINATED: 'warn', EXPIRED: '' }[s] || '';
  }
}
