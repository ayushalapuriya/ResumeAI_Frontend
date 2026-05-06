// ─────────────────────────────────────────────────────────────────────────────
// AiService – wraps every endpoint exposed by the AI micro-service (port 8085)
// ─────────────────────────────────────────────────────────────────────────────

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AiQuota {
  used: number;
  limit: number;
  remaining: number;
}

export interface AiHistoryEntry {
  operation: string;
  timestamp: string;
  input?: Record<string, string>;
  output?: unknown;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private BASE = 'http://localhost:8085/ai';

  constructor(private http: HttpClient) {}

  /** Generate a professional summary from job title + existing summary */
  generateSummary(payload: Record<string, string>): Observable<{ result?: string; [k: string]: unknown }> {
    return this.http.post<any>(`${this.BASE}/generateSummary`, payload);
  }

  /** Rewrite / improve any section text */
  improveSection(payload: Record<string, string>): Observable<{ result?: string; [k: string]: unknown }> {
    return this.http.post<any>(`${this.BASE}/improveSection`, payload);
  }

  /** Generate bullet-point descriptions for an experience entry */
  generateBullets(payload: Record<string, string>): Observable<string[]> {
    return this.http.post<string[]>(`${this.BASE}/generateBullets`, payload);
  }

  /** Suggest skills based on job title / description */
  suggestSkills(payload: Record<string, string>): Observable<string[]> {
    return this.http.post<string[]>(`${this.BASE}/suggestSkills`, payload);
  }

  /** Tailor the entire resume for a specific job description */
  tailorForJob(payload: Record<string, string>): Observable<{ result?: string; [k: string]: unknown }> {
    return this.http.post<any>(`${this.BASE}/tailorForJob`, payload);
  }

  /** Check ATS compatibility and return a score + suggestions */
  checkAts(payload: Record<string, string>): Observable<{ score?: number; suggestions?: string[]; [k: string]: unknown }> {
    return this.http.post<any>(`${this.BASE}/checkAts`, payload);
  }

  /** Generate a cover letter */
  generateCoverLetter(payload: Record<string, string>): Observable<{ result?: string; [k: string]: unknown }> {
    return this.http.post<any>(`${this.BASE}/generateCoverLetter`, payload);
  }

  /** Translate resume content to another language */
  translate(payload: Record<string, string>): Observable<Record<string, string>> {
    return this.http.post<Record<string, string>>(`${this.BASE}/translate`, payload);
  }

  /** Get AI usage quota for a user */
  getQuota(userId: number): Observable<AiQuota> {
    return this.http.get<AiQuota>(`${this.BASE}/quota/${userId}`);
  }

  /** Get AI operation history for a user */
  getHistory(userId: number): Observable<AiHistoryEntry[]> {
    return this.http.get<AiHistoryEntry[]>(`${this.BASE}/history/${userId}`);
  }
}
