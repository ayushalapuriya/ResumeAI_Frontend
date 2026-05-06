import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateGallery from '../components/dashboard/TemplateGallery';
import templateService from '../services/templateService';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await templateService.getTemplates();
        setTemplates(data);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleUseTemplate = (t) => {
    navigate(`/resume-builder?templateId=${t.templateId}`);
  };

  const handleStartBlank = () => {
    navigate('/resume-builder');
  };

  return (
    <div className="templates-page-wrapper" style={{ padding: '40px 20px' }}>
      <div className="container">
        <TemplateGallery 
          templates={templates}
          loading={loading}
          showBackToResumes={false}
          onUseTemplate={handleUseTemplate}
          onStartBlank={handleStartBlank}
        />
      </div>
    </div>
  );
};

export default TemplatesPage;
