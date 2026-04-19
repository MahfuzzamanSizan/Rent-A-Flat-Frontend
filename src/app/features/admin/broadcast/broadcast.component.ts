import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({ selector: 'app-broadcast', templateUrl: './broadcast.component.html', styleUrls: ['./broadcast.component.scss'] })
export class BroadcastComponent {
  form: FormGroup;
  loading = false;

  constructor(private api: ApiService, private fb: FormBuilder, private snack: MatSnackBar) {
    this.form = this.fb.group({ title: ['', Validators.required], body: ['', Validators.required], targetRole: [''] });
  }

  send(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { title, body, targetRole } = this.form.value;
    this.api.broadcastNotification(title, body, targetRole || undefined).subscribe({
      next: () => { this.loading = false; this.form.reset({ targetRole: '' }); this.snack.open('Broadcast sent!', 'OK', { duration: 3000 }); },
      error: () => { this.loading = false; this.snack.open('Failed', 'Close', { duration: 2000 }); }
    });
  }
}
