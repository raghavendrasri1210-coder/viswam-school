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
        <a href="#home" className="nav-logo" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Viswam High School Logo" style={{ height: '48px', objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: 1.1, color: 'var(--primary)' }}>VISWAM</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', letterSpacing: '0.5px' }}>HIGH SCHOOL</span>
          </div>
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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--success)', fontWeight: '600', fontSize: '0.9rem' }}>
                <Shield size={16} />
                <span>Admin</span>
              </div>
              <button className="btn btn-outline" onClick={onLogout} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={onLoginClick} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <LogIn size={14} />
              <span>Owner Login</span>
            </button>
          )}

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '80px',
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
          {!isAdmin && (
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
