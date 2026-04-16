import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../../../../core/models/template.model';

@Component({
  selector: 'app-template-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-card.html',
  styleUrl: './template-card.css',
})
export class TemplateCard {

  @Input() template!: Template;

  // Keep accent for buttons / highlights
  @Input() accent = '#6366f1';

  // ❌ remove bg (no longer needed)
  // @Input() bg = '#f8f9ff';

  @Input() isNew = false;

  @Output() use = new EventEmitter<Template>();
  @Output() preview = new EventEmitter<{ template: Template; event: Event }>();

  hovered = false;

  // ✅ Format usage count properly
  formatUses(count: number): string {
    if (!count) return '0 uses';

    if (count < 1000) return count + ' uses';

    return (count / 1000).toFixed(1) + 'k uses';
  }

  // ✅ Safe preview click
  onPreview(e: Event) {
    e.stopPropagation();
    this.preview.emit({ template: this.template, event: e });
  }

  // ✅ Optional: fallback image (VERY useful 🔥)
  get imageUrl(): string {
    return this.template?.thumbnailUrl || 'assets/templates/default.png';
  }
}