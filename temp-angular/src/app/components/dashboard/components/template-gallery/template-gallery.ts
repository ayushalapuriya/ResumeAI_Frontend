import { Component, Input, Output, EventEmitter, signal, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../../../../core/models/template.model';
import { TemplateCard } from '../template-card/template-card';
import { TemplatePreviewModal } from '../template-preview-modal/template-preview-modal';
import { TemplateService } from '../../../../service/template.service';

@Component({
  selector: 'app-template-gallery',
  standalone: true,
  imports: [CommonModule, TemplateCard, TemplatePreviewModal],
  templateUrl: './template-gallery.html',
  styleUrl: './template-gallery.css',
})
export class TemplateGallery implements OnChanges {

  constructor(private templateService: TemplateService) {}

  @Input() templates: Template[] = [];
  @Input() loading = true;
  @Input() showBackToResumes = false;

  @Output() useTemplate = new EventEmitter<Template>();
  @Output() startBlank = new EventEmitter<void>();
  @Output() backToResumes = new EventEmitter<void>();

  // ngOnInit() {
  //   this.templateService.getTemplates().subscribe(tpls => {
  //     this.templates = tpls;
  //     console.log('Templates:', this.templates);
  //     this.loading = false;
  //   });
  // }

  activeCat = signal('All');
  previewOpen = signal(false);
  selectedTemplate = signal<Template | null>(null);

  categories = ['All'];

  // ✅ Keep accent (used in buttons/UI)
  private tplAccents: Record<number, string> = {
    1: '#6366f1', 2: '#ec4899', 3: '#0ea5e9',
    4: '#22c55e', 5: '#f59e0b', 6: '#0f172a',
    7: '#64748b', 8: '#8b5cf6',
  };

  ngOnChanges() {}

  // ✅ Filter templates
  get filteredTemplates(): Template[] {
    if (this.activeCat() === 'All') return this.templates;
    return this.templates.filter(t => t.category === this.activeCat());
  }

  setCategory(cat: string) {
    this.activeCat.set(cat);
  }

  // ✅ Accent only (bg removed)
  getAccent(id: number) {
    return this.tplAccents[id] || '#6366f1';
  }

  // ✅ New badge logic
  isNew(t: Template): boolean {
    if (!t.createdAt) return false;
    return Date.now() - new Date(t.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
  }

  // ✅ Preview
  onPreview(data: { template: Template; event: Event }) {
    this.selectedTemplate.set(data.template);
    this.previewOpen.set(true);
  }

  closePreview() {
    this.previewOpen.set(false);
  }

  // ✅ Use template
  onUseTemplate(t: Template) {
    this.previewOpen.set(false);
    this.useTemplate.emit(t);
  }

  // ✅ Accent for modal
  get selectedAccent(): string {
    const t = this.selectedTemplate();
    return t ? this.getAccent(t.templateId) : '#6366f1';
  }
}