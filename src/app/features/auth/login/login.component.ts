import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  step: 'phone' | 'otp' | 'register' = 'phone';
  phoneForm: FormGroup;
  otpForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  devOtp = '';
  isNewUser = false;

  roles = [
    { value: 'OWNER', label: 'Property Owner' },
    { value: 'TENANT', label: 'Tenant / Renter' }
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.phoneForm = this.fb.group({ phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]] });
    this.otpForm = this.fb.group({ otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]] });
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      role: ['TENANT', Validators.required]
    });
  }

  sendOtp(): void {
    if (this.phoneForm.invalid) return;
    this.loading = true;
    this.auth.sendOtp(this.phoneForm.value.phone).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.step = 'otp';
        this.devOtp = res.devOtp || '';
        if (this.devOtp) this.otpForm.patchValue({ otp: this.devOtp });
        this.snack.open('OTP sent! ' + (this.devOtp ? `Dev OTP: ${this.devOtp}` : ''), 'OK', { duration: 5000 });
      },
      error: (e: any) => {
        this.loading = false;
        this.snack.open(e.error?.message || 'Failed to send OTP', 'Close', { duration: 3000 });
      }
    });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;
    this.loading = true;
    const phone = this.phoneForm.value.phone;
    const otp = this.otpForm.value.otp;

    this.auth.verifyOtp(phone, otp).subscribe({
      next: (res) => {
        this.loading = false;
        this.redirect(res.role);
      },
      error: (e: any) => {
        this.loading = false;
        const msg: string = e.error?.message || '';
        if (msg.toLowerCase().includes('full name')) {
          // New user — show registration form
          this.isNewUser = true;
          this.step = 'register';
        } else {
          this.snack.open(msg || 'Invalid OTP', 'Close', { duration: 3000 });
        }
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) return;
    this.loading = true;
    const phone = this.phoneForm.value.phone;
    const otp = this.otpForm.value.otp;
    const { fullName, role } = this.registerForm.value;

    this.auth.verifyOtpWithRegistration(phone, otp, fullName, role).subscribe({
      next: (res) => {
        this.loading = false;
        this.snack.open('Account created!', 'OK', { duration: 2000 });
        this.redirect(res.role);
      },
      error: (e: any) => {
        this.loading = false;
        this.snack.open(e.error?.message || 'Registration failed', 'Close', { duration: 3000 });
      }
    });
  }

  private redirect(role: string): void {
    if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
    else if (role === 'OWNER') this.router.navigate(['/owner/dashboard']);
    else this.router.navigate(['/tenant/home']);
  }

  back(): void {
    if (this.step === 'register') { this.step = 'otp'; }
    else { this.step = 'phone'; }
  }
}
