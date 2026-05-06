import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import toast from 'react-hot-toast';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const getStrength = () => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  };

  const getStrengthLabel = () => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[getStrength()] || '';
  };

  const getStrengthClass = () => {
    const classes = ['', 'weak', 'fair', 'good', 'strong'];
    return classes[getStrength()] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (getStrength() < 2) {
      toast.error('Please choose a stronger password');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Creating your account...');

    try {
      await authService.register({ fullName: name, email, password });
      toast.success('Account created! Please sign in 🎉', { id: toastId });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Panel */}
      <div className="auth-panel">
        <div className="panel-inner">
          <Link to="/" className="panel-logo">
            <span className="logo-mark">R</span>
            <span>Resume<strong>AI</strong></span>
          </Link>

          <div className="panel-features">
            <h2>Everything you need to get hired</h2>
            <ul className="feature-list">
              <li>
                <span className="feat-icon">✓</span>
                <div>
                  <strong>8+ Professional Templates</strong>
                  <p>ATS-optimized, recruiter-approved designs</p>
                </div>
              </li>
              <li>
                <span className="feat-icon">✓</span>
                <div>
                  <strong>Live Preview Editor</strong>
                  <p>See changes instantly as you type</p>
                </div>
              </li>
              <li>
                <span className="feat-icon">✓</span>
                <div>
                  <strong>One-Click PDF Export</strong>
                  <p>Pixel-perfect, print-ready resumes</p>
                </div>
              </li>
              <li>
                <span className="feat-icon">✓</span>
                <div>
                  <strong>AI-Powered Suggestions</strong>
                  <p>Smart bullet points crafted for your role</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="panel-social-proof">
            <div className="avatars">
              <span className="av av-1"></span>
              <span className="av av-2"></span>
              <span className="av av-3"></span>
            </div>
            <p>Join <strong>50,000+</strong> professionals already using ResumeAI</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="auth-form-side">
        <div className="form-container">
          <div className="form-header">
            <h1>Create your account</h1>
            <p>Free forever. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label htmlFor="name">Full name</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="email">Email address</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="eye-btn" onClick={togglePassword}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              
              {password && (
                <div className="strength-bar">
                  <div className="strength-track">
                    <div 
                      className={`strength-fill ${getStrengthClass()}`} 
                      style={{ width: `${(getStrength() / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`strength-label ${getStrengthClass()}`}>{getStrengthLabel()}</span>
                </div>
              )}
            </div>

            <button type="submit" className={`btn-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="spinner"></span> : <span>Create Free Account →</span>}
            </button>
          </form>

          <p className="switch-auth">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
