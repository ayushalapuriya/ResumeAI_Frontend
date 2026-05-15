import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenRoutes = ['/login', '/signup', '/resume-builder', '/dashboard', '/admin'];
  const isHidden = hiddenRoutes.some(route => location.pathname.startsWith(route));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  if (isHidden) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="logo-mark">R</span>
          <span className="logo-text">Resume<strong>AI</strong></span>
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/templates" className={location.pathname === '/templates' ? 'active' : ''}>
              Templates
            </Link>
          </li>
          <li>
            <Link to="/pricing" className={location.pathname === '/pricing' ? 'active' : ''}>
              Pricing
            </Link>
          </li>
        </ul>

        <div className="nav-cta">
          {isLoggedIn ? (
            <>
              <Link to={getDashboardLink()} className="btn-nav-ghost">Dashboard</Link>
              <button onClick={handleLogout} className="btn-nav-solid">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost">Sign In</Link>
              <Link to="/signup" className="btn-nav-solid">Get Started</Link>
            </>
          )}
        </div>

        <button 
          className={`hamburger ${menuOpen ? 'open' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/templates" onClick={closeMenu}>Templates</Link></li>
          <li><Link to="/pricing" onClick={closeMenu}>Pricing</Link></li>
          {isLoggedIn && <li><Link to={getDashboardLink()} onClick={closeMenu}>Dashboard</Link></li>}
        </ul>
        <div className="mobile-cta">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="btn-nav-solid" style={{ width: '100%' }}>Logout</button>
          ) : (
            <>
              <Link to="/login" className="btn-nav-ghost" onClick={closeMenu}>Sign In</Link>
              <Link to="/signup" className="btn-nav-solid" onClick={closeMenu}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
