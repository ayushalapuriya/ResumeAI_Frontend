import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExperienceItem } from '../../../models/resume.model';
import { AiService } from '../../../../../service/ai.service';

interface AiExpState {
  loading: boolean;
  operation: 'bullets' | 'improve' | null;
  result: string | null;
}

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience-form.html',
  styleUrls: ['../form-section.css', '../ai-panel.css'],
})
export class ExperienceFormComponent {
  @Input({ required: true }) items!: ExperienceItem[];
  @Input() accentColor = '#6366f1';
  @Output() removeItem = new EventEmitter<number>();
  @Output() addItem    = new EventEmitter<void>();

  // Per-entry AI state keyed by entry index
  aiStates: Map<number, AiExpState> = new Map();

  constructor(private ai: AiService) {}

  private getUserId(): number {
    try { return JSON.parse(localStorage.getItem('user') ?? '{}')?.id ?? 1; }
    catch { return 1; }
  }

  getAiState(index: number): AiExpState {
    if (!this.aiStates.has(index)) {
      this.aiStates.set(index, { loading: false, operation: null, result: null });
    }
    return this.aiStates.get(index)!;
  }

  onGenerateBullets(index: number): void {
    const exp = this.items[index];
    const state = this.getAiState(index);
    state.loading = true; state.operation = 'bullets'; state.result = null;
    this.ai.generateBullets({
      role:        exp.role    || '',
      company:     exp.company || '',
      description: exp.description || '',
      userId:      String(this.getUserId()),
    }).subscribe({
      next: (bullets) => {
        state.result  = Array.isArray(bullets) ? bullets.join('\n') : String(bullets);
        console.log('Generated bullets:', bullets);
        state.loading = false;
      },
      error: () => { state.result = '⚠️ AI service unavailable.'; state.loading = false; },
    });
  }

  onImproveDescription(index: number): void {
    const exp = this.items[index];
    if (!exp.description.trim()) return;
    const state = this.getAiState(index);
    state.loading = true; state.operation = 'improve'; state.result = null;
    this.ai.improveSection({
      section:  'experience',
      content:  exp.description,
      role:     exp.role    || '',
      company:  exp.company || '',
      userId:   String(this.getUserId()),
    }).subscribe({
      next: (res) => {
        state.result  = (res as any)?.result ?? (res as any)?.improved ?? JSON.stringify(res);
        state.loading = false;
      },
      error: () => { state.result = '⚠️ AI service unavailable.'; state.loading = false; },
    });
  }

  applyAiResult(index: number): void {
    const state = this.getAiState(index);
    if (state.result) { this.items[index].description = state.result; this.dismissAiResult(index); }
  }

  dismissAiResult(index: number): void {
    const state = this.getAiState(index);
    state.result = null; state.operation = null;
  }
}
