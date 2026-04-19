import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../../core/services/api.service';
import { Transaction } from '../../../core/models';

@Component({ selector: 'app-transactions', templateUrl: './transactions.component.html', styleUrls: ['./transactions.component.scss'] })
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  totalElements = 0;
  loading = false;
  page = 0; size = 20;
  columns = ['type', 'amount', 'gateway', 'status', 'createdAt'];
  constructor(private api: ApiService) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.getTransactions(this.page, this.size).subscribe({ next: r => { this.transactions = r.content; this.totalElements = r.totalElements; this.loading = false; }, error: () => this.loading = false });
  }
  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }
}
