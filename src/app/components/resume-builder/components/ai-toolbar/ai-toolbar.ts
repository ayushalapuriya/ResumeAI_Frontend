import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, AiQuota } from '../../../../service/ai.service';
import { ResumeData } from '../../models/resume.model';

type AiModal = 'tailor' | 'ats' | 'coverLetter' | 'translate' | null;

interface AtsResult { score: number; suggestions: string[]; }

@Component({
  selector: 'app-ai-toolbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-toolbar.html',
  styleUrls: ['../../components/form-panel/ai-panel.css', './ai-toolbar.css'],
})
export class AiToolbarComponent {
  @Input({ required: true }) resume!: ResumeData;
  @Input() accentColor = '#6366f1';

  /** Emitted when the user applies tailored content back to the resume */
  @Output() resumeUpdated = new EventEmitter<Partial<ResumeData>>();

  // Modal control
  activeModal = signal<AiModal>(null);

  // Shared loading state
  aiLoading = signal(false);

  // Quota
  quota = signal<AiQuota | null>(null);

  // ── Tailor for Job ──────────────────────────────────────────────────────────
  jobDescription = '';
  tailorResult   = signal<string | null>(null);

  // ── ATS Check ──────────────────────────────────────────────────────────────
  atsResult = signal<AtsResult | null>(null);

  // ── Cover Letter ────────────────────────────────────────────────────────────
  coverJobTitle   = '';
  coverCompany    = '';
  coverResult     = signal<string | null>(null);

  // ── Translate ───────────────────────────────────────────────────────────────
  targetLanguage  = 'Spanish';
  translateResult = signal<Record<string, string> | null>(null);

  readonly LANGUAGES = ['Spanish', 'French', 'German', 'Portuguese', 'Italian',
                        'Chinese', 'Japanese', 'Arabic', 'Hindi', 'Russian'];

  constructor(private ai: AiService) {}

  private getUserId(): number {
    try { return JSON.parse(localStorage.getItem('user') ?? '{}')?.id ?? 1; }
    catch { return 1; }
  }

  openModal(modal: AiModal): void {
    this.activeModal.set(modal);
    this.aiLoading.set(false);
    // Reset results when reopening
    this.tailorResult.set(null);
    this.atsResult.set(null);
    this.coverResult.set(null);
    this.translateResult.set(null);
    // Load quota
    this.ai.getQuota(this.getUserId()).subscribe({ next: q => this.quota.set(q), error: () => {} });
  }

  closeModal(): void { this.activeModal.set(null); }

  // ── Tailor for Job ──────────────────────────────────────────────────────────
  onTailorForJob(): void {
    if (!this.jobDescription.trim()) return;
    this.aiLoading.set(true);
    this.ai.tailorForJob({
      jobDescription: this.jobDescription,
      currentSummary: this.resume.summary,
      skills:         this.resume.skills.join(', '),
      jobTitle:       this.resume.jobTitle,
      userId:         String(this.getUserId()),
    }).subscribe({
      next: (res) => {
        this.tailorResult.set((res as any)?.result ?? (res as any)?.tailored ?? JSON.stringify(res));
        this.aiLoading.set(false);
      },
      error: () => { this.tailorResult.set('⚠️ AI service unavailable.'); this.aiLoading.set(false); },
    });
  }

  applyTailoredContent(): void {
    if (this.tailorResult()) {
      this.resumeUpdated.emit({ summary: this.tailorResult()! });
      this.closeModal();
    }
  }

  // ── ATS Check ──────────────────────────────────────────────────────────────
  onCheckAts(): void {
  this.aiLoading.set(true);

  const resumeText = `
Name: ${this.resume.fullName}
Job Title: ${this.resume.jobTitle}

Summary:
${this.resume.summary}

Skills:
${this.resume.skills.join(', ')}

Experience:
${this.resume.experience
  .map(e => `${e.role} at ${e.company}: ${e.description}`)
  .join('\n')}
`;

  const payload = {
    userId: String(this.getUserId()),
    resume: resumeText
  };

  console.log('📤 FINAL PAYLOAD:', payload);

  this.ai.checkAts(payload).subscribe({

    next: (res: any) => {
      console.log('🔥 RAW RESPONSE:', res);

      let parsed: any = null;

      try {
        if (typeof res === 'string') {
          const clean = res.replace(/```json|```/g, '').trim();
          parsed = JSON.parse(clean);
        } else {
          parsed = res;
        }
      } catch (e) {
        console.error('❌ PARSE ERROR:', e);
      }

      this.atsResult.set({
        score: parsed?.score ?? 0,
        suggestions: parsed?.suggestions ?? ['⚠️ Invalid AI response'],
      });

      this.aiLoading.set(false);
    },

    error: (err) => {
      console.error('❌ API ERROR:', err);

      this.atsResult.set({
        score: 0,
        suggestions: ['⚠️ AI service unavailable.'],
      });

      this.aiLoading.set(false);
    }
  });
}

  get atsScoreColor(): string {
    const s = this.atsResult()?.score ?? 0;
    if (s >= 80) return '#16a34a';
    if (s >= 60) return '#d97706';
    return '#dc2626';
  }

  // ── Cover Letter ────────────────────────────────────────────────────────────
  onGenerateCoverLetter(): void {
    this.aiLoading.set(true);
    this.ai.generateCoverLetter({
      fullName:    this.resume.fullName,
      jobTitle:    this.coverJobTitle || this.resume.jobTitle,
      company:     this.coverCompany,
      summary:     this.resume.summary,
      skills:      this.resume.skills.join(', '),
      experience:  this.resume.experience.map(e => `${e.role} at ${e.company}`).join(', '),
      userId:      String(this.getUserId()),
    }).subscribe({
      next: (res) => {
        this.coverResult.set((res as any)?.result ?? (res as any)?.coverLetter ?? JSON.stringify(res));
        this.aiLoading.set(false);
      },
      error: () => { this.coverResult.set('⚠️ AI service unavailable.'); this.aiLoading.set(false); },
    });
  }

  copyCoverLetter(): void {
    if (this.coverResult()) navigator.clipboard.writeText(this.coverResult()!);
  }

  // ── Translate ───────────────────────────────────────────────────────────────
  onTranslate(): void {
    this.aiLoading.set(true);
    this.ai.translate({
      targetLanguage: this.targetLanguage,
      summary:        this.resume.summary,
      jobTitle:       this.resume.jobTitle,
      fullName:       this.resume.fullName,
      userId:         String(this.getUserId()),
    }).subscribe({
      next: (res) => { this.translateResult.set(res); this.aiLoading.set(false); },
      error: () => { this.translateResult.set({ error: '⚠️ AI service unavailable.' }); this.aiLoading.set(false); },
    });
  }

  applyTranslation(): void {
    const res = this.translateResult();
    if (res && !res['error']) {
      const patch: Partial<ResumeData> = {};
      if (res['summary'])  patch.summary  = res['summary'];
      if (res['jobTitle']) patch.jobTitle = res['jobTitle'];
      this.resumeUpdated.emit(patch);
      this.closeModal();
    }
  }

  get translateResultEntries(): { key: string; value: string }[] {
    const r = this.translateResult();
    if (!r) return [];
    return Object.entries(r).map(([key, value]) => ({ key, value }));
  }
}
