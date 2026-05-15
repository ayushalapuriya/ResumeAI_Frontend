import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeList from '../components/dashboard/ResumeList';
import TemplateGallery from '../components/dashboard/TemplateGallery';
import ProfilePage from '../components/dashboard/ProfilePage';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import templateService from '../services/templateService';
import toast from 'react-hot-toast';
import './Dashboard.css';

const CARD_COLORS = ['#6366f1', '#0ea5e9', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const DashboardPremium = () => {
  const [activePage, setActivePage] = useState('resume');
  const [resumesLoading, setResumesLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [openedFromCreate, setOpenedFromCreate] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = 'Premium Member';

  const activeSkills = [
    { name: 'React',      bg: 'rgba(99,102,241,.1)',  color: '#6366f1', border: 'rgba(99,102,241,.25)'  },
    { name: 'Node.js',    bg: 'rgba(14,165,233,.1)',  color: '#0ea5e9', border: 'rgba(14,165,233,.25)'  },
    { name: 'TypeScript', bg: 'rgba(167,139,250,.1)', color: '#8b5cf6', border: 'rgba(167,139,250,.25)' },
    { name: 'MongoDB',    bg: 'rgba(34,197,94,.1)',   color: '#16a34a', border: 'rgba(34,197,94,.25)'   },
    { name: 'AWS',        bg: 'rgba(245,158,11,.1)',  color: '#d97706', border: 'rgba(245,158,11,.25)'  },
  ];

  const dtoToEntry = useCallback((dto, index) => {
    if (!dto.resumeId && !dto.id) {
      console.warn('Resume DTO missing ID:', dto);
    }
    return {
      resumeId:     dto.resumeId || dto.id,
      name:         dto.title || 'Untitled Resume',
      updated:      dto.status || 'DRAFT',
      completeness: dto.atsScore || 0,
      active:       index === 0,
      color:        CARD_COLORS[index % CARD_COLORS.length]
    };
  }, []);

  const loadResumes = useCallback(async (userId) => {
    setResumesLoading(true);
    try {
      const dtos = await resumeService.getByUser(userId);
      setResumes(dtos.map((dto, i) => dtoToEntry(dto, i)));
    } catch (err) {
      console.error('Failed to load resumes:', err);
      toast.error('Could not load resumes');
    } finally {
      setResumesLoading(false);
    }
  }, [dtoToEntry]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await templateService.getTemplates();
        setAllTemplates(templates);
      } catch (err) {
        console.error('Failed to load templates:', err);
      } finally {
        setTemplatesLoading(false);
      }
    };

    fetchTemplates();

    if (user?.userId || user?.id) {
      loadResumes(user?.userId || user?.id);
    } else {
      setResumesLoading(false);
    }
  }, [user, loadResumes]);

  const handlePageChange = (page) => {
    setActivePage(page);
    setOpenedFromCreate(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const createNewResume = () => {
    setActivePage('templates');
    setOpenedFromCreate(true);
  };

  const editResume = (r) => {
    navigate(`/resume-builder?resumeId=${r.resumeId}`);
  };

  const downloadResume = (r) => {
    toast(`Preparing "${r.name}" for download...`);
    navigate(`/resume-builder?resumeId=${r.resumeId}&export=all`);
  };

  const duplicateResume = async (r) => {
    const toastId = toast.loading('Duplicating resume...');
    try {
      const dto = await resumeService.duplicate(r.resumeId);
      const copy = dtoToEntry(dto, resumes.length);
      setResumes([...resumes, copy]);
      toast.success('Resume duplicated successfully', { id: toastId });
    } catch (err) {
      toast.error('Could not duplicate resume', { id: toastId });
    }
  };

  const deleteResume = async (r) => {
    const toastId = toast.loading(`Deleting "${r.name}"...`);
    try {
      await resumeService.delete(r.resumeId);
      setResumes(resumes.filter(x => x.resumeId !== r.resumeId));
      toast.success(`"${r.name}" deleted successfully`, { id: toastId });
    } catch (err) {
      toast.error('Could not delete resume', { id: toastId });
    }
  };

  const createBlankResume = () => {
    setOpenedFromCreate(false);
    navigate('/resume-builder');
  };

  const useTemplate = (t) => {
    navigate(`/resume-builder?templateId=${t.templateId}`);
  };

  const activeResume = resumes.find(r => r.active);
  const score = activeResume?.completeness || 0;

  return (
    <div className="dashboard-shell premium-user">
      <Sidebar 
        activePage={activePage} 
        user={user} 
        userRole="Premium Member 💎" 
        onPageChange={handlePageChange} 
        onLogout={handleLogout}
      />

      <main className="dash-main">
        <header className="premium-header">
            <div className="welcome-section">
                <h1>Welcome back, {user?.fullName || 'Premium User'}!</h1>
                <p>Enjoy unlimited access to all AI features and templates.</p>
            </div>
            <div className="premium-badge-big">PREMIUM MEMBER</div>
        </header>

        <div className="premium-stats">
            <div className="stat-card">
                <h3>Total Resumes</h3>
                <span className="stat-value">{resumes.length}</span>
            </div>
            <div className="stat-card">
                <h3>AI Usage</h3>
                <span className="stat-value">Unlimited</span>
            </div>
            <div className="stat-card">
                <h3>Templates</h3>
                <span className="stat-value">All Unlocked</span>
            </div>
        </div>

        {activePage === 'resume' && (
          <ResumeList 
            resumes={resumes} 
            activeSkills={activeSkills} 
            score={score} 
            onCreateNew={createNewResume}
            onEditResume={editResume}
            onDownloadResume={downloadResume}
            onDuplicateResume={duplicateResume}
            onDeleteResume={deleteResume}
            onBrowseTemplates={() => handlePageChange('templates')}
          />
        )}

        {activePage === 'templates' && (
          <TemplateGallery 
            templates={allTemplates} 
            loading={templatesLoading} 
            showBackToResumes={openedFromCreate}
            onUseTemplate={useTemplate}
            onStartBlank={createBlankResume}
            onBackToResumes={() => handlePageChange('resume')}
          />
        )}

        {activePage === 'profile' && (
          <ProfilePage 
            user={user} 
            userRole="Premium Member" 
            resumeCount={resumes.length} 
            score={score}
            onBack={() => handlePageChange('resume')}
            onSaveProfile={() => toast.success('Profile saved!')}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPremium;
