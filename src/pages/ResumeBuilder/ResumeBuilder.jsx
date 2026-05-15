import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { renderToString } from 'react-dom/server';
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
import { getTemplateComponent } from './utils/TemplateRegistry';

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
  const [builderSections, setBuilderSections] = useState([...BUILDER_SECTIONS]);
  const [accentColor, setAccentColor] = useState('#6366f1');
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

    switch (section.sectionType) {
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
          const key = SECTION_TYPE_TO_KEY[section.sectionType];
          const sid = section.sectionId;
          if (sid && key) {
            sectionIds[key] = sid;
          }
          updatedResume = mergeSection(updatedResume, section);
        }

        setResume(updatedResume);
        setMeta(prev => ({ ...prev, resumeId: resumeId, sectionIds }));
      }
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mergeSection]);

  const completionPercentage = useMemo(() => {
    let score = 0;
    const total = 10; // Essential milestones

    if (resume.fullName) score++;
    if (resume.email) score++;
    if (resume.phone) score++;
    if (resume.summary && resume.summary.length > 50) score++;
    if (resume.experience.length > 0) score++;
    if (resume.education.length > 0) score++;
    if (resume.skills.length > 2) score++;
    if (resume.projects.length > 0) score++;
    if (resume.jobTitle) score++;
    if (meta.resumeId) score++; // Saved at least once

    return Math.round((score / total) * 100);
  }, [resume, meta.resumeId]);


  // ── Derived State ────────────────────────────────────────────────────────

  const handleToggleVisibility = useCallback((id) => {
    setBuilderSections(prev => prev.map(s => 
      s.id === id ? { ...s, hidden: !s.hidden } : s
    ));
  }, []);

  const handleMoveSection = useCallback((index, direction) => {
    setBuilderSections(prev => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  }, []);

  const visibleResumeData = useMemo(() => {
    const data = { ...resume };
    builderSections.forEach(s => {
      if (s.hidden) {
        if (s.id === 'summary') data.summary = '';
        if (s.id === 'experience') data.experience = [];
        if (s.id === 'education') data.education = [];
        if (s.id === 'projects') data.projects = [];
        if (s.id === 'skills') data.skills = [];
      }
    });
    return data;
  }, [resume, builderSections]);

  const TemplateComponent = useMemo(() => {
    return getTemplateComponent(templateId, selectedTemplate);
  }, [templateId, selectedTemplate]);

  const handleExportPdf = useCallback(() => {
    const fullName = (resume.fullName || 'resume').replace(/\s+/g, '_');
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      alert('Popup blocked — please allow popups for this site and try again.');
      return;
    }

    const htmlContent = renderToString(<TemplateComponent data={visibleResumeData} accentColor={accentColor} />);

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${fullName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  }, [resume.fullName, TemplateComponent, visibleResumeData, accentColor]);

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    setTemplateId(tid);
    const fetchTemplate = async () => {
      const t = await templateService.getTemplateById(tid);
      setSelectedTemplate(t);
      if (t?.cssStyles) {
        const match = t.cssStyles.match(/--accent:\s*(#[0-9a-fA-F]{3,8})/);
        if (match) setAccentColor(match[1]);
      }
    };
    fetchTemplate();

    if (rid) {
      loadResumeFromApi(rid);
    }
  }, [tid, rid, loadResumeFromApi]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleResumeUpdate = (patch) => {
    setResume(prev => ({ ...prev, ...patch }));
  };

  const handleBack = () => navigate('/dashboard');

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('No user found in localStorage during save');
        toast.error('You must be logged in to save');
        setSaveStatus('idle');
        return;
      }
      const user = JSON.parse(userStr);
      const userId = user?.userId ?? user?.id;

      if (!userId) {
        console.error('User object exists but missing ID:', user);
        toast.error('User session invalid. Please log in again.');
        setSaveStatus('idle');
        return;
      }

      // Crucial: Determine if we are updating or creating
      const currentResumeId = meta.resumeId || rid;

      const resumeDto = {
        ...(currentResumeId ? { resumeId: currentResumeId } : {}),
        userId,
        title: resume.fullName || 'My Resume',
        templateId: Number(templateId),
        templateName: selectedTemplate?.name || 'Default Template',
        templateCategory: selectedTemplate?.category || 'General',
        summary: resume.summary || '',
        resumeContent: JSON.stringify(resume),
        status: 'DRAFT',
      };

      console.log(currentResumeId ? `Updating resume ${currentResumeId}...` : 'Creating new resume...');

      const saved = currentResumeId
        ? await resumeService.update(currentResumeId, resumeDto)
        : await resumeService.create(resumeDto, user?.role);

      if (saved && saved.resumeId) {
        setMeta(prev => ({ ...prev, resumeId: saved.resumeId }));
        setSearchParams({ resumeId: saved.resumeId, templateId });

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
          const savedSections = await sectionService.upsertAll(saved.resumeId, sectionPayloads);
          const newSectionIds = { ...meta.sectionIds };
          savedSections.forEach(ss => {
            if (ss && ss.sectionId && ss.sectionType) {
              const key = SECTION_TYPE_TO_KEY[ss.sectionType];
              if (key) newSectionIds[key] = ss.sectionId;
            }
          });
          setMeta(prev => ({ ...prev, sectionIds: newSectionIds }));
        } catch (sectionErr) {
          console.warn('Sections save failed:', sectionErr);
        }

        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
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
        resumeTitle={resume.fullName || 'Untitled Resume'}
        saveStatus={saveStatus}
        onBack={handleBack}
        onSave={handleSave}
        onExportPdf={handleExportPdf}
        resumeId={meta.resumeId || rid}
      />

      <div className="builder-body">
        <SectionNav
          sections={builderSections}
          activeSection={activeSection}
          selectedTemplate={selectedTemplate}
          templateId={templateId}
          accentColor={accentColor}
          onSectionChange={setActiveSection}
          onToggleVisibility={handleToggleVisibility}
          onMoveSection={handleMoveSection}
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
          TemplateComponent={TemplateComponent}
          resumeData={resume}
          accentColor={accentColor}
          onExportPdf={handleExportPdf}
        />
      </div>
    </div>
  );
};

export default ResumeBuilder;
