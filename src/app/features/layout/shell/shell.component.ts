import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  role = '';
  fullName = '';
  unreadCount = 0;
  navItems: NavItem[] = [];

  adminNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Users', icon: 'people', route: '/admin/users' },
    { label: 'Properties', icon: 'apartment', route: '/admin/properties' },
    { label: 'Complaints', icon: 'report', route: '/admin/complaints' },
    { label: 'Transactions', icon: 'receipt_long', route: '/admin/transactions' },
    { label: 'Plans', icon: 'card_membership', route: '/admin/plans' },
    { label: 'Areas', icon: 'map', route: '/admin/areas' },
    { label: 'Broadcast', icon: 'campaign', route: '/admin/broadcast' },
  ];

  ownerNav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/owner/dashboard' },
    { label: 'My Properties', icon: 'apartment', route: '/owner/properties' },
    { label: 'Inquiries', icon: 'question_answer', route: '/owner/inquiries' },
    { label: 'Leases', icon: 'description', route: '/owner/leases' },
    { label: 'Subscription', icon: 'card_membership', route: '/owner/subscription' },
  ];

  tenantNav: NavItem[] = [
    { label: 'Browse Properties', icon: 'search', route: '/tenant/home' },
    { label: 'My Inquiries', icon: 'question_answer', route: '/tenant/inquiries' },
    { label: 'My Leases', icon: 'description', route: '/tenant/leases' },
    { label: 'Shortlist', icon: 'favorite', route: '/tenant/shortlist' },
    { label: 'Subscription', icon: 'card_membership', route: '/tenant/subscription' },
  ];

  constructor(private auth: AuthService, private api: ApiService, public router: Router) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    this.role = user?.role || '';
    this.fullName = user?.fullName || user?.phone || '';
    if (this.role === 'ADMIN') this.navItems = this.adminNav;
    else if (this.role === 'OWNER') this.navItems = this.ownerNav;
    else this.navItems = this.tenantNav;

    this.api.getUnreadCount().subscribe(r => this.unreadCount = r.count);
  }

  logout(): void { this.auth.logout(); }
}
