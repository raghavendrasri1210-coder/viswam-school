import React, { useState, useEffect } from 'react';
import { Shield, LogIn, Menu, X } from 'lucide-react';

export default function Navbar({ isAdmin, currentPage, onLoginClick, onLogout }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="nav-logo" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Viswam High School Logo" style={{ height: '68px', objectFit: 'contain', maxWidth: '100%' }} className="navbar-logo-img" />
        </a>

        {/* Desktop Menu */}
        <ul className="nav-menu">
          <li><a href="#home" className={`nav-link ${currentPage === 'home' ? 'active-link' : ''}`} onClick={handleLinkClick}>Home</a></li>
          <li><a href="#about" className={`nav-link ${currentPage === 'about' ? 'active-link' : ''}`} onClick={handleLinkClick}>About</a></li>
          <li><a href="#disclosures" className={`nav-link ${currentPage === 'disclosures' ? 'active-link' : ''}`} onClick={handleLinkClick}>Disclosures</a></li>
          <li><a href="#news" className={`nav-link ${currentPage === 'news' ? 'active-link' : ''}`} onClick={handleLinkClick}>News</a></li>
          <li><a href="#gallery" className={`nav-link ${currentPage === 'gallery' ? 'active-link' : ''}`} onClick={handleLinkClick}>Gallery</a></li>
          <li><a href="#contact" className={`nav-link ${currentPage === 'contact' ? 'active-link' : ''}`} onClick={handleLinkClick}>Contact</a></li>
        </ul>

        <div className="nav-buttons">
          {isAdmin ? (
            <div className="desktop-only-buttons">
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem' }}>
                <Shield size={16} />
                <span>Admin</span>
              </div>
              <button className="btn btn-outline" onClick={onLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div className="desktop-only-buttons">
              <button className="btn btn-primary" onClick={onLoginClick} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <LogIn size={14} />
                <span>Owner Login</span>
              </button>
            </div>
          )}

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '90px',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid var(--border)',
          padding: '20px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          zIndex: 99
        }}>
          <a href="#home" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'home' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>Home</a>
          <a href="#about" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'about' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>About</a>
          <a href="#disclosures" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'disclosures' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>Disclosures</a>
          <a href="#news" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'news' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>News & Events</a>
          <a href="#gallery" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'gallery' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>Gallery</a>
          <a href="#contact" style={{ fontWeight: '600', padding: '5px 0', color: currentPage === 'contact' ? 'var(--accent)' : 'inherit' }} onClick={handleLinkClick}>Contact</a>
          {isAdmin ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', fontWeight: '700', fontSize: '0.9rem', justifyContent: 'center' }}>
                <Shield size={16} />
                <span>Admin Mode Active</span>
              </div>
              <button className="btn btn-outline" onClick={() => { setMobileMenuOpen(false); onLogout(); }} style={{ width: '100%' }}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} style={{ width: '100%', marginTop: '10px' }}>
              <LogIn size={16} />
              <span>Owner Login</span>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
