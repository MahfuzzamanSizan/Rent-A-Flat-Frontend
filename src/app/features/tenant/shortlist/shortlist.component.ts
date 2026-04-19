import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { Property } from '../../../core/models';

@Component({ selector: 'app-shortlist', templateUrl: './shortlist.component.html', styleUrls: ['./shortlist.component.scss'] })
export class ShortlistComponent implements OnInit {
  properties: Property[] = [];
  loading = false;

  constructor(private api: ApiService, private router: Router, private snack: MatSnackBar) {}
  ngOnInit(): void {
    this.loading = true;
    this.api.getShortlist().subscribe({ next: p => { this.properties = p; this.loading = false; }, error: () => this.loading = false });
  }

  view(id: string): void { this.router.navigate(['/tenant/properties', id]); }

  remove(property: Property): void {
    this.api.removeShortlist(property.id).subscribe({
      next: () => { this.properties = this.properties.filter(p => p.id !== property.id); this.snack.open('Removed', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }
}
