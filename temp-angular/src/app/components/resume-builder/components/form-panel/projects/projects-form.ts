import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectItem } from '../../../models/resume.model';

@Component({
  selector: 'app-projects-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects-form.html',
  styleUrl: '../form-section.css',
})
export class ProjectsFormComponent {
  @Input({ required: true }) items!: ProjectItem[];
  @Input() accentColor = '#6366f1';

  @Output() removeItem = new EventEmitter<number>();
  @Output() addItem    = new EventEmitter<void>();
}
