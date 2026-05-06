import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const hiddenRoutes = ['/login', '/signup', '/resume-builder', '/dashboard'];
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
        </ul>

        <div className="nav-cta">
          <Link to="/login" className="btn-nav-ghost">Sign In</Link>
          <Link to="/signup" className="btn-nav-solid">Get Started</Link>
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
        </ul>
        <div className="mobile-cta">
          <Link to="/login" className="btn-nav-ghost" onClick={closeMenu}>Sign In</Link>
          <Link to="/signup" className="btn-nav-solid" onClick={closeMenu}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
