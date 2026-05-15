import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import resumeService from '../services/resumeService';
import sectionService from '../services/sectionService';
import templateService from '../services/templateService';
import UniversalTemplate from './ResumeBuilder/utils/UniversalTemplate';
import './ViewResume.css';

const ViewResume = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullResume = async () => {
      try {
        const [resume, sections] = await Promise.all([
          resumeService.getById(resumeId),
          sectionService.getByResume(resumeId)
        ]);

        if (resume) {
          // If the resume doesn't have the layout embedded, fetch it from template service
          let layout = resume.htmlLayout;
          let styles = resume.cssStyles;

          if (!layout && resume.templateId) {
            try {
              const t = await templateService.getById(resume.templateId);
              layout = t.htmlLayout;
              styles = t.cssStyles;
            } catch (tErr) {
              console.warn('Failed to fetch template details:', tErr);
            }
          }

          // Construct the same format used in the builder
          const fullData = {
            fullName: resume.title || 'Resume',
            jobTitle: resume.targetJobTitle || '',
            summary: resume.summary || '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            template: {
              htmlLayout: layout,
              cssStyles: styles
            }
          };

          // Merge sections
          sections.forEach(s => {
            const key = s.sectionType.toLowerCase();
            if (s.content && s.content.items) {
              fullData[key] = s.content.items;
            } else if (s.sectionType === 'PERSONAL') {
              Object.assign(fullData, s.content);
            }
          });

          setResumeData(fullData);
        }
      } catch (err) {
        console.error('Error loading view:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFullResume();
  }, [resumeId]);

  if (loading) return <div className="view-loading">Preparing your masterpiece...</div>;
  if (!resumeData) return <div className="view-error">Resume not found.</div>;

  return (
    <div className="view-resume-container">
      <div className="view-controls no-print">
        <button onClick={() => navigate(-1)} className="btn-view-back">← Back to Builder</button>
        <button onClick={() => window.print()} className="btn-view-print">Download / Print PDF</button>
      </div>
      <div className="view-paper">
        <UniversalTemplate 
          data={resumeData} 
          template={resumeData.template} 
          accentColor="#6366f1"
        />
      </div>
    </div>
  );
};

export default ViewResume;
