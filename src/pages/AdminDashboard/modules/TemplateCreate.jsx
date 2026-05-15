import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';

const TemplateCreate = () => {
  const { fetchInitialData } = useOutletContext();
  const navigate = useNavigate();
  const [templateForm, setTemplateForm] = useState({ 
    name: '', 
    category: 'PROFESSIONAL', 
    isPremium: false, 
    isActive: true,
    description: '',
    htmlLayout: '',
    cssStyles: ''
  });

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createTemplate(templateForm);
      toast.success('Template added successfully');
      await fetchInitialData();
      navigate('/admin/templates');
    } catch (error) {
      toast.error('Failed to create template');
    }
  };

  return (
    <div className="admin-templates-create">
      <div className="card wide-modal" style={{ margin: '0 auto' }}>
        <div className="card-header">
          <h3>Add New Template</h3>
        </div>
        <form onSubmit={handleSaveTemplate} style={{ padding: '32px' }}>
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
                  placeholder="<div class='resume'>...</div>"
                />
              </div>
              <div className="form-group">
                <label>CSS Styles</label>
                <textarea 
                  className="code-editor"
                  required 
                  value={templateForm.cssStyles} 
                  onChange={(e) => setTemplateForm({...templateForm, cssStyles: e.target.value})} 
                  placeholder=".resume { ... }"
                />
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => navigate('/admin/templates')} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Template</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateCreate;
