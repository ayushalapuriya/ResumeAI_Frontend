import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import adminService from '../../../services/adminService';
import toast from 'react-hot-toast';
import UniversalTemplate from '../../ResumeBuilder/utils/UniversalTemplate';

const TemplateManagement = () => {
  const { templates, fetchInitialData } = useOutletContext();
  const navigate = useNavigate();

  const handleToggleTemplateStatus = async (templateId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} this template?`)) return;
    try {
      await adminService.toggleTemplateStatus(templateId);
      toast.success(`Template ${action}d`);
      fetchInitialData();
    } catch (error) {
      toast.error(`Failed to ${action} template`);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY DELETE this template? This cannot be undone.')) return;
    try {
      await adminService.deleteTemplate(templateId);
      toast.success('Template deleted successfully');
      fetchInitialData();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="admin-templates">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h4>Template Management</h4>
        <button className="btn-primary" onClick={() => navigate('/admin/templates/create')}>Add New Template</button>
      </div>
      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.templateId} className="template-admin-card">
            <div className="template-thumb">
              <div className="mini-preview-scaler">
                <UniversalTemplate 
                  template={template} 
                  data={{
                    fullName: 'John Doe',
                    jobTitle: 'Software Engineer',
                    email: 'john@example.com',
                    phone: '+1 234 567 890',
                    location: 'New York, NY',
                    summary: 'Experienced professional with a focus on modern web technologies.',
                    experience: [
                      { role: 'Senior Developer', company: 'Tech Corp', startDate: '2020', endDate: 'Present', description: 'Leading frontend architecture and team development.' }
                    ],
                    skills: ['React', 'Node.js', 'System Design']
                  }} 
                />
              </div>
            </div>
            <div className="template-info">
              <h5>{template.name}</h5>
              <span className="template-cat">{template.category}</span>
              <div className="template-status">
                <span className={`badge ${template.isPremium ? 'premium' : 'free'}`}>{template.isPremium ? 'Premium' : 'Free'}</span>
                <span className={`badge ${template.isActive ? 'active' : 'inactive'}`}>{template.isActive ? 'Active' : 'Draft'}</span>
              </div>
              <div className="template-actions">
                <button className="btn-outline" onClick={() => navigate(`/admin/templates/${template.templateId}/edit`)}>Edit Layout</button>
                <button 
                  className={`btn-outline ${template.isActive ? 'warning' : 'success'}`} 
                  onClick={() => handleToggleTemplateStatus(template.templateId, template.isActive)}
                >
                  {template.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-outline danger" onClick={() => handleDeleteTemplate(template.templateId)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateManagement;
