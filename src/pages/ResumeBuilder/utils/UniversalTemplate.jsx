import React, { useMemo } from 'react';
import Mustache from 'mustache';

/**
 * UniversalTemplate
 * Renders a template based on HTML layout and CSS styles provided by the backend.
 * Uses Mustache.js for data binding.
 */
const UniversalTemplate = ({ data, template, accentColor }) => {
  // Merge accent color into data for template usage
  const templateData = useMemo(() => ({
    ...data,
    accentColor,
    // Add some helper flags for mustache
    hasExperience: data.experience?.length > 0,
    hasEducation: data.education?.length > 0,
    hasSkills: data.skills?.length > 0,
    hasProjects: data.projects?.length > 0,
  }), [data, accentColor]);

  const renderedHtml = useMemo(() => {
    if (!template?.htmlLayout) return '<p>No layout defined for this template.</p>';
    try {
      return Mustache.render(template.htmlLayout, templateData);
    } catch (err) {
      console.error('Mustache rendering error:', err);
      return `<p style="color: red;">Error rendering template: ${err.message}</p>`;
    }
  }, [template, templateData]);

  // Unique ID for scoping CSS
  const scopeId = useMemo(() => `tpl-${template?.templateId || Math.random().toString(36).substr(2, 9)}`, [template]);

  return (
    <div className={`universal-template-container ${scopeId}`} style={{ minHeight: '100%', background: 'white' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .${scopeId} {
          /* Root styles for the template */
          --accent: ${accentColor};
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        ${template?.cssStyles || ''}
      `}} />
      <div 
        className="template-body"
        dangerouslySetInnerHTML={{ __html: renderedHtml }} 
      />
    </div>
  );
};

export default UniversalTemplate;
