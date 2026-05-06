import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Template } from '../../../../core/models/template.model';

@Component({
  selector: 'app-template-preview-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-preview-modal.html',
  styleUrl: './template-preview-modal.css',
})
export class TemplatePreviewModal {
  @Input() open = false;
  @Input() template: Template | null = null;
  @Input() accent = '#6366f1';

  @Output() close = new EventEmitter<void>();
  @Output() use = new EventEmitter<Template>();

  constructor(private sanitizer: DomSanitizer) {}

  onOverlayClick() { this.close.emit(); }
  onModalClick(e: Event) { e.stopPropagation(); }

  /** Returns true when the template has a real thumbnail image URL */
  get hasImage(): boolean {
    return !!(this.template?.thumbnailUrl && this.template.thumbnailUrl.trim().length > 0);
  }

  /**
   * Renders the template's htmlLayout + cssStyles as a safe live preview.
   * Falls back to a styled mock if there is no htmlLayout data.
   */
  get livePreviewHtml(): SafeHtml {
    if (!this.template) return '';

    if (this.template.htmlLayout) {
      const combined = `
        <style>
          ${this.template.cssStyles || ''}
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        </style>
        ${this.template.htmlLayout}
      `;
      return this.sanitizer.bypassSecurityTrustHtml(combined);
    }

    // Fallback mock using accent color
    const a = this.accent;
    const mock = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .mock-wrap { background: #fff; }
        .mock-header { background: ${a}; padding: 20px 24px; color: #fff; }
        .mock-name { font-size: 1.3rem; font-weight: 800; margin-bottom: 4px; }
        .mock-title { font-size: 0.82rem; opacity: 0.85; margin-bottom: 8px; }
        .mock-contact { font-size: 0.7rem; opacity: 0.75; }
        .mock-body { padding: 18px 24px; }
        .mock-sec { margin-bottom: 16px; }
        .mock-sec-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 1.5px;
          text-transform: uppercase; color: ${a}; border-bottom: 1.5px solid ${a}44;
          padding-bottom: 4px; margin-bottom: 10px; }
        .mock-text { font-size: 0.78rem; color: #555; line-height: 1.6; }
        .mock-entry { margin-bottom: 10px; }
        .mock-entry strong { font-size: 0.8rem; color: #222; }
        .mock-entry .co { font-size: 0.78rem; color: #666; }
        .mock-entry .dt { font-size: 0.72rem; color: #999; margin-top: 2px; }
        .mock-desc { font-size: 0.75rem; color: #555; line-height: 1.55; margin-top: 4px; }
        .mock-skills { display: flex; flex-wrap: wrap; gap: 5px; }
        .mock-skill { padding: 3px 9px; border-radius: 4px; font-size: 0.7rem; font-weight: 600;
          background: ${a}15; border: 1px solid ${a}33; color: ${a}; }
      </style>
      <div class="mock-wrap">
        <div class="mock-header">
          <div class="mock-name">Alex Johnson</div>
          <div class="mock-title">Senior Product Designer</div>
          <div class="mock-contact">alex@example.com · +1 555-000-0000 · San Francisco, CA</div>
        </div>
        <div class="mock-body">
          <div class="mock-sec">
            <div class="mock-sec-label">Summary</div>
            <p class="mock-text">Creative product designer with 6+ years crafting user-centered digital experiences across mobile and web platforms.</p>
          </div>
          <div class="mock-sec">
            <div class="mock-sec-label">Experience</div>
            <div class="mock-entry">
              <strong>Senior Product Designer</strong> <span class="co">· Acme Corp</span>
              <div class="dt">Jan 2022 – Present</div>
              <p class="mock-desc">Led end-to-end product design for web and mobile, shipping features to 2M+ users.</p>
            </div>
            <div class="mock-entry">
              <strong>UX Designer</strong> <span class="co">· Startup Inc</span>
              <div class="dt">Mar 2019 – Dec 2021</div>
            </div>
          </div>
          <div class="mock-sec">
            <div class="mock-sec-label">Skills</div>
            <div class="mock-skills">
              <span class="mock-skill">Figma</span>
              <span class="mock-skill">User Research</span>
              <span class="mock-skill">Prototyping</span>
              <span class="mock-skill">React</span>
              <span class="mock-skill">Design Systems</span>
            </div>
          </div>
        </div>
      </div>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(mock);
  }
}
