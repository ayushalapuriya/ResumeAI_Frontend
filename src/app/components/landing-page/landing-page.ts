import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TemplateService } from '../../service/template.service';
import { Template } from '../../core/models/template.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit {

  featuredTemplates: Template[] = [];

  steps = [
    { icon: '⊞', title: 'Choose a Template', desc: 'Pick from 8+ professionally designed templates built to impress recruiters.' },
    { icon: '✎', title: 'Fill Your Details', desc: 'Our smart form guides you through every section with live preview.' },
    { icon: '⬇', title: 'Download PDF', desc: 'Export pixel-perfect PDF resumes in one click, ready to send.' }
  ];

  stats = [
    { value: '50,000+', label: 'Resumes Created' },
    { value: '8+', label: 'Templates' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  constructor(
    private router: Router,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe({
      next: (templates) => {
        this.featuredTemplates = templates.slice(0, 4); // ✅ show only 4
        console.log('Templates loaded:', templates);
      },
      error: (err) => {
        console.error('Error loading templates:', err);
      }
    });
  }

  onUseTemplate(template: Template): void {
    this.router.navigate(['/resume-builder'], {
      queryParams: { templateId: template.templateId }
    });
  }

  trackById(index: number, item: Template) {
    return item.templateId;
  }

  trackByTitle(index: number, item: any) {
    return item.title;
  }

  trackByLabel(index: number, item: any) {
    return item.label;
  }

  getTemplateGradient(color: string): string {
    return `linear-gradient(135deg, ${color}22, ${color}44)`;
  }
}