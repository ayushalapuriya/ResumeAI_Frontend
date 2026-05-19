import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import ResumeList from '../components/dashboard/ResumeList';
import TemplateGallery from '../components/dashboard/TemplateGallery';
import ProfilePage from '../components/dashboard/ProfilePage';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resumeService';
import templateService from '../services/templateService';
import authService from '../services/authService';
import aiService from '../services/aiService';
import toast from 'react-hot-toast';
import './Dashboard.css';

const CARD_COLORS = ['#6366f1', '#0ea5e9', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b'];

const DashboardFree = () => {
  const [activePage, setActivePage] = useState('resume');
  const [resumesLoading, setResumesLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [openedFromCreate, setOpenedFromCreate] = useState(false);
  const [aiQuota, setAiQuota] = useState({
    dailyUsed: 0,
    dailyLimit: 5,
    monthlyUsed: 0,
    monthlyLimit: 50
  });

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const plan = (user?.subscriptionPlan || user?.subscription_plan || '').toUpperCase();
  const role = (user?.role || '').toUpperCase();
  const isPremium = role === 'ROLE_PREMIUM' || plan === 'PREMIUM';
  const userRoleText = isPremium ? 'Premium Member' : 'Free User';

  const activeSkills = [
    { name: 'React', bg: 'rgba(99,102,241,.1)', color: '#6366f1', border: 'rgba(99,102,241,.25)' },
    { name: 'Node.js', bg: 'rgba(14,165,233,.1)', color: '#0ea5e9', border: 'rgba(14,165,233,.25)' },
    { name: 'TypeScript', bg: 'rgba(167,139,250,.1)', color: '#8b5cf6', border: 'rgba(167,139,250,.25)' },
  ];

  const dtoToEntry = useCallback((dto, index) => {
    if (!dto.resumeId && !dto.id) {
      console.warn('Resume DTO missing ID:', dto);
    }
    return {
      resumeId: dto.resumeId || dto.id,
      name: dto.title || 'Untitled Resume',
      updated: dto.status || 'DRAFT',
      completeness: dto.atsScore || 0,
      active: index === 0,
      color: CARD_COLORS[index % CARD_COLORS.length]
    };
  }, []);

  const loadResumes = useCallback(async (userId) => {
    setResumesLoading(true);
    try {
      const dtos = await resumeService.getByUser(userId);
      setResumes(dtos.map((dto, i) => dtoToEntry(dto, i)));
      
      // Also load AI quota
      const quotaResponse = await aiService.getQuota();
      if (quotaResponse && typeof quotaResponse === 'object' && quotaResponse.dailyUsed !== undefined) {
        setAiQuota({
          dailyUsed: quotaResponse.dailyUsed,
          dailyLimit: quotaResponse.dailyLimit,
          monthlyUsed: quotaResponse.monthlyUsed,
          monthlyLimit: quotaResponse.monthlyLimit
        });
      } else {
        const remaining = typeof quotaResponse === 'object' ? quotaResponse.remaining : quotaResponse;
        const safeRemaining = typeof remaining === 'number' ? remaining : 0;
        setAiQuota({
          dailyUsed: Math.max(0, 5 - safeRemaining),
          dailyLimit: 5,
          monthlyUsed: Math.max(0, 5 - safeRemaining),
          monthlyLimit: 50
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
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
    if (resumes.length >= 3) {
      toast.error('You have reached the limit of 3 resumes. Upgrade to Premium for unlimited resumes!', {
        duration: 4000,
        icon: '🚀'
      });
      return;
    }
    setActivePage('templates');
    setOpenedFromCreate(true);
  };

  const editResume = (r) => {
    navigate(`/resume-builder?resumeId=${r.resumeId}`);
  };

  const downloadResume = (r) => {
    toast(`Preparing "${r.name}" for download...`);
    navigate(`/resume-builder?resumeId=${r.resumeId}&export=pdf`);
  };

  const duplicateResume = async (r) => {
    if (resumes.length >= 3) {
      toast.error('Resume limit reached! Upgrade to Premium.');
      return;
    }
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
    if (resumes.length >= 3) {
      toast.error('Resume limit reached!');
      return;
    }
    setOpenedFromCreate(false);
    navigate('/resume-builder');
  };

  const useTemplate = (t) => {
    if (t.isPremium) {
      toast.error('This is a Premium template. Upgrade to use it!', {
        icon: '💎'
      });
      return;
    }
    navigate(`/resume-builder?templateId=${t.templateId}`);
  };

  const activeResume = resumes.find(r => r.active);
  const score = activeResume?.completeness || 0;

  return (
    <div className="dashboard-shell free-user">
      <Sidebar
        activePage={activePage}
        user={user}
        userRole={isPremium ? "Premium Plan 💎" : "Free Plan"}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />

      <main className="dash-main">
        <div className="upgrade-banner">
          <div className="banner-content">
            <h3>Upgrade to Premium</h3>
            <p>Get unlimited resumes, advanced AI features, and premium templates.</p>
          </div>
          <button className="upgrade-btn" onClick={() => navigate('/pricing')}>Upgrade Now</button>
        </div>

        <div className="quota-status">
          <div className="quota-item">
            <span className="quota-label">Resumes</span>
            <div className="quota-bar">
              <div className="quota-fill" style={{ width: isPremium ? `${(resumes.length / 100) * 100}%` : `${(resumes.length / 3) * 100}%` }}></div>
            </div>
            <span className="quota-value">{resumes.length}/{isPremium ? '∞' : '3'}</span>
          </div>
          <div className="quota-item">
            <span className="quota-label">Daily AI Calls</span>
            <div className="quota-bar">
              <div className="quota-fill" style={{ width: isPremium ? '0%' : `${Math.min(100, (aiQuota.dailyUsed / aiQuota.dailyLimit) * 100)}%` }}></div>
            </div>
            <span className="quota-value">{isPremium ? 'Unlimited' : `${aiQuota.dailyUsed}/${aiQuota.dailyLimit}`}</span>
          </div>
          <div className="quota-item">
            <span className="quota-label">Monthly AI Calls</span>
            <div className="quota-bar">
              <div className="quota-fill" style={{ width: isPremium ? '0%' : `${Math.min(100, (aiQuota.monthlyUsed / aiQuota.monthlyLimit) * 100)}%` }}></div>
            </div>
            <span className="quota-value">{isPremium ? 'Unlimited' : `${aiQuota.monthlyUsed}/${aiQuota.monthlyLimit}`}</span>
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
            userRole={isPremium ? "Premium Member 💎" : "Free Plan"}
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

export default DashboardFree;
