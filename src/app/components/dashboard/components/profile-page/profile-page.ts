import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';
@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {

  @Input() user: User | null = null;
  @Input() userRole = 'Developer';
  @Input() resumeCount = 3;
  @Input() downloadCount = 18;
  @Input() score = 87;

  @Output() back = new EventEmitter<void>();
  @Output() saveProfile = new EventEmitter<void>();

  get userInitials(): string {
  if (!this.user?.email) return 'U';
    return this.user.email[0].toUpperCase();
  }
}
