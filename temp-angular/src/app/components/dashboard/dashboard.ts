import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Template } from '../../core/models/template.model';
import { User } from '../../core/models/user.model';
import { AuthService } from '../../service/auth.service';
import { TemplateService } from '../../service/template.service';
import { ResumeService, ResumeDTO } from '../../service/resume.service';
import { ToastService } from '../../service/toast.service';

// Sub-components
import { DashboardSidebar } from './components/sidebar/sidebar';
import { ResumeList, SkillChip } from './components/resume-list/resume-list';
import { ResumeEntry } from './components/resume-card/resume-card';
import { TemplateGallery } from './components/template-gallery/template-gallery';
import { ProfilePage } from './components/profile-page/profile-page';
import { Toast } from './components/toast/toast';

const CARD_COLORS = ['#6366f1', '#0ea5e9', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardSidebar,
    ResumeList,
    TemplateGallery,
    ProfilePage,
    Toast,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  activePage = signal<'resume' | 'templates' | 'profile'>('resume');
  resumesLoading = signal(true);

  currentUser: User | null = null;
  userRole = 'Full Stack Developer';
  resumes: ResumeEntry[] = [];

  activeSkills: SkillChip[] = [
    { name: 'React',      bg: 'rgba(99,102,241,.1)',  color: '#6366f1', border: 'rgba(99,102,241,.25)'  },
    { name: 'Node.js',    bg: 'rgba(14,165,233,.1)',  color: '#0ea5e9', border: 'rgba(14,165,233,.25)'  },
    { name: 'TypeScript', bg: 'rgba(167,139,250,.1)', color: '#8b5cf6', border: 'rgba(167,139,250,.25)' },
    { name: 'MongoDB',    bg: 'rgba(34,197,94,.1)',   color: '#16a34a', border: 'rgba(34,197,94,.25)'   },
    { name: 'AWS',        bg: 'rgba(245,158,11,.1)',  color: '#d97706', border: 'rgba(245,158,11,.25)'  },
    { name: 'Docker',     bg: 'rgba(248,113,113,.1)', color: '#dc2626', border: 'rgba(248,113,113,.25)' },
    { name: 'GraphQL',    bg: 'rgba(56,189,248,.1)',  color: '#0284c7', border: 'rgba(56,189,248,.25)'  },
    { name: 'Python',     bg: 'rgba(251,146,60,.1)',  color: '#ea580c', border: 'rgba(251,146,60,.25)'  },
  ];

  allTemplates: Template[] = [];
  templatesLoading = signal(true);

  private toast = inject(ToastService);

  constructor(
    private router: Router,
    private authService: AuthService,
    private templateService: TemplateService,
    private resumeService: ResumeService,
  ) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;

    this.templateService.getTemplates().subscribe({
      next:  (templates) => { this.allTemplates = templates; this.templatesLoading.set(false); },
      error: ()          => { this.templatesLoading.set(false); },
    });

    if (this.currentUser?.id) {
      this.loadResumes(this.currentUser.id);
    } else {
      this.resumesLoading.set(false);
    }
  }

  // ── Resume API ──────────────────────────────────────────────────────────────

  private loadResumes(userId: number): void {
    this.resumesLoading.set(true);
    this.toast.loading('Loading your resumes…');

    this.resumeService.getByUser(userId).subscribe({
      next: (dtos) => {
        this.resumes = dtos.map((dto, i) => this.dtoToEntry(dto, i));
        this.resumesLoading.set(false);
        this.toast.hide();
      },
      error: (err) => {
        console.error('Failed to load resumes:', err);
        this.resumesLoading.set(false);
        this.toast.error('Could not load resumes');
      },
    });
  }

  private dtoToEntry(dto: ResumeDTO, index: number): ResumeEntry {
    return {
      resumeId:     dto.resumeId!,
      name:         dto.title,
      updated:      dto.status ?? 'DRAFT',
      completeness: dto.atsScore ?? 0,
      active:       index === 0,
      color:        CARD_COLORS[index % CARD_COLORS.length],
    };
  }

  get activeResume(): ResumeEntry | undefined {
    return this.resumes.find(r => r.active);
  }

  get score(): number {
    return this.activeResume?.completeness ?? 0;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  setPage(page: 'resume' | 'templates' | 'profile') {
    this.activePage.set(page);
    this.openedFromCreate = false;
  }

  onLogout() {
    this.authService.logout();
    this.toast.success('Logged out successfully');
    setTimeout(() => this.router.navigate(['/login']), 1400);
  }

  // ── Resume actions ──────────────────────────────────────────────────────────

  createNewResume() {
    this.activePage.set('templates');
    this.openedFromCreate = true;
  }

  openedFromCreate = false;

  editResume(r: ResumeEntry) {
    this.router.navigate(['/resume-builder'], { queryParams: { resumeId: r.resumeId } });
  }

  downloadResume(r: ResumeEntry) {
    this.toast.info(`Downloading "${r.name}"…`);
  }

  duplicateResume(r: ResumeEntry) {
    this.toast.loading('Duplicating resume…');
    this.resumeService.duplicate(r.resumeId).subscribe({
      next: (dto) => {
        const copy = this.dtoToEntry(dto, this.resumes.length);
        this.resumes = [...this.resumes, copy];
        this.toast.success('Resume duplicated successfully');
      },
      error: () => this.toast.error('Could not duplicate resume'),
    });
  }

  deleteResume(r: ResumeEntry) {
    this.toast.loading(`Deleting "${r.name}"…`);
    this.resumeService.delete(r.resumeId).subscribe({
      next: () => {
        this.resumes = this.resumes.filter(x => x.resumeId !== r.resumeId);
        this.toast.success(`"${r.name}" deleted successfully`);
      },
      error: () => this.toast.error('Could not delete resume'),
    });
  }

  // ── Template actions ────────────────────────────────────────────────────────

  createBlankResume() {
    this.openedFromCreate = false;
    this.router.navigate(['/resume-builder']);
  }

  useTemplate(t: Template) {
    this.router.navigate(['/resume-builder'], { queryParams: { templateId: t.templateId } });
  }
  
  showToast(msg: String){
    
  }
}
