import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionItem } from '../../models/resume.model';
import { Template } from '../../../../core/models/template.model';

@Component({
  selector: 'app-section-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-nav.html',
  styleUrl: './section-nav.css',
})
export class SectionNavComponent {
  /** All available section definitions */
  @Input() sections: SectionItem[] = [];

  /** Currently active section id */
  @Input() activeSection = 'personal';

  /** Active template (used to show name in the footer chip) */
  @Input() selectedTemplate: Template | null = null;

  /** Template id fallback when template object is not yet loaded */
  @Input() templateId = 1;

  /** Accent colour for active state highlight */
  @Input() accentColor = '#6366f1';

  /** Emits the id of the section the user clicked */
  @Output() sectionChanged = new EventEmitter<string>();
}
