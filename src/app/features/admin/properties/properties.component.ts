import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../../../core/models';

@Component({ selector: 'app-properties', templateUrl: './properties.component.html', styleUrls: ['./properties.component.scss'] })
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  totalElements = 0;
  loading = false;
  page = 0; size = 20;
  activeTab = 0;
  columns = ['title', 'type', 'rentAmount', 'status', 'boosted', 'createdAt', 'actions'];
  reviewProperty: Property | null = null;
  reviewAction = '';
  reviewReason = '';

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    const obs = this.activeTab === 0 ? this.api.getAdminProperties(this.page, this.size) : this.api.getPendingProperties(this.page, this.size);
    obs.subscribe({ next: r => { this.properties = r.content; this.totalElements = r.totalElements; this.loading = false; }, error: () => this.loading = false });
  }

  onTab(i: number): void { this.activeTab = i; this.page = 0; this.load(); }
  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }

  openReview(p: Property): void { this.reviewProperty = p; this.reviewAction = ''; this.reviewReason = ''; }

  submitReview(): void {
    if (!this.reviewProperty || !this.reviewAction) return;
    this.api.updatePropertyStatus(this.reviewProperty.id, this.reviewAction, this.reviewReason).subscribe({
      next: updated => { Object.assign(this.reviewProperty!, updated); this.reviewProperty = null; this.snack.open('Updated', 'OK', { duration: 2000 }); this.load(); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }
}
