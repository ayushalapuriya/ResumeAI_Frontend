import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumeData, ExperienceItem, EducationItem, ProjectItem } from '../../models/resume.model';
import { PersonalInfoFormComponent } from './personal-info/personal-info-form';
import { SummaryFormComponent }      from './summary/summary-form';
import { ExperienceFormComponent }   from './experience/experience-form';
import { EducationFormComponent }    from './education/education-form';
import { ProjectsFormComponent }     from './projects/projects-form';
import { SkillsFormComponent }       from './skills/skills-form';

@Component({
  selector: 'app-form-panel',
  standalone: true,
  imports: [
    CommonModule,
    PersonalInfoFormComponent,
    SummaryFormComponent,
    ExperienceFormComponent,
    EducationFormComponent,
    ProjectsFormComponent,
    SkillsFormComponent,
  ],
  templateUrl: './form-panel.html',
  styleUrl: './form-panel.css',
})
export class FormPanelComponent {
  @Input({ required: true }) resume!: ResumeData;
  @Input({ required: true }) activeSection!: string;
  @Input() accentColor = '#6366f1';

  // ── Experience ────────────────────────────────────────────
  @Output() addExperience    = new EventEmitter<void>();
  @Output() removeExperience = new EventEmitter<number>();

  // ── Education ─────────────────────────────────────────────
  @Output() addEducation    = new EventEmitter<void>();
  @Output() removeEducation = new EventEmitter<number>();

  // ── Projects ──────────────────────────────────────────────
  @Output() addProject    = new EventEmitter<void>();
  @Output() removeProject = new EventEmitter<number>();

  // ── Skills ────────────────────────────────────────────────
  @Output() addSkill    = new EventEmitter<string>();
  @Output() removeSkill = new EventEmitter<string>();
}
