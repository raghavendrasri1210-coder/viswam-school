import React from 'react';
import { X, FileText, ShieldAlert, Map, Briefcase } from 'lucide-react';

export default function InfoModal({ isOpen, onClose, type }) {
  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          icon: <FileText size={24} style={{ color: 'var(--primary)' }} />,
          title: 'Privacy Policy',
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <p>At Viswam High School, we prioritize the confidentiality and safety of our student, parent, and visitor information. This policy governs how we manage data on this portal.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>1. Data Collection</h5>
              <p>We only collect personal information that is voluntarily provided through our <strong>Send an Inquiry</strong> form (such as Name, Email, Phone, and Message details). This information is solely used to respond to administrative requests and admission questions.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>2. Data Storage & Security</h5>
              <p>All data entered into this website (including customized content and inquiry records) is securely stored in the client-side local browser storage environment. There are no server databases where records can be leaked or accessed by unauthorized third parties.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>3. Third-Party Sharing</h5>
              <p>We do not sell, rent, or distribute any parent contact lists or inquiry logs to commercial advertisers or external agencies.</p>
            </div>
          )
        };
      case 'terms':
        return {
          icon: <ShieldAlert size={24} style={{ color: 'var(--primary)' }} />,
          title: 'Terms of Use',
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <p>Welcome to the Viswam High School Portal. By accessing this site, you agree to comply with the terms and guidelines detailed below.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>1. Portal Usage</h5>
              <p>This portal is intended to display official CBSE disclosures, milestones, news updates, and contact structures for Viswam High School. Administrative editing tools are strictly reserved for authorized owners and require password verification.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>2. Submission Guidelines</h5>
              <p>Parents and visitors submitting inquiries must provide accurate and authentic contact details (names, valid phone numbers, and valid email addresses) to ensure administrative desk responses.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>3. Copyright & Intellectual Property</h5>
              <p>All photos, logos, descriptions, and school credentials published on this site are property of Viswam High School. Unauthorized duplication of media is prohibited.</p>
            </div>
          )
        };
      case 'sitemap':
        return {
          icon: <Map size={24} style={{ color: 'var(--primary)' }} />,
          title: 'Website Sitemap',
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <p>Use the directory links below to navigate directly to any page or section on the Viswam High School portal:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                <div>
                  <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 8px 0' }}>Public Sections</h5>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px', listStyleType: 'disc' }}>
                    <li><a href="#home" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Home (Overview, Metrics)</a></li>
                    <li><a href="#about" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>About Us (History & Staff)</a></li>
                    <li><a href="#disclosures" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>CBSE Mandatory Disclosures</a></li>
                    <li><a href="#news" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>News & Announcements Feed</a></li>
                    <li><a href="#gallery" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>3D Carousel & Photo Gallery</a></li>
                    <li><a href="#contact" onClick={onClose} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Contact & Inquiry Desk</a></li>
                  </ul>
                </div>
                <div>
                  <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '0 0 8px 0' }}>Administrative Tools</h5>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px', listStyleType: 'disc' }}>
                    <li>Admissions Alert Toggler</li>
                    <li>Hero Slideshow Image CMS</li>
                    <li>Teaching Faculty Card Uploader</li>
                    <li>Mandatory Document Uploader</li>
                    <li>Inquiry Messages Logger</li>
                    <li>Security Password Changer</li>
                  </ul>
                </div>
              </div>
            </div>
          )
        };
      case 'careers':
        return {
          icon: <Briefcase size={24} style={{ color: 'var(--primary)' }} />,
          title: 'Careers at Viswam School',
          body: (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <p>We are always looking for passionate, experienced, and dedicated teaching professionals to join the Viswam High School family.</p>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>Active Openings</h5>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px', listStyleType: 'disc' }}>
                <li>Trained Graduate Teachers (TGT) - Science & Mathematics</li>
                <li>Post Graduate Teachers (PGT) - English & Social Sciences</li>
                <li>Primary Teachers (PRT) & Kindergarten Instructors</li>
              </ul>
              <h5 style={{ fontWeight: '700', color: 'var(--text-dark)', margin: '5px 0 0 0' }}>How to Apply</h5>
              <p>Please send your updated resume, academic credentials, and cover letter directly to our official administrative email address: <a href="mailto:viswamschool2013@gmail.com" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'underline' }}>viswamschool2013@gmail.com</a>.</p>
              <p>Our administrative reviewing desk will evaluate submissions and contact shortlisted candidates for interviews shortly.</p>
            </div>
          )
        };
      default:
        return { icon: null, title: 'Information', body: null };
    }
  };

  const data = getContent();

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', width: '90%', animation: 'fadeInDown 0.3s ease-out' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          {data.icon}
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
            {data.title}
          </h3>
        </div>
        <div>
          {data.body}
        </div>
      </div>
    </div>
  );
}
