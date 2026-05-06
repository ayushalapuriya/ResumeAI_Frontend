import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class DashboardSidebar {
  @Input() activePage: 'resume' | 'templates' | 'profile' = 'resume';
  @Input() user: User | null = null;
  @Input() userRole = 'Developer';

  @Output() pageChange = new EventEmitter<'resume' | 'templates' | 'profile'>();
  @Output() logoutClick = new EventEmitter<void>();

  userMenuOpen = signal(false);

  get userInitials(): string {
    if (!this.user?.email) return 'U';
    return this.user.email.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  setPage(page: 'resume' | 'templates' | 'profile') {
    this.pageChange.emit(page);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu() { this.userMenuOpen.set(!this.userMenuOpen()); }

  goToProfile(e: Event) {
    e.stopPropagation();
    this.setPage('profile');
  }

  onLogout(e: Event) {
    e.stopPropagation();
    this.userMenuOpen.set(false);
    this.logoutClick.emit();
  }
}
