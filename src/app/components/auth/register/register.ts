import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../service/toast.service';
import { Toast } from '../../dashboard/components/toast/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Toast],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  showPassword = signal(false);
  loading = signal(false);
  agreed = false;

  private toast = inject(ToastService);

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  getStrength(): number {
    if (!this.password) return 0;
    let s = 0;
    if (this.password.length >= 8) s++;
    if (/[A-Z]/.test(this.password)) s++;
    if (/[0-9]/.test(this.password)) s++;
    if (/[^A-Za-z0-9]/.test(this.password)) s++;
    return s;
  }

  getStrengthLabel(): string {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.getStrength()] || '';
  }

  getStrengthClass(): string {
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    return classes[this.getStrength()] || '';
  }

  onSubmit() {
    if (!this.name || !this.email || !this.password) {
      this.toast.error('Please fill in all required fields');
      return;
    }
    if (this.getStrength() < 2) {
      this.toast.error('Please choose a stronger password');
      return;
    }

    this.loading.set(true);
    this.toast.loading('Creating your account…');

    this.authService.register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.toast.success('Account created! Please sign in 🎉');
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          console.error('Registration failed:', err);
          const msg = err.error?.message || 'Registration failed. Please try again.';
          this.toast.error(msg);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
  }
}
