// ─────────────────────────────────────────────────────────────────────────────
// ResumeBuilder (orchestrator / smart component)
//
// Responsibilities:
//   • Loads or creates the Resume record via ResumeService
//   • Loads the section records via SectionService, maps them to ResumeData
//   • Saves the resume metadata + all sections on "Save"
//   • Loads the selected template via TemplateService
//   • Generates the sanitised live-preview HTML (delegates to pure utils)
//   • Delegates ALL rendering to child components
// ─────────────────────────────────────────────────────────────────────────────

import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TemplateService } from '../../service/template.service';
import { ResumeService, ResumeDTO } from '../../service/resume.service';
import { SectionService, ResumeSection, SectionType } from '../../service/section.service';
import { Template } from '../../core/models/template.model';

import {
  ResumeData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  SectionItem,
  ResumeMeta,
} from './models/resume.model';

import {
  DEFAULT_RESUME_DATA,
  BUILDER_SECTIONS,
  TEMPLATE_ACCENT_PALETTE,
} from './utils/resume-defaults';

import {
  buildUniversalPreviewHtml,
  buildTemplatePreviewHtml,
} from './utils/preview-html.builder';

import { BuilderTopbarComponent } from './components/builder-topbar/builder-topbar';
import { SectionNavComponent } from './components/section-nav/section-nav';
import { FormPanelComponent } from './components/form-panel/form-panel';
import { PreviewPanelComponent } from './components/preview-panel/preview-panel';

// ── Helper: map sectionType enum → local section key ────────────────────────
const SECTION_TYPE_TO_KEY: Record<SectionType, string> = {
  PERSONAL:       'personal',
  EXPERIENCE:     'experience',
  EDUCATION:      'education',
  SKILLS:         'skills',
  PROJECTS:       'projects',
  CERTIFICATIONS: 'summary',
};

@Component({
  selector: 'app-resume-builder',
  standalone: true,
  imports: [
    CommonModule,
    BuilderTopbarComponent,
    SectionNavComponent,
    FormPanelComponent,
    PreviewPanelComponent,
  ],
  templateUrl: './resume-builder.html',
  styleUrl: './resume-builder.css',
})
export class ResumeBuilder implements OnInit {
  // ── State ──────────────────────────────────────────────────────────────────
  readonly activeSection = signal<string>('personal');
  readonly templateId    = signal<number>(1);
  readonly isLoading     = signal<boolean>(false);
  readonly saveStatus    = signal<'idle' | 'saving' | 'saved' | 'error'>('idle');

  selectedTemplate = signal<Template | null>(null);
  resume: ResumeData = structuredClone(DEFAULT_RESUME_DATA);

  /** API persistence metadata */
  private meta: ResumeMeta = { resumeId: null, sectionIds: {} };

  /** Monotonically increasing id counter for new list entries */
  private nextId = 100;

  // ── Static data (passed down to child components) ─────────────────────────
  readonly sections: SectionItem[] = BUILDER_SECTIONS;

  // ── DI ─────────────────────────────────────────────────────────────────────
  constructor(
    private readonly route:           ActivatedRoute,
    private readonly router:          Router,
    private readonly templateService: TemplateService,
    private readonly resumeService:   ResumeService,
    private readonly sectionService:  SectionService,
    private readonly sanitizer:       DomSanitizer,
  ) {}

  // ── Lifecycle ──────────────────────────────────────────────────────────────
  ngOnInit(): void {
    console.log('🚀 ResumeBuilder initialized ');
    this.route.queryParams.subscribe(params => {
      const tid = params['templateId'] ? +params['templateId'] : 1;
      const rid = params['resumeId']   ? +params['resumeId']   : null;

      this.templateId.set(tid);

      // Load template
      this.templateService.getTemplateById(tid).subscribe(t => {
        this.selectedTemplate.set(t ?? null);
      });

      // Load existing resume data from API if resumeId is provided
      if (rid) {
        this.loadResumeFromApi(rid);
      }
    });
  }

  // ── API load ───────────────────────────────────────────────────────────────
  private loadResumeFromApi(resumeId: number): void {
  this.isLoading.set(true);

  forkJoin({
    resume: this.resumeService.getById(resumeId).pipe(catchError(() => of(null))),
    sections: this.sectionService.getByResume(resumeId).pipe(catchError(() => of([]))),
  }).subscribe(({ resume, sections }) => {
    this.isLoading.set(false);

    if (!resume) return;

    this.meta.resumeId = resume.resumeId ?? null;

    // ✅ Start with fresh base
    let updatedResume: ResumeData = {
      ...structuredClone(DEFAULT_RESUME_DATA),
      fullName: resume.title ?? DEFAULT_RESUME_DATA.fullName,
      jobTitle: resume.targetJobTitle ?? DEFAULT_RESUME_DATA.jobTitle,
    };

    console.log('✅ Sections Loaded:', sections);

    for (const section of sections) {
      const key = SECTION_TYPE_TO_KEY[section.sectionType];

      const sid = section.id ?? section.sectionId;
      if (sid && key) {
        this.meta.sectionIds[key] = sid;
      }

      // ✅ Merge section into temp object
      updatedResume = this.mergeSection(updatedResume, section);
    }

    // ✅ Single assignment → ensures UI refresh
    this.resume = { ...updatedResume };

    console.log('✅ Final Resume State:', this.resume);
  });
}

  /** Merges one persisted section's content into the local ResumeData */
  private mergeSection(
    current: ResumeData,
    section: ResumeSection
  ): ResumeData {

    // ✅ Handle both stringified JSON & object
    let c: any = section.content;

    if (!c) return current;

    if (typeof c === 'string') {
      try {
        c = JSON.parse(c);
      } catch (err) {
        console.error('❌ Failed to parse section content:', c);
        return current;
      }
    }

    switch (section.sectionType) {

      // ───────────────── PERSONAL ─────────────────
      case 'PERSONAL':
        return {
          ...current,
          fullName: c.fullName ?? current.fullName,
          jobTitle: c.jobTitle ?? current.jobTitle,
          email:    c.email    ?? current.email,
          phone:    c.phone    ?? current.phone,
          location: c.location ?? current.location,
          website:  c.website  ?? current.website,
          linkedin: c.linkedin ?? current.linkedin,
          summary:  c.summary  ?? current.summary,
        };

      // ───────────────── EXPERIENCE ─────────────────
      case 'EXPERIENCE':
        return {
          ...current,
          experience: Array.isArray(c.items)
            ? c.items.map((e: any, i: number) => ({
                id: e.id ?? this.nextId++,
                company: e.company ?? '',
                role: e.role ?? '',
                startDate: e.startDate ?? '',
                endDate: e.endDate ?? '',
                current: e.current ?? false,
                description: e.description ?? '',
              }))
            : current.experience,
        };

      // ───────────────── EDUCATION ─────────────────
      case 'EDUCATION':
        return {
          ...current,
          education: Array.isArray(c.items)
            ? c.items.map((e: any) => ({
                id: e.id ?? this.nextId++,
                institution: e.institution ?? '',
                degree: e.degree ?? '',
                field: e.field ?? '',
                year: e.year ?? '',
              }))
            : current.education,
        };

      // ───────────────── PROJECTS ─────────────────
      case 'PROJECTS':
        return {
          ...current,
          projects: Array.isArray(c.items)
            ? c.items.map((p: any) => ({
                id: p.id ?? this.nextId++,
                name: p.name ?? '',
                role: p.role ?? '',
                url: p.url ?? '',
                startDate: p.startDate ?? '',
                endDate: p.endDate ?? '',
                description: p.description ?? '',
              }))
            : current.projects,
        };

      // ───────────────── SKILLS ─────────────────
      case 'SKILLS':
        return {
          ...current,
          skills: Array.isArray(c.items)
            ? c.items.filter((s: any) => typeof s === 'string')
            : current.skills,
        };

      // ───────────────── DEFAULT ─────────────────
      default:
        console.warn('⚠️ Unknown section type:', section.sectionType);
        return current;
    }
  }

  // ── Derived: accent colour ─────────────────────────────────────────────────
  get accentColor(): string {
    return (
      this.selectedTemplate()?.cssStyles?.match(/--accent:\s*(#[0-9a-fA-F]{3,8})/)?.[1] ??
      TEMPLATE_ACCENT_PALETTE[this.templateId()] ??
      '#6366f1'
    );
  }

  // ── Derived: raw HTML string (used for PDF export) ────────────────────────
  private get rawResumeHtml(): string {
    const template = this.selectedTemplate();
    return template?.htmlLayout
      ? buildTemplatePreviewHtml(
          template.htmlLayout,
          template.cssStyles ?? '',
          this.resume,
        )
      : buildUniversalPreviewHtml(this.resume, this.accentColor);
  }

  // ── Derived: sanitised live-preview HTML ───────────────────────────────────
  get livePreviewHtml(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.rawResumeHtml);
  }

  // ── Section navigation ─────────────────────────────────────────────────────
  onSectionChanged(sectionId: string): void {
    this.activeSection.set(sectionId);
  }

  // ── AI patch (from toolbar modals: tailor / translate) ────────────────────
  onResumePatched(patch: Partial<ResumeData>): void {
    this.resume = { ...this.resume, ...patch };
  }

  // ── Experience handlers ────────────────────────────────────────────────────
  onAddExperience(): void {
    const blank: ExperienceItem = {
      id: this.nextId++,
      company: '', role: '',
      startDate: '', endDate: '',
      current: false, description: '',
    };
    this.resume = { ...this.resume, experience: [...this.resume.experience, blank] };
  }

  onRemoveExperience(id: number): void {
    this.resume = {
      ...this.resume,
      experience: this.resume.experience.filter(e => e.id !== id),
    };
  }

  // ── Education handlers ─────────────────────────────────────────────────────
  onAddEducation(): void {
    const blank: EducationItem = {
      id: this.nextId++,
      institution: '', degree: '', field: '', year: '',
    };
    this.resume = { ...this.resume, education: [...this.resume.education, blank] };
  }

  onRemoveEducation(id: number): void {
    this.resume = {
      ...this.resume,
      education: this.resume.education.filter(e => e.id !== id),
    };
  }

  // ── Project handlers ───────────────────────────────────────────────────────
  onAddProject(): void {
    const blank: ProjectItem = {
      id: this.nextId++,
      name: '', role: '', url: '',
      startDate: '', endDate: '', description: '',
    };
    this.resume = { ...this.resume, projects: [...this.resume.projects, blank] };
  }

  onRemoveProject(id: number): void {
    this.resume = {
      ...this.resume,
      projects: this.resume.projects.filter(p => p.id !== id),
    };
  }

  // ── Skills handlers ────────────────────────────────────────────────────────
  onAddSkill(skill: string): void {
    const trimmed = skill.trim();
    if (trimmed && !this.resume.skills.includes(trimmed)) {
      this.resume = { ...this.resume, skills: [...this.resume.skills, trimmed] };
    }
  }

  onRemoveSkill(skill: string): void {
    this.resume = {
      ...this.resume,
      skills: this.resume.skills.filter(s => s !== skill),
    };
  }

  // ── Top-level actions ──────────────────────────────────────────────────────
  onBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onExportPdf(): void {
    const resumeHtml = this.rawResumeHtml;
    const fullName   = (this.resume.fullName || 'resume').replace(/\s+/g, '_');

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Popup blocked — please allow popups for this site and try again.');
      return;
    }

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${fullName}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }
    @page {
      size: A4;
      margin: 0;
    }
    @media print {
      html, body { width: 210mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${resumeHtml}</body>
</html>`);

    printWindow.document.close();

    // Wait for resources (fonts, images) then print
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }

  /**
   * Persist the resume and its sections to the backend.
   *
   * Flow:
   *  1. Create or update the Resume record.
   *  2. Build sections from local ResumeData and bulk-upsert them.
   *  3. Show a brief "Saved!" indicator and update the URL with the resumeId.
   */
  onSave(): void {
    this.saveStatus.set('saving');
    const userId = this.getCurrentUserId();

    const resumeDTO: ResumeDTO = {
      ...(this.meta.resumeId ? { id: this.meta.resumeId } : {}),
      userId,
      title:          this.resume.fullName || 'My Resume',
      targetJobTitle: this.resume.jobTitle,
      templateId:     this.templateId(),
      status:         'DRAFT',
      language:       'en',
    };

    const resumeOp$ = this.meta.resumeId
      ? this.resumeService.update(this.meta.resumeId, resumeDTO)
      : this.resumeService.create(resumeDTO);

    resumeOp$.pipe(
      catchError(err => {
        console.error('Resume save failed', err);
        this.saveStatus.set('error');
        return of(null);
      }),
      switchMap(saved => {
        if (!saved) return of(null);

        const resumeId = saved.resumeId;

        // Guard: backend must return a valid id before saving sections
        if (!resumeId) {
          console.error('Resume save succeeded but returned no id', saved);
          this.saveStatus.set('error');
          return of(null);
        }

        this.meta.resumeId = resumeId;

        // Reflect new resumeId in URL without re-triggering navigation
        this.router.navigate([], {
          relativeTo:          this.route,
          queryParams:         { resumeId, templateId: this.templateId() },
          queryParamsHandling: 'merge',
          replaceUrl:          true,
        });

        const sectionPayloads = this.buildSectionPayloads(resumeId);
        return this.sectionService.bulkUpdate(resumeId, sectionPayloads).pipe(
          catchError(err => {
            console.error('Sections save failed', err);
            this.saveStatus.set('error');
            return of(null);
          })
        );
      })
    ).subscribe(result => {
      if (result !== null) {
        this.saveStatus.set('saved');
        setTimeout(() => this.saveStatus.set('idle'), 2000);
      }
    });
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private getCurrentUserId(): number {
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      return user?.id ?? 1;
    } catch {
      return 1;
    }
  }

  /**
   * Converts the local ResumeData into the flat list of ResumeSection payloads
   * that the bulk-update endpoint expects.
   */
  private buildSectionPayloads(resumeId: number): ResumeSection[] {
    const base = (type: SectionType, order: number): Partial<ResumeSection> => ({
      ...(this.meta.sectionIds[SECTION_TYPE_TO_KEY[type]]
        ? { sectionId: this.meta.sectionIds[SECTION_TYPE_TO_KEY[type]] }
        : {}),
      resumeId,
      sectionType:  type,
      isVisible:    true,
      displayOrder: order,
    });

    return [
      {
        ...(base('PERSONAL', 0) as ResumeSection),
        title:   'Personal Information',
        content: {
          fullName: this.resume.fullName,
          jobTitle: this.resume.jobTitle,
          email:    this.resume.email,
          phone:    this.resume.phone,
          location: this.resume.location,
          website:  this.resume.website,
          linkedin: this.resume.linkedin,
          summary:  this.resume.summary,
        },
      },
      {
        ...(base('EXPERIENCE', 1) as ResumeSection),
        title:   'Experience',
        content: { items: this.resume.experience },
      },
      {
        ...(base('EDUCATION', 2) as ResumeSection),
        title:   'Education',
        content: { items: this.resume.education },
      },
      {
        ...(base('PROJECTS', 3) as ResumeSection),
        title:   'Projects',
        content: { items: this.resume.projects },
      },
      {
        ...(base('SKILLS', 4) as ResumeSection),
        title:   'Skills',
        content: { items: this.resume.skills },
      },
    ];
  }
}
