import React, { useState } from 'react';
import TemplateCard from './TemplateCard';
import TemplatePreviewModal from './TemplatePreviewModal';
import './TemplateGallery.css';

const TemplateGallery = ({ 
  templates, 
  loading, 
  showBackToResumes, 
  onUseTemplate, 
  onStartBlank, 
  onBackToResumes 
}) => {
  const [activeCat, setActiveCat] = useState('All');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const categories = ['All', 'Modern', 'Professional', 'Creative', 'Minimal'];

  const filteredTemplates = activeCat === 'All' 
    ? templates 
    : templates.filter(t => t.category === activeCat);

  const getAccent = (id) => {
    const accents = ['#6366f1', '#0ea5e9', '#ec4899', '#8b5cf6', '#10b981'];
    return accents[id % accents.length];
  };

  const isNew = (t) => t.isNew || false;

  const handlePreview = (t) => {
    setSelectedTemplate(t);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
  };

  return (
    <div className="dash-page">
      <div className="page-header">
        <div>
          {showBackToResumes && (
            <div className="create-breadcrumb">
              <button className="breadcrumb-back" onClick={onBackToResumes}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                My Resumes
              </button>
              <span className="breadcrumb-sep">›</span>
              <span className="breadcrumb-current">Choose Template</span>
            </div>
          )}
          <h1 className="page-title">{showBackToResumes ? 'Choose a Template' : 'Templates'}</h1>
          <p className="page-sub">
            {showBackToResumes 
              ? 'Select a template to start your new resume, or begin from scratch' 
              : 'Pick a design, then jump straight into the builder'}
          </p>
        </div>

        <div className="tpl-filter-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tpl-filter-btn ${activeCat === cat ? 'active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {showBackToResumes && (
        <div className="start-blank-banner">
          <div className="blank-banner-left">
            <div className="blank-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="blank-title">Start from Scratch</p>
              <p className="blank-sub">Build a fully custom resume with no template constraints</p>
            </div>
          </div>
          <button className="btn-start-blank" onClick={onStartBlank}>
            Start Blank
          </button>
        </div>
      )}

      {loading ? (
        <div className="tpl-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="tpl-skeleton" key={n}>
              <div className="skel-preview"></div>
              <div className="skel-row wide"></div>
              <div className="skel-row short"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="tpl-grid">
          {filteredTemplates.map((t) => (
            <TemplateCard
              key={t.templateId}
              template={t}
              isNew={isNew(t)}
              onUse={onUseTemplate}
              onPreview={handlePreview}
            />
          ))}

          {filteredTemplates.length === 0 && (
            <div className="tpl-empty">
              <div className="empty-emoji">🔍</div>
              <p className="empty-title">No templates in this category</p>
              <button className="btn-reset-filter" onClick={() => setActiveCat('All')}>
                Show All
              </button>
            </div>
          )}
        </div>
      )}

      <TemplatePreviewModal
        open={previewOpen}
        template={selectedTemplate}
        accent={selectedTemplate ? getAccent(selectedTemplate.templateId) : '#6366f1'}
        onClose={closePreview}
        onUse={onUseTemplate}
      />
    </div>
  );
};

export default TemplateGallery;
