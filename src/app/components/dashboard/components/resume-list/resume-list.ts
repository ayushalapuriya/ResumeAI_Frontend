import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeCard, ResumeEntry } from '../resume-card/resume-card';
import { ScoreBanner } from '../score-banner/score-banner';

export interface SkillChip {
  name: string;
  bg: string;
  color: string;
  border: string;
}

@Component({
  selector: 'app-resume-list',
  standalone: true,
  imports: [CommonModule, ResumeCard, ScoreBanner],
  templateUrl: './resume-list.html',
  styleUrl: './resume-list.css',
})
export class ResumeList {
  @Input() resumes: ResumeEntry[] = [];
  @Input() activeSkills: SkillChip[] = [];
  @Input() score = 87;

  @Output() createNew = new EventEmitter<void>();
  @Output() editResume = new EventEmitter<ResumeEntry>();
  @Output() downloadResume = new EventEmitter<ResumeEntry>();
  @Output() duplicateResume = new EventEmitter<ResumeEntry>();
  @Output() deleteResume = new EventEmitter<ResumeEntry>();
  @Output() browseTemplates = new EventEmitter<void>();
}
