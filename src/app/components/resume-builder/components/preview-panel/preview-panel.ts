import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-preview-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-panel.html',
  styleUrl: './preview-panel.css',
})
export class PreviewPanelComponent {
  /** Sanitised HTML string produced by the parent (via DomSanitizer) */
  @Input({ required: true }) previewHtml!: SafeHtml;

  /** Emits when the user clicks the PDF export button inside the panel */
  @Output() exportPdf = new EventEmitter<void>();
}
