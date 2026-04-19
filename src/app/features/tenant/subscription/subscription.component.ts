import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Subscription, SubscriptionPlan } from '../../../core/models';

@Component({ selector: 'app-subscription', templateUrl: './subscription.component.html', styleUrls: ['./subscription.component.scss'] })
export class SubscriptionComponent implements OnInit {
  currentSub: Subscription | null = null;
  plans: SubscriptionPlan[] = [];
  loading = false;
  subscribing = false;
  confirmPlan: SubscriptionPlan | null = null;
  paymentRef = '';

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getMySubscription().subscribe({ next: s => this.currentSub = s, error: () => {} });
    this.api.getPlans().subscribe({
      next: p => { this.plans = p.filter((pl: SubscriptionPlan) => pl.targetRole === 'TENANT' && pl.active); this.loading = false; },
      error: () => this.loading = false
    });
  }

  openConfirm(plan: SubscriptionPlan): void { this.confirmPlan = plan; this.paymentRef = ''; }

  subscribe(): void {
    if (!this.confirmPlan) return;
    this.subscribing = true;
    this.api.subscribe(this.confirmPlan.id, this.paymentRef).subscribe({
      next: s => { this.currentSub = s; this.confirmPlan = null; this.subscribing = false; this.snack.open('Subscribed!', 'OK', { duration: 3000 }); },
      error: () => { this.subscribing = false; this.snack.open('Subscription failed', 'Close', { duration: 3000 }); }
    });
  }

  isActive(plan: SubscriptionPlan): boolean { return !!this.currentSub && this.currentSub.planId === plan.id && this.currentSub.status === 'ACTIVE'; }
  daysLeft(): number { if (!this.currentSub) return 0; return Math.max(0, Math.ceil((new Date(this.currentSub.endDate).getTime() - Date.now()) / 86400000)); }
}
