import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Area } from '../../../core/models';

@Component({ selector: 'app-areas', templateUrl: './areas.component.html', styleUrls: ['./areas.component.scss'] })
export class AreasComponent implements OnInit {
  areas: Area[] = [];
  loading = false;
  showForm = false;
  editingArea: Area | null = null;
  form: FormGroup;
  columns = ['city', 'district', 'areaName', 'subArea', 'active', 'actions'];

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({ city: ['', Validators.required], district: ['', Validators.required], areaName: ['', Validators.required], subArea: [''] });
  }
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.api.getAdminAreas().subscribe({ next: a => { this.areas = a; this.loading = false; }, error: () => this.loading = false }); }
  openCreate(): void { this.editingArea = null; this.form.reset(); this.showForm = true; }
  openEdit(a: Area): void { this.editingArea = a; this.form.patchValue(a); this.showForm = true; }
  save(): void {
    if (this.form.invalid) return;
    const obs = this.editingArea ? this.api.updateArea(this.editingArea.id, this.form.value) : this.api.createArea(this.form.value);
    obs.subscribe({ next: () => { this.showForm = false; this.snack.open('Saved', 'OK', { duration: 2000 }); this.load(); }, error: () => this.snack.open('Failed', 'Close', { duration: 2000 }) });
  }
  toggle(a: Area): void { this.api.toggleArea(a.id).subscribe({ next: updated => { Object.assign(a, updated); }, error: () => this.snack.open('Failed', 'Close', { duration: 2000 }) }); }
}
