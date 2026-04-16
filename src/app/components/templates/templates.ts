import { Component, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Template } from '../../core/models/template.model';
import { TemplateService } from '../../service/template.service';

@Component({
  selector: 'app-templates',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './templates.html',
  styleUrl: './templates.css',
})
export class Templates implements OnInit {
  allTemplates: Template[] = [];
  loading = signal(true);
  searchQuery = '';
  activeCategory = signal('All');
  hoveredId = signal<number | null>(null);

  categories = ['All'];

  mockTemplates: Template[] = [];

  templateColors: Record<number, string> = {
    1: '#6366f1', 2: '#0f172a', 3: '#64748b', 4: '#ec4899',
    5: '#0ea5e9', 6: '#1e293b', 7: '#8b5cf6', 8: '#b45309',
  };

  constructor(private router: Router, private templateService: TemplateService) {}

  ngOnInit() {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.allTemplates = templates;
        this.loading.set(false);
      },
      error: () => {
        this.allTemplates = this.mockTemplates;
        this.loading.set(false);
      }
    });
  }

  get filteredTemplates(): Template[] {
    return this.allTemplates.filter(t => {
      const matchCat = this.activeCategory() === 'All' || t.category === this.activeCategory();
      const matchSearch = !this.searchQuery || t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || t.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  useTemplate(template: Template) {
    this.router.navigate(['/resume-builder'], { queryParams: { templateId: template.templateId } });
  }

  getColor(id: number): string {
    return this.templateColors[id] || '#6366f1';
  }

  trackById(_: number, t: Template) { return t.templateId; }
}
