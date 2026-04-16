// ─────────────────────────────────────────────────────────────────────────────
// ResumeService – CRUD for /api/resumes
// ─────────────────────────────────────────────────────────────────────────────

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ResumeDTO {
  resumeId?: number;
  userId?: number;
  title: string;
  targetJobTitle?: string;
  templateId?: number;
  atsScore?: number;
  status?: string;
  language?: string;
  viewCount?: number;
  public?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private BASE = 'http://localhost:8080/api/resumes';

  constructor(private http: HttpClient) {}

  /** Get all resumes for a user */
  getByUser(userId: number): Observable<ResumeDTO[]> {
    return this.http.get<ResumeDTO[]>(`${this.BASE}/user/${userId}`).pipe(
      catchError(() => of([]))
    );
  }

  /** Get a single resume */
  getById(id: number): Observable<ResumeDTO> {
    return this.http.get<ResumeDTO>(`${this.BASE}/${id}`);
  }

  /** Create a new resume */
  create(dto: ResumeDTO): Observable<ResumeDTO> {
    return this.http.post<ResumeDTO>(this.BASE, dto);
  }

  /** Update an existing resume */
  update(id: number, dto: ResumeDTO): Observable<ResumeDTO> {
    return this.http.put<ResumeDTO>(`${this.BASE}/${id}`, dto);
  }

  /**
   * Delete a resume.
   * responseType:'text' is required so Angular doesn't try to parse an empty
   * 200/204 body as JSON — which would silently trigger the error callback
   * even on a successful delete.
   */
  delete(id: number): Observable<string> {
    return this.http.delete(`${this.BASE}/${id}`, { responseType: 'text' });
  }

  /** Duplicate a resume */
  duplicate(id: number): Observable<ResumeDTO> {
    return this.http.post<ResumeDTO>(`${this.BASE}/${id}/duplicate`, {});
  }

  /** Get all public resumes */
  getPublic(): Observable<ResumeDTO[]> {
    return this.http.get<ResumeDTO[]>(`${this.BASE}/public`).pipe(
      catchError(() => of([]))
    );
  }

  /** Publish a resume */
  publish(id: number): Observable<string> {
    return this.http.patch(`${this.BASE}/${id}/publish`, {}, { responseType: 'text' });
  }

  /** Unpublish a resume */
  unpublish(id: number): Observable<string> {
    return this.http.patch(`${this.BASE}/${id}/unpublish`, {}, { responseType: 'text' });
  }

  /** Update ATS score */
  updateAts(id: number, score: number): Observable<string> {
    return this.http.patch(`${this.BASE}/${id}/ats`, null, {
      params: { score: score.toString() },
      responseType: 'text',
    });
  }

  /** Increment view count */
  incrementView(id: number): Observable<string> {
    return this.http.patch(`${this.BASE}/${id}/view`, {}, { responseType: 'text' });
  }
}
