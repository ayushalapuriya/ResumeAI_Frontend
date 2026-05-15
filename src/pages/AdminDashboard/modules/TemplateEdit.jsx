import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const TemplateEdit = () => {
  const { templates, fetchInitialData } = useOutletContext();
  const { templateId } = useParams();
  const navigate = useNavigate();
  const [templateForm, setTemplateForm] = useState(null);

  useEffect(() => {
    const template = templates.find(t => t.templateId === parseInt(templateId));
    if (template) {
      setTemplateForm({
        name: template.name,
        category: template.category,
        isPremium: template.isPremium,
        isActive: template.isActive,
        description: template.description || '',
        htmlLayout: template.htmlLayout || '',
        cssStyles: template.cssStyles || ''
      });
    } else {
      // Fallback: fetch from API if not in context
      const fetchTemplate = async () => {
         try {
           const t = await adminService.getTemplates(); // Simplified for now, should have getById
           const found = t.find(x => x.templateId === parseInt(templateId));
           if (found) {
             setTemplateForm({...found});
           } else {
             toast.error('Template not found');
             navigate('/admin/templates');
           }
         } catch (err) {
           toast.error('Failed to load template');
           navigate('/admin/templates');
         }
      };
      fetchTemplate();
    }
  }, [templateId, templates, navigate]);

  const handleUpdateTemplate = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateTemplate(templateId, templateForm);
      toast.success('Template updated successfully');
      await fetchInitialData();
      navigate('/admin/templates');
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  if (!templateForm) return <div className="admin-loading">Loading template data...</div>;

  return (
    <div className="admin-templates-edit">
      <div className="card wide-modal" style={{ margin: '0 auto' }}>
        <div className="card-header">
          <h3>Edit Template: {templateForm.name}</h3>
        </div>
        <form onSubmit={handleUpdateTemplate} style={{ padding: '32px' }}>
          <div className="modal-grid">
            <div className="modal-sidebar">
              <div className="form-group">
                <label>Template Name</label>
                <input type="text" required value={templateForm.name} onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={templateForm.category} onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}>
                  <option value="PROFESSIONAL">Professional</option>
                  <option value="CREATIVE">Creative</option>
                  <option value="MODERN">Modern</option>
                  <option value="MINIMALIST">Minimalist</option>
                  <option value="ATS-OPTIMISED">ATS-Optimised</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={templateForm.description} onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" checked={templateForm.isPremium} onChange={(e) => setTemplateForm({...templateForm, isPremium: e.target.checked})} />
                  Premium Template
                </label>
              </div>
            </div>
            
            <div className="modal-main-editor">
              <div className="form-group">
                <label>HTML Layout (Mustache.js Format)</label>
                <textarea 
                  className="code-editor"
                  required 
                  value={templateForm.htmlLayout} 
                  onChange={(e) => setTemplateForm({...templateForm, htmlLayout: e.target.value})} 
                />
              </div>
              <div className="form-group">
                <label>CSS Styles</label>
                <textarea 
                  className="code-editor"
                  required 
                  value={templateForm.cssStyles} 
                  onChange={(e) => setTemplateForm({...templateForm, cssStyles: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => navigate('/admin/templates')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateEdit;
