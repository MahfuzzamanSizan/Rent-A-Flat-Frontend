import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { Notification } from '../../../core/models';

interface NavItem { label: string; icon: string; route: string; }

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':   'Dashboard',
  '/admin/users':       'User Management',
  '/admin/properties':  'Property Listings',
  '/admin/complaints':  'Complaints',
  '/admin/transactions':'Transactions',
  '/admin/plans':       'Subscription Plans',
  '/admin/areas':       'Area Management',
  '/admin/broadcast':   'Broadcast',
  '/owner/dashboard':   'Dashboard',
  '/owner/properties':  'My Properties',
  '/owner/inquiries':   'Inquiries',
  '/owner/leases':      'Leases',
  '/owner/subscription':'Subscription',
  '/owner/chat':        'Chat',
  '/tenant/home':       'Browse Properties',
  '/tenant/inquiries':  'My Inquiries',
  '/tenant/leases':     'My Leases',
  '/tenant/shortlist':  'Shortlist',
  '/tenant/subscription':'Subscription',
  '/tenant/chat':       'Chat',
};

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit, OnDestroy {
  role = '';
  fullName = '';
  unreadCount = 0;
  navItems: NavItem[] = [];
  currentPageTitle = 'RentEase';

  notifications: Notification[] = [];
  showNotifications = false;
  loadingNotifications = false;

  private pollInterval: any;

  adminNav: NavItem[] = [
    { label: 'Dashboard',    icon: 'dashboard',        route: '/admin/dashboard' },
    { label: 'Users',        icon: 'people',           route: '/admin/users' },
    { label: 'Properties',   icon: 'apartment',        route: '/admin/properties' },
    { label: 'Complaints',   icon: 'report_problem',   route: '/admin/complaints' },
    { label: 'Transactions', icon: 'receipt_long',     route: '/admin/transactions' },
    { label: 'Plans',        icon: 'card_membership',  route: '/admin/plans' },
    { label: 'Areas',        icon: 'map',              route: '/admin/areas' },
    { label: 'Broadcast',    icon: 'campaign',         route: '/admin/broadcast' },
  ];

  ownerNav: NavItem[] = [
    { label: 'Dashboard',    icon: 'dashboard',        route: '/owner/dashboard' },
    { label: 'My Properties',icon: 'apartment',        route: '/owner/properties' },
    { label: 'Inquiries',    icon: 'question_answer',  route: '/owner/inquiries' },
    { label: 'Leases',       icon: 'description',      route: '/owner/leases' },
    { label: 'Chat',         icon: 'chat',             route: '/owner/chat' },
    { label: 'Subscription', icon: 'card_membership',  route: '/owner/subscription' },
  ];

  tenantNav: NavItem[] = [
    { label: 'Browse Properties', icon: 'search',         route: '/tenant/home' },
    { label: 'My Inquiries',      icon: 'question_answer',route: '/tenant/inquiries' },
    { label: 'My Leases',         icon: 'description',    route: '/tenant/leases' },
    { label: 'Chat',              icon: 'chat',           route: '/tenant/chat' },
    { label: 'Shortlist',         icon: 'favorite',       route: '/tenant/shortlist' },
    { label: 'Subscription',      icon: 'card_membership',route: '/tenant/subscription' },
  ];

  constructor(private auth: AuthService, private api: ApiService, public router: Router) {}

  ngOnInit(): void {
    const user = this.auth.currentUser;
    this.role     = user?.role || '';
    this.fullName = user?.fullName || user?.phone || '';

    if      (this.role === 'ADMIN')  this.navItems = this.adminNav;
    else if (this.role === 'OWNER')  this.navItems = this.ownerNav;
    else                             this.navItems = this.tenantNav;

    this.refreshUnreadCount();
    this.pollInterval = setInterval(() => this.refreshUnreadCount(), 30000);

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.currentPageTitle = this.getPageTitle();
    });
    this.currentPageTitle = this.getPageTitle();
  }

  ngOnDestroy(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  getPageTitle(): string {
    const url = this.router.url.split('?')[0].split('#')[0];
    return PAGE_TITLES[url] || 'RentEase';
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) this.loadNotifications();
  }

  loadNotifications(): void {
    this.loadingNotifications = true;
    this.api.getNotifications(0, 15).subscribe({
      next: r  => { this.notifications = r.content; this.loadingNotifications = false; },
      error: () => this.loadingNotifications = false
    });
  }

  markAllRead(): void {
    this.api.markAllRead().subscribe(() => {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    });
  }

  markOneRead(n: Notification): void {
    if (!n.read) {
      this.api.markOneRead(n.id).subscribe(() => {
        n.read = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      });
    }
  }

  private refreshUnreadCount(): void {
    this.api.getUnreadCount().subscribe({ next: r => this.unreadCount = r.count, error: () => {} });
  }

  logout(): void { this.auth.logout(); }
}
