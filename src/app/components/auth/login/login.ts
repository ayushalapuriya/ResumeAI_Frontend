import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth.service';
import { ToastService } from '../../../service/toast.service';
import { Toast } from '../../dashboard/components/toast/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, Toast],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = ''
  showPassword = signal(false);
  loading = signal(false);

  private toast = inject(ToastService);

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword.set(!this.showPassword());
  }

  login() {
    if (!this.email || !this.password) {
      this.toast.error('Please enter your email and password');
      return;
    }

    this.loading.set(true);
    this.toast.loading('Signing you in…');

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.toast.success('Login successful! Welcome back 👋');
        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      },
      error: (err) => {
        console.error('Login failed:', err);
        const msg = err.error?.message || 'Invalid email or password';
        this.toast.error('Login failed: ' + msg);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
