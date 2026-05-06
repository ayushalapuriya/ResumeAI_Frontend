import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import templateService from '../services/templateService';
import './LandingPage.css';

const LandingPage = () => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const navigate = useNavigate();

  const steps = [
    { icon: '⊞', title: 'Choose a Template', desc: 'Pick from 8+ professionally designed templates built to impress recruiters.' },
    { icon: '✎', title: 'Fill Your Details', desc: 'Our smart form guides you through every section with live preview.' },
    { icon: '⬇', title: 'Download PDF', desc: 'Export pixel-perfect PDF resumes in one click, ready to send.' }
  ];

  const stats = [
    { value: '50,000+', label: 'Resumes Created' },
    { value: '8+', label: 'Templates' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  useEffect(() => {
    const loadTemplates = async () => {
      const templates = await templateService.getTemplates();
      setFeaturedTemplates(templates.slice(0, 4));
    };
    loadTemplates();
  }, []);

  const onUseTemplate = (templateId) => {
    navigate(`/resume-builder?templateId=${templateId}`);
  };

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="grid-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">✦ Free & Open Source</div>

          <h1 className="hero-title">
            Build Resumes That<br />
            <span className="gradient-text">Get You Hired</span>
          </h1>

          <p className="hero-subtitle">
            Create stunning, ATS-optimized resumes in minutes. Live preview, PDF export,
            and professional templates — all in one place.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link to="/templates" className="btn btn-outline btn-lg">
              Explore Templates
            </Link>
          </div>
        </div>

        {/* Preview */}
        <div className="hero-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="preview-avatar"></div>
              <div className="preview-lines">
                <div className="line line-name"></div>
                <div className="line line-role"></div>
              </div>
            </div>

            <div className="preview-section">
              <div className="section-label"></div>
              <div className="line"></div>
              <div className="line short"></div>
            </div>

            <div className="preview-section">
              <div className="section-label"></div>
              <div className="line"></div>
              <div className="line"></div>
              <div className="line short"></div>
            </div>

            <div className="preview-tags">
              <span className="tag"></span>
              <span className="tag"></span>
              <span className="tag short"></span>
            </div>

            <div className="preview-cursor"></div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          {stats.map((stat, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">HOW IT WORKS</div>
            <h2 className="section-title">Three steps to your dream resume</h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <div className="step-card" key={i}>
                <div className="step-number">0{i + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="featured-templates">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">TEMPLATES</div>
            <h2 className="section-title">Professionally designed templates</h2>
            <p className="section-subtitle">
              Every template is crafted to pass ATS systems and impress hiring managers.
            </p>
          </div>

          <div className="templates-grid">
            {featuredTemplates.map((template) => (
              <div 
                className="template-card" 
                key={template.templateId}
                onClick={() => onUseTemplate(template.templateId)}
              >
                {/* Thumbnail */}
                <div className="template-preview">
                  {template.thumbnailUrl ? (
                    <img 
                      src={template.thumbnailUrl} 
                      alt={template.name}
                      className="template-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="template-placeholder" style={{ 
                      background: `linear-gradient(135deg, var(--accent)22, var(--accent)44)`,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent)',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}>
                      {template.name.charAt(0)}
                    </div>
                  )}

                  {/* Premium Badge */}
                  {template.isPremium && <div className="premium-badge">PRO</div>}
                </div>

                {/* Info */}
                <div className="template-info">
                  <div className="template-meta">
                    <span className="template-name">{template.name}</span>
                    <span className="template-category">{template.category}</span>
                  </div>

                  <button 
                    className="btn btn-sm btn-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUseTemplate(template.templateId);
                    }}
                  >
                    Use This →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="templates-cta">
            <Link to="/templates" className="btn btn-outline">
              View All Templates
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to land your next role?</h2>
            <p>Join thousands of job seekers who built their resume with ResumeForge.</p>
            <Link to="/signup" className="btn btn-primary btn-lg">Start for Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
