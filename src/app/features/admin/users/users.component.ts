import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';
import { UserProfile } from '../../../core/models';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  users: UserProfile[] = [];
  totalElements = 0;
  loading = false;
  page = 0;
  size = 20;
  columns = ['fullName', 'phone', 'role', 'kycStatus', 'active', 'createdAt', 'actions'];

  kycDialogUser: UserProfile | null = null;
  kycAction = '';
  kycReason = '';

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.getAdminUsers(this.page, this.size).subscribe({
      next: r => { this.users = r.content; this.totalElements = r.totalElements; this.loading = false; },
      error: () => this.loading = false
    });
  }

  onPage(e: PageEvent): void { this.page = e.pageIndex; this.size = e.pageSize; this.load(); }

  toggleStatus(u: UserProfile): void {
    const newStatus = u.active ? 'SUSPENDED' : 'ACTIVE';
    this.api.updateUserStatus(u.id, newStatus).subscribe({
      next: updated => { Object.assign(u, updated); this.snack.open('Status updated', 'OK', { duration: 2000 }); },
      error: () => this.snack.open('Failed to update', 'Close', { duration: 2000 })
    });
  }

  openKycDialog(u: UserProfile): void { this.kycDialogUser = u; this.kycAction = ''; this.kycReason = ''; }

  submitKyc(): void {
    if (!this.kycDialogUser || !this.kycAction) return;
    this.api.updateKycStatus(this.kycDialogUser.id, this.kycAction, this.kycReason).subscribe({
      next: updated => {
        Object.assign(this.kycDialogUser!, updated);
        this.kycDialogUser = null;
        this.snack.open('KYC updated', 'OK', { duration: 2000 });
      },
      error: () => this.snack.open('Failed', 'Close', { duration: 2000 })
    });
  }
}
