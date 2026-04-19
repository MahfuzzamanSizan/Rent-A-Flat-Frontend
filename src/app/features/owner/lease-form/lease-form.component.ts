import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../../../core/models';

@Component({ selector: 'app-lease-form', templateUrl: './lease-form.component.html', styleUrls: ['./lease-form.component.scss'] })
export class LeaseFormComponent implements OnInit {
  form: FormGroup;
  myProperties: Property[] = [];
  saving = false;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private snack: MatSnackBar) {
    this.form = this.fb.group({
      propertyId: ['', Validators.required],
      tenantId: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      rentAmount: [null, [Validators.required, Validators.min(1)]],
      securityDeposit: [0, Validators.required],
      rentDueDay: [5, [Validators.required, Validators.min(1), Validators.max(28)]],
      noticePeriodDays: [30, Validators.required],
      terms: ['']
    });
  }

  ngOnInit(): void {
    this.api.getMyProperties().subscribe({ next: r => this.myProperties = r.content, error: () => {} });
  }

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.api.createLease(this.form.value).subscribe({
      next: () => { this.snack.open('Lease created', 'OK', { duration: 2000 }); this.router.navigate(['/owner/leases']); },
      error: () => { this.saving = false; this.snack.open('Failed to create lease', 'Close', { duration: 3000 }); }
    });
  }

  cancel(): void { this.router.navigate(['/owner/leases']); }
}
