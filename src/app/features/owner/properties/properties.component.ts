import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../../../core/models';

@Component({ selector: 'app-properties', templateUrl: './properties.component.html', styleUrls: ['./properties.component.scss'] })
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = false;
  columns = ['title', 'type', 'rentAmount', 'status', 'boosted', 'views', 'actions'];

  constructor(private api: ApiService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void { this.load(); }
  load(): void { this.loading = true; this.api.getMyProperties().subscribe({ next: r => { this.properties = r.content; this.loading = false; }, error: () => this.loading = false }); }
  edit(p: Property): void { this.router.navigate(['/owner/properties', p.id, 'edit']); }
  delete(p: Property): void {
    if (!confirm('Delete this property?')) return;
    this.api.deleteProperty(p.id).subscribe({ next: () => { this.snack.open('Deleted', 'OK', { duration: 2000 }); this.load(); }, error: () => this.snack.open('Failed', 'Close', { duration: 2000 }) });
  }
}
