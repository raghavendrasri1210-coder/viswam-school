import React from 'react';
import { MapPin, Phone, Mail, ChevronRight } from 'lucide-react';

export default function Footer({ data, isEditMode, onUpdateData }) {
  
  const handleCareersAlert = (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent('viswam_notification', {
      detail: { 
        message: "Careers: Please send your resume and qualification credentials to viswamschool2013@gmail.com. Our administrative office will review and get in touch!", 
        type: 'info' 
      }
    }));
  };

  return (
    <footer id="contact" className="footer">
      <div className="footer-grid">
        
        {/* Brand column */}
        <div className="footer-col">
          <div className="footer-brand">
            <div className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/logo.png" alt="Viswam School Logo" style={{ height: '40px', objectFit: 'contain' }} />
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '800', lineHeight: 1.1 }}>VISWAM</span>
                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--secondary)' }}>HIGH SCHOOL</span>
              </div>
            </div>
            <p className="footer-desc">
              Providing holistic education that blends South Indian cultural values with world-class learning methods. Est. 2013.
            </p>
          </div>
        </div>

        {/* Quick Links column */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#about">About Us</a>
            </li>
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#contact">Admissions</a>
            </li>
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#disclosures">Academics</a>
            </li>
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#gallery">Campus Life</a>
            </li>
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#news">News & Events</a>
            </li>
            <li className="footer-link-item">
              <ChevronRight size={14} />
              <a href="#" onClick={handleCareersAlert}>Careers</a>
            </li>
          </ul>
        </div>

        {/* Contact column */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <div className="footer-contact-info">
            
            {/* Address */}
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <MapPin size={18} />
              </div>
              <div className="footer-contact-text">
                <h4>Address</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Address</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.85rem', width: '220px', padding: '4px' }}
                      value={data.contactAddress || ''}
                      onChange={(e) => onUpdateData('contactAddress', e.target.value)}
                    />
                  ) : (
                    <p>{data.contactAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <Phone size={18} />
              </div>
              <div className="footer-contact-text">
                <h4>Phone Numbers</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Phone</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.85rem', width: '220px', padding: '4px' }}
                      value={data.contactPhone || ''}
                      onChange={(e) => onUpdateData('contactPhone', e.target.value)}
                    />
                  ) : (
                    <p>{data.contactPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="footer-contact-item">
              <div className="footer-contact-icon">
                <Mail size={18} />
              </div>
              <div className="footer-contact-text">
                <h4>Email Address</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Email</span>
                  {isEditMode ? (
                    <input
                      type="email"
                      className="form-input"
                      style={{ fontSize: '0.85rem', width: '220px', padding: '4px' }}
                      value={data.contactEmail || ''}
                      onChange={(e) => onUpdateData('contactEmail', e.target.value)}
                    />
                  ) : (
                    <p>
                      <a href={`mailto:${data.contactEmail}`} style={{ textDecoration: 'underline', color: 'inherit' }}>
                        {data.contactEmail}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div>
          <span>© {new Date().getFullYear()} Viswam English Medium High School. All rights reserved.</span>
        </div>
        <div className="footer-bottom-links">
          <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('viswam_notification', { detail: { message: "Privacy Policy will be linked in production.", type: 'info' } })); }}>Privacy Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('viswam_notification', { detail: { message: "Terms of Use will be linked in production.", type: 'info' } })); }}>Terms of Use</a>
          <a href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('viswam_notification', { detail: { message: "Sitemap will be linked in production.", type: 'info' } })); }}>Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
