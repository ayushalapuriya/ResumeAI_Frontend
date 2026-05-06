// ─────────────────────────────────────────────────────────────────────────────
// SectionService – CRUD for /api/sections
// ─────────────────────────────────────────────────────────────────────────────

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type SectionType =
  | 'PERSONAL'
  | 'EXPERIENCE'
  | 'EDUCATION'
  | 'SKILLS'
  | 'CERTIFICATIONS'
  | 'PROJECTS';

export interface ResumeSection {
  id?: string;
  sectionId?: string;
  resumeId: number;
  sectionType: SectionType;
  title: string;
  /** Flexible bag of section-specific fields (e.g. personal info, experience items, etc.) */
  content: Record<string, unknown>;
  displayOrder?: number;
  isVisible?: boolean;
  aiGenerated?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SectionService {
  private BASE = 'http://localhost:8084/api/sections';

  constructor(private http: HttpClient) {}

  /** Get all sections for a resume */
  getByResume(resumeId: number): Observable<ResumeSection[]> {
    return this.http.get<ResumeSection[]>(`${this.BASE}/resume/${resumeId}`).pipe(
      catchError(() => of([]))
    );
  }

  /** Get a single section by ID */
  getById(id: string): Observable<ResumeSection> {
    return this.http.get<ResumeSection>(`${this.BASE}/${id}`);
  }

  /** Get section by type for a resume */
  getByType(resumeId: number, type: SectionType): Observable<ResumeSection> {
    return this.http.get<ResumeSection>(`${this.BASE}/type`, {
      params: { resumeId: resumeId.toString(), type }
    });
  }

  /** Create a new section */
  add(section: ResumeSection): Observable<ResumeSection> {
    return this.http.post<ResumeSection>(this.BASE, section);
  }

  /** Update an existing section */
  update(id: string, section: ResumeSection): Observable<ResumeSection> {
    return this.http.put<ResumeSection>(`${this.BASE}/${id}`, section);
  }

  /** Delete a single section */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/${id}`);
  }

  /** Delete all sections for a resume */
  deleteAll(resumeId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE}/resume/${resumeId}`);
  }

  /** Bulk upsert sections for a resume */
  bulkUpdate(resumeId: number, sections: ResumeSection[]): Observable<ResumeSection[]> {
    return this.http.post<ResumeSection[]>(`${this.BASE}/bulk/${resumeId}`, sections);
  }

  /** Reorder sections by providing ordered list of sectionIds */
  reorder(resumeId: number, sectionIds: string[]): Observable<void> {
    return this.http.post<void>(`${this.BASE}/reorder/${resumeId}`, sectionIds);
  }

  /** Toggle visibility of a section */
  toggleVisibility(id: string): Observable<void> {
    return this.http.patch<void>(`${this.BASE}/toggle/${id}`, {});
  }
}
