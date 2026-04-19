import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Area } from '../../../core/models';

@Component({ selector: 'app-property-form', templateUrl: './property-form.component.html', styleUrls: ['./property-form.component.scss'] })
export class PropertyFormComponent implements OnInit {
  form: FormGroup;
  areas: Area[] = [];
  areasLoading = false;
  areasError = '';
  loading = false;
  saving = false;
  editId: string | null = null;
  propertyTypes = ['APARTMENT', 'SUBLET', 'MESS', 'BACHELOR', 'FAMILY'];
  preferredTenantOptions = ['Any', 'Family', 'Bachelor', 'Female Only', 'Male Only', 'Student'];

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute, private snack: MatSnackBar) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      areaId: ['', Validators.required],
      fullAddress: [''],
      rentAmount: [null, [Validators.required, Validators.min(1)]],
      negotiable: [false],
      securityDeposit: [null],
      propertyType: ['APARTMENT', Validators.required],
      bedrooms: [null],
      bathrooms: [null],
      floorNumber: [null],
      totalFloors: [null],
      sizeSqft: [null],
      availableFrom: [null],
      amenities: [''],
      houseRules: [''],
      preferredTenant: ['Any'],
      videoUrl: [''],
      photoUrls: ['']
    });
  }

  ngOnInit(): void {
    this.editId = this.route.snapshot.paramMap.get('id');
    this.loadAreas();
    if (this.editId) {
      this.loading = true;
      this.api.getProperty(this.editId).subscribe({
        next: p => {
          this.form.patchValue({ ...p, photoUrls: p.photoUrls?.join(', ') || '' });
          this.loading = false;
        },
        error: () => { this.loading = false; this.snack.open('Failed to load property', 'Close', { duration: 3000 }); }
      });
    }
  }

  loadAreas(): void {
    this.areasLoading = true;
    this.areasError = '';
    this.api.getAreas().subscribe({
      next: a => { this.areas = a; this.areasLoading = false; },
      error: (e: any) => {
        this.areasLoading = false;
        this.areasError = e.error?.message || `Error ${e.status}: Failed to load areas`;
        this.snack.open(this.areasError, 'Close', { duration: 5000 });
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const val = { ...this.form.value };
    val.photoUrls = val.photoUrls ? val.photoUrls.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [];
    this.saving = true;
    const obs = this.editId ? this.api.updateProperty(this.editId, val) : this.api.createProperty(val);
    obs.subscribe({
      next: () => { this.snack.open(this.editId ? 'Property updated' : 'Property created — pending approval', 'OK', { duration: 3000 }); this.router.navigate(['/owner/properties']); },
      error: () => { this.saving = false; this.snack.open('Failed to save', 'Close', { duration: 3000 }); }
    });
  }

  cancel(): void { this.router.navigate(['/owner/properties']); }
}
