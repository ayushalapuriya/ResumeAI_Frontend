import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EducationItem } from '../../../models/resume.model';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './education-form.html',
  styleUrl: '../form-section.css',
})
export class EducationFormComponent {
  @Input({ required: true }) items!: EducationItem[];
  @Input() accentColor = '#6366f1';

  @Output() removeItem = new EventEmitter<number>();
  @Output() addItem    = new EventEmitter<void>();
}
