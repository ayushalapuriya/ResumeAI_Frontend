import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './score-banner.html',
  styleUrl: './score-banner.css',
})
export class ScoreBanner {
  @Input() score = 87;
  @Output() browseTemplates = new EventEmitter<void>();

  get circumference() { return 2 * Math.PI * 32; }
  get dashArray() {
    const filled = (this.score / 100) * this.circumference;
    return `${filled.toFixed(1)} ${this.circumference.toFixed(1)}`;
  }
}
