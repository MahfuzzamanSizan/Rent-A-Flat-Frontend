import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Property, Review } from '../../../core/models';

@Component({ selector: 'app-property-detail', templateUrl: './property-detail.component.html', styleUrls: ['./property-detail.component.scss'] })
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  reviews: Review[] = [];
  loading = true;
  inquiryDialog = false;
  inquiryMessage = '';
  sendingInquiry = false;
  shortlisted = false;

  constructor(private api: ApiService, private route: ActivatedRoute, private snack: MatSnackBar) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProperty(id).subscribe({
      next: p => { this.property = p; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getPropertyReviews(id).subscribe({ next: r => this.reviews = r, error: () => {} });
    this.api.getShortlist().subscribe({ next: sl => this.shortlisted = sl.some((s: any) => s.id === id), error: () => {} });
  }

  sendInquiry(): void {
    if (!this.property || !this.inquiryMessage.trim()) return;
    this.sendingInquiry = true;
    this.api.createInquiry({ propertyId: this.property.id, message: this.inquiryMessage }).subscribe({
      next: () => { this.inquiryDialog = false; this.sendingInquiry = false; this.snack.open('Inquiry sent!', 'OK', { duration: 3000 }); },
      error: () => { this.sendingInquiry = false; this.snack.open('Failed to send inquiry', 'Close', { duration: 3000 }); }
    });
  }

  toggleShortlist(): void {
    if (!this.property) return;
    const obs = this.shortlisted ? this.api.removeShortlist(this.property.id) : this.api.shortlistProperty(this.property.id);
    obs.subscribe({
      next: () => { this.shortlisted = !this.shortlisted; this.snack.open(this.shortlisted ? 'Added to shortlist' : 'Removed from shortlist', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }

  stars(rating: number): number[] { return Array(Math.round(rating)).fill(0); }
}
