import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { Property, Review, Lease } from '../../../core/models';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  property: Property | null = null;
  reviews: Review[] = [];
  myLeases: Lease[] = [];
  loading = true;
  inquiryDialog = false;
  inquiryMessage = '';
  sendingInquiry = false;
  shortlisted = false;

  // Review form
  showReviewForm = false;
  reviewRating = 0;
  reviewComment = '';
  submittingReview = false;
  hoverRating = 0;
  eligibleLeaseId: string | null = null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getProperty(id).subscribe({
      next: p => { this.property = p; this.loading = false; },
      error: () => this.loading = false
    });
    this.api.getPropertyReviews(id).subscribe({ next: r => this.reviews = r, error: () => {} });
    this.api.getShortlist().subscribe({ next: sl => this.shortlisted = sl.some((s: any) => s.id === id), error: () => {} });

    if (this.auth.currentUser?.role === 'TENANT') {
      this.api.getMyLeases().subscribe({
        next: leases => {
          const ended = leases.find(l =>
            l.propertyId === id &&
            (l.status === 'TERMINATED' || l.status === 'EXPIRED') &&
            !this.reviews.some(r => r.leaseId === l.id)
          );
          if (ended) this.eligibleLeaseId = ended.id;
        },
        error: () => {}
      });
    }
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

  submitReview(): void {
    if (!this.eligibleLeaseId || this.reviewRating === 0) return;
    this.submittingReview = true;
    this.api.createReview({
      leaseId: this.eligibleLeaseId,
      rating: this.reviewRating,
      comment: this.reviewComment || null
    }).subscribe({
      next: r => {
        this.reviews.push(r);
        this.showReviewForm = false;
        this.eligibleLeaseId = null;
        this.submittingReview = false;
        this.snack.open('Review submitted!', 'OK', { duration: 3000 });
      },
      error: () => { this.submittingReview = false; this.snack.open('Failed to submit review', 'Close', { duration: 3000 }); }
    });
  }

  stars(rating: number): number[] { return Array(Math.round(rating)).fill(0); }
  emptyStars(rating: number): number[] { return Array(5 - Math.round(rating)).fill(0); }
  ratingStars(n: number): string[] { return Array(5).fill(0).map((_, i) => i < n ? 'star' : 'star_border'); }

  get averageRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
  }
}
