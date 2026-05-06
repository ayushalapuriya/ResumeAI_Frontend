import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import templateService from '../../services/templateService';
import resumeService from '../../services/resumeService';
import sectionService from '../../services/sectionService';
import { 
  DEFAULT_RESUME_DATA, 
  BUILDER_SECTIONS, 
  TEMPLATE_ACCENT_PALETTE 
} from './utils/resumeDefaults';
import { 
  buildUniversalPreviewHtml, 
  buildTemplatePreviewHtml 
} from './utils/previewHtmlBuilder';

// Components
import BuilderTopbar from './components/BuilderTopbar';
import SectionNav from './components/SectionNav';
import FormPanel from './components/FormPanel';
import PreviewPanel from './components/PreviewPanel';

import './ResumeBuilder.css';

const SECTION_TYPE_TO_KEY = {
  PERSONAL:       'personal',
  EXPERIENCE:     'experience',
  EDUCATION:      'education',
  SKILLS:         'skills',
  PROJECTS:       'projects',
  CERTIFICATIONS: 'summary', // Based on original code mapping
};

const ResumeBuilder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('personal');
  const [templateId, setTemplateId] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resume, setResume] = useState(structuredClone(DEFAULT_RESUME_DATA));
  const [meta, setMeta] = useState({ resumeId: null, sectionIds: {} });
  const [nextId, setNextId] = useState(100);

  const tid = parseInt(searchParams.get('templateId') || '1');
  const rid = searchParams.get('resumeId') ? parseInt(searchParams.get('resumeId')) : null;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const mergeSection = useCallback((current, section) => {
    let content = section.content;
    if (!content) return current;

    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch (err) {
        console.error('Failed to parse section content:', content);
        return current;
      }
    }

    switch (section.sectionName) {
      case 'PERSONAL':
        return {
          ...current,
          fullName: content.fullName ?? current.fullName,
          jobTitle: content.jobTitle ?? current.jobTitle,
          email:    content.email    ?? current.email,
          phone:    content.phone    ?? current.phone,
          location: content.location ?? current.location,
          website:  content.website  ?? current.website,
          linkedin: content.linkedin ?? current.linkedin,
          summary:  content.summary  ?? current.summary,
        };
      case 'EXPERIENCE':
        return {
          ...current,
          experience: Array.isArray(content.items)
            ? content.items.map((e) => ({
                id: e.id ?? Math.random(),
                company: e.company ?? '',
                role: e.role ?? '',
                startDate: e.startDate ?? '',
                endDate: e.endDate ?? '',
                current: e.current ?? false,
                description: e.description ?? '',
              }))
            : current.experience,
        };
      case 'EDUCATION':
        return {
          ...current,
          education: Array.isArray(content.items)
            ? content.items.map((e) => ({
                id: e.id ?? Math.random(),
                institution: e.institution ?? '',
                degree: e.degree ?? '',
                field: e.field ?? '',
                year: e.year ?? '',
              }))
            : current.education,
        };
      case 'PROJECTS':
        return {
          ...current,
          projects: Array.isArray(content.items)
            ? content.items.map((p) => ({
                id: p.id ?? Math.random(),
                name: p.name ?? '',
                role: p.role ?? '',
                url: p.url ?? '',
                startDate: p.startDate ?? '',
                endDate: p.endDate ?? '',
                description: p.description ?? '',
              }))
            : current.projects,
        };
      case 'SKILLS':
        return {
          ...current,
          skills: Array.isArray(content.items)
            ? content.items.filter((s) => typeof s === 'string')
            : current.skills,
        };
      default:
        return current;
    }
  }, []);

  const loadResumeFromApi = useCallback(async (resumeId) => {
    setIsLoading(true);
    try {
      const [resumeDto, sections] = await Promise.all([
        resumeService.getById(resumeId),
        sectionService.getByResume(resumeId)
      ]);

      if (resumeDto) {
        const sectionIds = {};
        let updatedResume = {
          ...structuredClone(DEFAULT_RESUME_DATA),
          fullName: resumeDto.title ?? DEFAULT_RESUME_DATA.fullName,
          jobTitle: resumeDto.targetJobTitle ?? DEFAULT_RESUME_DATA.jobTitle,
        };

        for (const section of sections) {
          const key = SECTION_TYPE_TO_KEY[section.sectionName];
          const sid = section.id;
          if (sid && key) {
            sectionIds[key] = sid;
          }
          updatedResume = mergeSection(updatedResume, section);
        }

        setResume(updatedResume);
        setMeta({ resumeId: resumeDto.resumeId, sectionIds });
      }
    } catch (err) {
      console.error('Failed to load resume:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mergeSection]);


  // ── Derived State ────────────────────────────────────────────────────────

  const accentColor = useMemo(() => {
    return (
      selectedTemplate?.cssStyles?.match(/--accent:\s*(#[0-9a-fA-F]{3,8})/)?.[1] ??
      TEMPLATE_ACCENT_PALETTE[templateId] ??
      '#6366f1'
    );
  }, [selectedTemplate, templateId]);

  const rawResumeHtml = useMemo(() => {
    return selectedTemplate?.htmlLayout
      ? buildTemplatePreviewHtml(
          selectedTemplate.htmlLayout,
          selectedTemplate.cssStyles ?? '',
          resume
        )
      : buildUniversalPreviewHtml(resume, accentColor);
  }, [selectedTemplate, resume, accentColor]);

  const handleExportPdf = useCallback(() => {
    const fullName = (resume.fullName || 'resume').replace(/\s+/g, '_');
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
    @page { size: A4; margin: 0; }
    @media print {
      html, body { width: 210mm; }
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>${rawResumeHtml}</body>
</html>`);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }, [resume.fullName, rawResumeHtml]);

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setTemplateId(tid);
    const fetchTemplate = async () => {
      const t = await templateService.getTemplateById(tid);
      setSelectedTemplate(t);
    };
    fetchTemplate();

    if (rid) {
      loadResumeFromApi(rid);
    }
  }, [tid, rid, loadResumeFromApi]);

  useEffect(() => {
    if (searchParams.get('export') === 'pdf' && !isLoading && rawResumeHtml && selectedTemplate) {
      const timer = setTimeout(() => {
        handleExportPdf();
        setSearchParams((prev) => {
          prev.delete('export');
          return prev;
        }, { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, rawResumeHtml, selectedTemplate, searchParams, setSearchParams, handleExportPdf]);


  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleResumeUpdate = (patch) => {
    setResume(prev => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const user = JSON.parse(localStorage.getItem('user') ?? '{}');
      const userId = user?.userId ?? user?.id;

      const resumeDto = {
        ...(meta.resumeId ? { id: meta.resumeId } : {}),
        userId,
        title: resume.fullName || 'My Resume',
        templateId: templateId,
        templateName: selectedTemplate?.name || 'Default Template',
        templateCategory: selectedTemplate?.category || 'General',
        summary: resume.summary || '',
        resumeContent: JSON.stringify(resume),
        status: 'DRAFT',
      };

      const saved = meta.resumeId
        ? await resumeService.update(meta.resumeId, resumeDto)
        : await resumeService.create(resumeDto);

      if (saved && saved.id) {
        setMeta(prev => ({ ...prev, resumeId: saved.id }));

        // Update URL
        setSearchParams({ resumeId: saved.id, templateId });

        const sectionPayloads = [
          {
            sectionId: meta.sectionIds.personal,
            sectionName: 'PERSONAL',
            content: {
              fullName: resume.fullName,
              jobTitle: resume.jobTitle,
              email:    resume.email,
              phone:    resume.phone,
              location: resume.location,
              website:  resume.website,
              linkedin: resume.linkedin,
              summary:  resume.summary,
            },
            displayOrder: 0
          },
          {
            sectionId: meta.sectionIds.experience,
            sectionName: 'EXPERIENCE',
            content: { items: resume.experience },
            displayOrder: 1
          },
          {
            sectionId: meta.sectionIds.education,
            sectionName: 'EDUCATION',
            content: { items: resume.education },
            displayOrder: 2
          },
          {
            sectionId: meta.sectionIds.projects,
            sectionName: 'PROJECTS',
            content: { items: resume.projects },
            displayOrder: 3
          },
          {
            sectionId: meta.sectionIds.skills,
            sectionName: 'SKILLS',
            content: { items: resume.skills },
            displayOrder: 4
          }
        ];

        try {
          const savedSections = await sectionService.upsertAll(saved.id, sectionPayloads);
          
          // Update meta with new section IDs
          const newSectionIds = { ...meta.sectionIds };
          savedSections.forEach(ss => {
            if (ss && ss.id && ss.sectionName) {
              const key = SECTION_TYPE_TO_KEY[ss.sectionName];
              if (key) newSectionIds[key] = ss.id;
            }
          });
          setMeta(prev => ({ ...prev, sectionIds: newSectionIds }));
        } catch (sectionErr) {
          console.warn('Sections save failed (resume itself saved OK):', sectionErr);
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        // saved is null/undefined — still unblock the button
        setSaveStatus('idle');
      }
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };




  const handleAddExperience = () => {
    const blank = {
      id: nextId,
      company: '', role: '',
      startDate: '', endDate: '',
      current: false, description: '',
    };
    setNextId(n => n + 1);
    setResume(prev => ({ ...prev, experience: [...prev.experience, blank] }));
  };

  const handleRemoveExperience = (id) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const handleAddEducation = () => {
    const blank = {
      id: nextId,
      institution: '', degree: '', field: '', year: '',
    };
    setNextId(n => n + 1);
    setResume(prev => ({ ...prev, education: [...prev.education, blank] }));
  };

  const handleRemoveEducation = (id) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const handleAddProject = () => {
    const blank = {
      id: nextId,
      name: '', role: '', url: '',
      startDate: '', endDate: '', description: '',
    };
    setNextId(n => n + 1);
    setResume(prev => ({ ...prev, projects: [...prev.projects, blank] }));
  };

  const handleRemoveProject = (id) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !resume.skills.includes(trimmed)) {
      setResume(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
  };

  const handleRemoveSkill = (skill) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  return (
    <div className="builder-shell">
      <BuilderTopbar
        accentColor={accentColor}
        saveStatus={saveStatus}
        isLoading={isLoading}
        resume={resume}
        onBack={() => navigate('/dashboard')}
        onExportPdf={handleExportPdf}
        onSave={handleSave}
        onPatch={handleResumeUpdate}
      />

      <div className="builder-body">
        <SectionNav
          sections={BUILDER_SECTIONS}
          activeSection={activeSection}
          selectedTemplate={selectedTemplate}
          templateId={templateId}
          accentColor={accentColor}
          onSectionChange={setActiveSection}
        />

        <FormPanel
          resume={resume}
          activeSection={activeSection}
          accentColor={accentColor}
          onUpdate={handleResumeUpdate}
          onAddExperience={handleAddExperience}
          onRemoveExperience={handleRemoveExperience}
          onAddEducation={handleAddEducation}
          onRemoveEducation={handleRemoveEducation}
          onAddProject={handleAddProject}
          onRemoveProject={handleRemoveProject}
          onAddSkill={handleAddSkill}
          onRemoveSkill={handleRemoveSkill}
        />

        <PreviewPanel
          previewHtml={rawResumeHtml}
          onExportPdf={handleExportPdf}
        />
      </div>
    </div>
  );
};

export default ResumeBuilder;
