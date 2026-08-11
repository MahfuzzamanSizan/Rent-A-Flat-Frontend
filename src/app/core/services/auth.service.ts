import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponse, UserProfile } from '../models';

//const API = 'http://localhost:8080/api/v1';
const API = 'https://rent-a-flat-6qz5.onrender.com/api/v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthResponse | null {
    const u = localStorage.getItem('auth');
    return u ? JSON.parse(u) : null;
  }

  get currentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUser?.accessToken;
  }

  get role(): string {
    return this.currentUser?.role ?? '';
  }

  private normalizePhone(phone: string): string {
    // Convert +8801XXXXXXXXX → 01XXXXXXXXX
    return phone.replace(/^\+880/, '0').trim();
  }

  sendOtp(phone: string): Observable<any> {
    return this.http.post(`${API}/auth/send-otp`, { phone: this.normalizePhone(phone) });
  }

  verifyOtp(phone: string, otp: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/auth/verify-otp`, { phone: this.normalizePhone(phone), otp, role: 'TENANT' }).pipe(
      tap(res => {
        localStorage.setItem('auth', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  verifyOtpWithRegistration(phone: string, otp: string, fullName: string, role: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API}/auth/verify-otp`, { phone: this.normalizePhone(phone), otp, fullName, role }).pipe(
      tap(res => {
        localStorage.setItem('auth', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }

  logout(): void {
    const token = this.currentUser?.accessToken;
    if (token) {
      this.http.post(`${API}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe();
    }
    localStorage.removeItem('auth');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.currentUser?.refreshToken;
    return this.http.post<AuthResponse>(`${API}/auth/refresh-token`, { refreshToken }).pipe(
      tap(res => {
        localStorage.setItem('auth', JSON.stringify(res));
        this.currentUserSubject.next(res);
      })
    );
  }
}
