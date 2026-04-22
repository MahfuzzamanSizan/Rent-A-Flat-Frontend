import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Inquiry } from '../../../core/models';

@Component({ selector: 'app-inquiries', templateUrl: './inquiries.component.html', styleUrls: ['./inquiries.component.scss'] })
export class InquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  loading = false;
  respondingTo: Inquiry | null = null;
  responseMessage = '';
  columns = ['tenant', 'message', 'status', 'createdAt', 'actions'];

  constructor(private api: ApiService, private snack: MatSnackBar, private router: Router) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getOwnerInquiries().subscribe({
      next: r => { this.inquiries = r.content; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openRespond(inq: Inquiry): void { this.respondingTo = inq; this.responseMessage = ''; }

  accept(): void {
    if (!this.respondingTo) return;
    this.api.acceptInquiry(this.respondingTo.id, this.responseMessage).subscribe({
      next: () => { this.respondingTo = null; this.snack.open('Inquiry accepted', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }

  reject(): void {
    if (!this.respondingTo) return;
    this.api.rejectInquiry(this.respondingTo.id, this.responseMessage).subscribe({
      next: () => { this.respondingTo = null; this.snack.open('Inquiry rejected', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }

  openChat(inq: Inquiry): void {
    this.router.navigate(['/owner/chat'], { queryParams: { inquiryId: inq.id } });
  }

  statusColor(status: string): string {
    return { PENDING: 'accent', ACCEPTED: 'primary', REJECTED: 'warn', WITHDRAWN: '' }[status] || '';
  }
}
