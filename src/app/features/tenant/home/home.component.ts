import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { Property, Area } from '../../../core/models';

@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.scss'] })
export class HomeComponent implements OnInit {
  properties: Property[] = [];
  areas: Area[] = [];
  totalElements = 0;
  loading = false;
  page = 0; size = 12;
  filterForm: FormGroup;
  propertyTypes = ['APARTMENT', 'SUBLET', 'MESS', 'BACHELOR', 'FAMILY'];

  constructor(private api: ApiService, private fb: FormBuilder, private router: Router) {
    this.filterForm = this.fb.group({
      areaId: [''], propertyType: [''], minRent: [''], maxRent: [''], bedrooms: [''], keyword: ['']
    });
  }

  ngOnInit(): void {
    this.api.getAreas().subscribe({ next: a => this.areas = a, error: () => {} });
    this.load();
  }

  load(): void {
    this.loading = true;
    const f = this.filterForm.value;
    const params: any = { page: this.page, size: this.size };
    if (f.areaId) params['areaId'] = f.areaId;
    if (f.propertyType) params['propertyType'] = f.propertyType;
    if (f.minRent) params['minRent'] = f.minRent;
    if (f.maxRent) params['maxRent'] = f.maxRent;
    if (f.bedrooms) params['bedrooms'] = f.bedrooms;
    if (f.keyword) params['keyword'] = f.keyword;
    this.api.searchProperties(params).subscribe({
      next: r => { this.properties = r.content; this.totalElements = r.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  search(): void { this.page = 0; this.load(); }
  reset(): void { this.filterForm.reset(); this.page = 0; this.load(); }
  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
  viewDetail(id: string): void { this.router.navigate(['/tenant/properties', id]); }
}
