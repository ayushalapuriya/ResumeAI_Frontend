import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ResumeEntry {
  resumeId: number;
  name: string;
  updated: string;
  completeness: number;
  active: boolean;
  color: string;
}

@Component({
  selector: 'app-resume-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume-card.html',
  styleUrl: './resume-card.css',
})
export class ResumeCard {
  @Input() resume!: ResumeEntry;

  @Output() edit = new EventEmitter<ResumeEntry>();
  @Output() download = new EventEmitter<ResumeEntry>();
  @Output() duplicate = new EventEmitter<ResumeEntry>();
  @Output() delete = new EventEmitter<ResumeEntry>();

  hovered = false;
}
