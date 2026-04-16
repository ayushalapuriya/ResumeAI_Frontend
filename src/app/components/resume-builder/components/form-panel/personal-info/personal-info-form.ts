import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeData } from '../../../models/resume.model';

@Component({
  selector: 'app-personal-info-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-info-form.html',
  styleUrl: '../form-section.css',
})
export class PersonalInfoFormComponent {
  /** Two-way bound resume data object (mutated in place via ngModel) */
  @Input({ required: true }) resume!: ResumeData;

  /** Template accent colour used for section icon background */
  @Input() accentColor = '#6366f1';
}
