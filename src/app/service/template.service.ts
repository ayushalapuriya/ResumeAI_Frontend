import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Template } from '../core/models/template.model';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private BASE_URL = 'http://localhost:8080/api/templates';

  private mockTemplates: Template[] = [
    { templateId: 1, name: 'Executive Pro',  category: 'Professional', isPremium: true,  isActive: true, usageCount: 12400, thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'A polished executive layout.', createdAt: '' },
    { templateId: 2, name: 'Creative Edge',  category: 'Creative',     isPremium: false, isActive: true, usageCount: 9800,  thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Bold and creative.', createdAt: '' },
    { templateId: 3, name: 'Minimal Light',  category: 'Minimal',      isPremium: false, isActive: true, usageCount: 21000, thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Clean and minimal.', createdAt: '' },
    { templateId: 4, name: 'Tech Stack',     category: 'Modern',       isPremium: false, isActive: true, usageCount: 5200,  thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Great for developers.', createdAt: new Date().toISOString() },
    { templateId: 5, name: 'Elegant Script', category: 'Executive',    isPremium: true,  isActive: true, usageCount: 7100,  thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Refined executive style.', createdAt: '' },
    { templateId: 6, name: 'Metro Grid',     category: 'Modern',       isPremium: false, isActive: true, usageCount: 15300, thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Grid-based modern layout.', createdAt: '' },
    { templateId: 7, name: 'Classic Clean',  category: 'Professional', isPremium: false, isActive: true, usageCount: 18900, thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Timeless professional design.', createdAt: '' },
    { templateId: 8, name: 'Bold Statement', category: 'Creative',     isPremium: true,  isActive: true, usageCount: 4400,  thumbnailUrl: '', htmlLayout: '', cssStyles: '', description: 'Make an impression.', createdAt: new Date().toISOString() },
  ];

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(this.BASE_URL).pipe(
      catchError(() => of(this.mockTemplates))
    );
  }

  getTemplateById(id: number): Observable<Template | undefined> {
    return this.http.get<Template>(`${this.BASE_URL}/${id}`).pipe(
      catchError(() => of(this.mockTemplates.find(t => t.templateId === id)))
    );
  }
}
