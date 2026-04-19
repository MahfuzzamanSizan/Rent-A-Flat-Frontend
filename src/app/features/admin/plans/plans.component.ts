import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { SubscriptionPlan } from '../../../core/models';

@Component({ selector: 'app-plans', templateUrl: './plans.component.html', styleUrls: ['./plans.component.scss'] })
export class PlansComponent implements OnInit {
  plans: SubscriptionPlan[] = [];
  loading = false;
  showForm = false;
  editingPlan: SubscriptionPlan | null = null;
  form: FormGroup;

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      targetRole: ['OWNER', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      durationDays: [30, Validators.required],
      maxListings: [1], maxPhotos: [3], boostCredits: [0], maxContacts: [3],
      features: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getPlans().subscribe({ next: p => { this.plans = p; this.loading = false; }, error: () => this.loading = false });
  }

  openCreate(): void { this.editingPlan = null; this.form.reset({ targetRole: 'OWNER', price: 0, durationDays: 30, maxListings: 1, maxPhotos: 3, boostCredits: 0, maxContacts: 3 }); this.showForm = true; }

  openEdit(p: SubscriptionPlan): void { this.editingPlan = p; this.form.patchValue(p); this.showForm = true; }

  save(): void {
    if (this.form.invalid) return;
    const obs = this.editingPlan ? this.api.updatePlan(this.editingPlan.id, this.form.value) : this.api.createPlan(this.form.value);
    obs.subscribe({ next: () => { this.showForm = false; this.snack.open('Saved', 'OK', { duration: 2000 }); this.load(); }, error: () => this.snack.open('Failed', 'Close', { duration: 2000 }) });
  }

  toggle(p: SubscriptionPlan): void {
    this.api.togglePlan(p.id).subscribe({ next: updated => { Object.assign(p, updated); this.snack.open('Updated', 'OK', { duration: 2000 }); }, error: () => this.snack.open('Failed', 'Close', { duration: 2000 }) });
  }
}
