import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Inquiry } from '../../../core/models';

@Component({ selector: 'app-inquiries', templateUrl: './inquiries.component.html', styleUrls: ['./inquiries.component.scss'] })
export class InquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  loading = false;
  columns = ['property', 'message', 'status', 'response', 'createdAt', 'actions'];

  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void {
    this.loading = true;
    this.api.getTenantInquiries().subscribe({
      next: r => { this.inquiries = r.content; this.loading = false; },
      error: () => this.loading = false
    });
  }

  viewProperty(propertyId: string): void { this.router.navigate(['/tenant/properties', propertyId]); }

  openChat(inq: Inquiry): void {
    this.router.navigate(['/tenant/chat'], { queryParams: { inquiryId: inq.id } });
  }

  statusColor(s: string): string {
    return { PENDING: 'accent', ACCEPTED: 'primary', REJECTED: 'warn', WITHDRAWN: '' }[s] || '';
  }
}
