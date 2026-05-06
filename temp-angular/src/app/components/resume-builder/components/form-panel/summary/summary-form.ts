import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResumeData } from '../../../models/resume.model';
import { AiService } from '../../../../../service/ai.service';

@Component({
  selector: 'app-summary-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary-form.html',
  styleUrls: ['../form-section.css', '../ai-panel.css'],
})
export class SummaryFormComponent {
  @Input({ required: true }) resume!: ResumeData;
  @Input() accentColor = '#6366f1';

  readonly MAX_SUMMARY_LENGTH = 500;
  readonly WARN_AT_LENGTH     = 400;

  readonly aiLoading   = signal(false);
  readonly aiResult    = signal<string | null>(null);
  readonly aiOperation = signal<'generate' | 'improve' | null>(null);

  constructor(private ai: AiService) {}

  private getUserId(): number {
    try { return JSON.parse(localStorage.getItem('user') ?? '{}')?.id ?? 1; }
    catch { return 1; }
  }

  onGenerateSummary(): void {
    this.aiLoading.set(true);
    this.aiOperation.set('generate');
    this.aiResult.set(null);
    this.ai.generateSummary({
      jobTitle: this.resume.jobTitle || '',
      fullName: this.resume.fullName || '',
      skills:   this.resume.skills.join(', '),
      userId:   String(this.getUserId()),
    }).subscribe({
      next: (res) => {
        this.aiResult.set((res as any)?.result ?? (res as any)?.summary ?? JSON.stringify(res));
        this.aiLoading.set(false);
      },
      error: () => { this.aiResult.set('⚠️ AI service unavailable.'); this.aiLoading.set(false); },
    });
  }

  onImproveSection(): void {
    if (!this.resume.summary.trim()) return;
    this.aiLoading.set(true);
    this.aiOperation.set('improve');
    this.aiResult.set(null);
    this.ai.improveSection({
      section:  'summary',
      content:  this.resume.summary,
      jobTitle: this.resume.jobTitle || '',
      userId:   String(this.getUserId()),
    }).subscribe({
      next: (res) => {
        this.aiResult.set((res as any)?.result ?? (res as any)?.improved ?? JSON.stringify(res));
        this.aiLoading.set(false);
      },
      error: () => { this.aiResult.set('⚠️ AI service unavailable.'); this.aiLoading.set(false); },
    });
  }

  applyAiResult(): void {
    if (this.aiResult()) { this.resume.summary = this.aiResult()!; this.dismissAiResult(); }
  }

  dismissAiResult(): void {
    this.aiResult.set(null);
    this.aiOperation.set(null);
  }
}
