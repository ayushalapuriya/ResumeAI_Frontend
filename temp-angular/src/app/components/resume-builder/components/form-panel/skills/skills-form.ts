import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../../../../service/ai.service';

@Component({
  selector: 'app-skills-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-form.html',
  styleUrls: ['../form-section.css', '../ai-panel.css'],
})
export class SkillsFormComponent {
  @Input({ required: true }) skills!: string[];
  @Input() jobTitle = '';
  @Input() accentColor = '#6366f1';

  @Output() addSkill    = new EventEmitter<string>();
  @Output() removeSkill = new EventEmitter<string>();

  newSkill = '';

  readonly aiLoading      = signal(false);
  readonly aiSuggestions  = signal<string[]>([]);
  readonly addedSkills    = signal<Set<string>>(new Set());

  constructor(private ai: AiService) {}

  private getUserId(): number {
    try { return JSON.parse(localStorage.getItem('user') ?? '{}')?.id ?? 1; }
    catch { return 1; }
  }

  onAddClicked(): void {
    const t = this.newSkill.trim();
    if (t) { this.addSkill.emit(t); this.newSkill = ''; }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') { event.preventDefault(); this.onAddClicked(); }
  }

  onSuggestSkills(): void {
    this.aiLoading.set(true);
    this.aiSuggestions.set([]);
    this.ai.suggestSkills({
      jobTitle:      this.jobTitle || '',
      currentSkills: this.skills.join(', '),
      userId:        String(this.getUserId()),
    }).subscribe({
      next: (skills) => {
        this.aiSuggestions.set(Array.isArray(skills) ? skills : []);
        this.aiLoading.set(false);
      },
      error: () => { this.aiSuggestions.set([]); this.aiLoading.set(false); },
    });
  }

  addSuggestion(skill: string): void {
    if (!this.skills.includes(skill)) {
      this.addSkill.emit(skill);
      const s = new Set(this.addedSkills());
      s.add(skill);
      this.addedSkills.set(s);
    }
  }

  dismissSuggestions(): void {
    this.aiSuggestions.set([]);
    this.addedSkills.set(new Set());
  }

  isAdded(skill: string): boolean {
    return this.addedSkills().has(skill) || this.skills.includes(skill);
  }
}
