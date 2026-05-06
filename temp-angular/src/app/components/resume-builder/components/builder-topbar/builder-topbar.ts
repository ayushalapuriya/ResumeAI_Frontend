import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiToolbarComponent } from '../ai-toolbar/ai-toolbar';
import { ResumeData } from '../../models/resume.model';

@Component({
  selector: 'app-builder-topbar',
  standalone: true,
  imports: [CommonModule, AiToolbarComponent],
  templateUrl: './builder-topbar.html',
  styleUrl: './builder-topbar.css',
})
export class BuilderTopbarComponent {
  @Input() accentColor = '#6366f1';
  @Input() saveStatus: 'idle' | 'saving' | 'saved' | 'error' = 'idle';
  @Input() isLoading = false;
  @Input({ required: true }) resume!: ResumeData;

  @Output() backClicked    = new EventEmitter<void>();
  @Output() exportPdf      = new EventEmitter<void>();
  @Output() save           = new EventEmitter<void>();
  @Output() resumeUpdated  = new EventEmitter<Partial<ResumeData>>();

  get saveLabel(): string {
    switch (this.saveStatus) {
      case 'saving': return 'Saving…';
      case 'saved':  return '✓ Saved';
      case 'error':  return 'Error!';
      default:       return 'Save';
    }
  }
}
