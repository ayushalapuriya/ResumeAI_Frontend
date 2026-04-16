// ─────────────────────────────────────────────────────────────────────────────
// Resume Domain Models
// All interfaces describing the resume data shape used across the builder.
// ─────────────────────────────────────────────────────────────────────────────

export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  role: string;
  url: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: string[];
}

/** Sidebar navigation section descriptor */
export interface SectionItem {
  id: string;
  label: string;
  icon: SectionIconKey;
}

export type SectionIconKey = 'person' | 'notes' | 'work' | 'school' | 'code' | 'bolt';

/**
 * Metadata linking the local ResumeData to persisted API records.
 * Populated after the resume and its sections are loaded / created.
 */
export interface ResumeMeta {
  /** ID of the persisted resume record */
  resumeId: number | null;
  /** Map from local section key → persisted sectionId (MongoDB ObjectId string) */
  sectionIds: Record<string, string>;
}
