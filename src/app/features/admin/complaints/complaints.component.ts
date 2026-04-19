import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Complaint } from '../../../core/models';

@Component({ selector: 'app-complaints', templateUrl: './complaints.component.html', styleUrls: ['./complaints.component.scss'] })
export class ComplaintsComponent implements OnInit {
  complaints: Complaint[] = [];
  totalElements = 0;
  loading = false;
  page = 0; size = 20;
  filterStatus = '';
  columns = ['type', 'description', 'status', 'createdAt', 'actions'];
  reviewComplaint: Complaint | null = null;
  newStatus = '';
  adminNotes = '';
  statuses = ['OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'];

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getComplaints(this.filterStatus || undefined, this.page, this.size).subscribe({
      next: r => { this.complaints = r.content; this.totalElements = r.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }

  openReview(c: Complaint): void { this.reviewComplaint = c; this.newStatus = c.status; this.adminNotes = c.adminNotes || ''; }

  submit(): void {
    if (!this.reviewComplaint) return;
    this.api.updateComplaintStatus(this.reviewComplaint.id, this.newStatus, this.adminNotes).subscribe({
      next: () => { this.reviewComplaint = null; this.snack.open('Updated', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }
}
