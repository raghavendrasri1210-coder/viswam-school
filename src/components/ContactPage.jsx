import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactPage({ data, isEditMode, onUpdateData }) {
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    
    const newErrors = {};

    // Validate Name
    if (!formName.trim()) {
      newErrors.name = 'Your name is required.';
    }

    // Validate Email
    if (!formEmail.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formEmail.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
      }
    }

    // Validate Phone (optional, but if typed, validate format)
    if (formPhone.trim()) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(formPhone.trim())) {
        newErrors.phone = 'Please enter a valid phone number.';
      }
    }

    // Validate Message
    if (!formMessage.trim()) {
      newErrors.message = 'Inquiry message is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { message: 'Failed to send. Please resolve all validation errors in the form.', type: 'error' }
      }));
      return;
    }

    // Clear errors and submit
    setErrors({});
    setSubmitted(true);

    const newEnquiry = {
      id: Date.now().toString(),
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      message: formMessage.trim(),
      date: new Date().toLocaleString()
    };

    fetch('/api/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEnquiry)
    })
    .then(async (res) => {
      if (res.ok) {
        // Dispatch window event so App.jsx updates state in real-time
        window.dispatchEvent(new Event('viswam_inquiry_added'));
        
        window.dispatchEvent(new CustomEvent('viswam_notification', {
          detail: { message: 'Inquiry successfully submitted to the school desk!', type: 'success' }
        }));
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit inquiry');
      }
    })
    .catch((err) => {
      console.error('Error saving inquiry:', err);
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { message: err.message || 'Failed to submit inquiry.', type: 'error' }
      }));
    });

    // Success response - styled inside the page, no Chrome alert popups!
    setTimeout(() => {
      setSubmitSuccess(true);
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormMessage('');
      setSubmitted(false);
      
      // Auto-hide success message after 8 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 8000);
    }, 600);
  };

  return (
    <section className="contact-page-section" style={{ padding: '60px 0', animation: 'fadeIn 0.5s ease-out' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="about-badge" style={{ margin: '0 auto 15px' }}>
            <Mail size={14} />
            <span>Get In Touch</span>
          </div>
          <h2 className="section-title">Contact Our Office</h2>
          <p className="section-subtitle">
            Have questions about admissions, school curriculum, or document submission? Send us a message or visit our campus.
          </p>
        </div>

        <div className="contact-grid-layout">

          {/* Column 1: Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '5px' }}>
              Administration Desk
            </h3>

            {/* Address Card */}
            <div className="contact-card-item" style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '20px',
              display: 'flex',
              gap: '15px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div className="footer-contact-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                <MapPin size={20} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' }}>School Campus Address</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Address</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.9rem', width: '100%', padding: '4px' }}
                      value={data.contactAddress || ''}
                      onChange={(e) => onUpdateData('contactAddress', e.target.value)}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{data.contactAddress}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="contact-card-item" style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '20px',
              display: 'flex',
              gap: '15px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div className="footer-contact-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                <Phone size={20} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' }}>Phone Numbers</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Phone</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.9rem', width: '100%', padding: '4px' }}
                      value={data.contactPhone || ''}
                      onChange={(e) => onUpdateData('contactPhone', e.target.value)}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>{data.contactPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="contact-card-item" style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              padding: '20px',
              display: 'flex',
              gap: '15px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div className="footer-contact-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
                <Mail size={20} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' }}>Email Address</h4>
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Email</span>
                  {isEditMode ? (
                    <input
                      type="email"
                      className="form-input"
                      style={{ fontSize: '0.9rem', width: '100%', padding: '4px' }}
                      value={data.contactEmail || ''}
                      onChange={(e) => onUpdateData('contactEmail', e.target.value)}
                    />
                  ) : (
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      <a href={`mailto:${data.contactEmail}`} style={{ textDecoration: 'underline', color: 'var(--primary)', fontWeight: '600' }}>
                        {data.contactEmail}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Office Hours */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: 'var(--radius-md)',
              padding: '15px 20px',
              borderLeft: '4px solid var(--accent)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Clock size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)' }}>
                Office Hours: Mon - Sat (9:00 AM - 4:30 PM)
              </span>
            </div>

          </div>

          {/* Column 2: Inquiry Form */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '35px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '10px' }}>
              Send an Inquiry
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '25px' }}>
              Fill out this quick form and our administration team will follow up via email within 24 hours.
            </p>

            {/* Premium Inline Success Message Box (No browser alert popup) */}
            {submitSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                padding: '15px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#15803d',
                animation: 'fadeInDown 0.4s ease-out'
              }}>
                <CheckCircle2 size={24} style={{ flexShrink: 0, color: '#16a34a' }} />
                <div>
                  <h5 style={{ fontWeight: '800', margin: '0 0 2px 0', fontSize: '0.95rem' }}>Submission Successful!</h5>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534' }}>
                    Your inquiry has been successfully sent to the school administration. We will get in touch shortly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label className="form-label" htmlFor="form-name">Your Name *</label>
                  <input
                    type="text"
                    id="form-name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="e.g. John Doe"
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                    }}
                  />
                  {errors.name && (
                    <div className="error-message">
                      <AlertCircle size={12} />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label className="form-label" htmlFor="form-email">Email Address *</label>
                  <input
                    type="text"
                    id="form-email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="e.g. john@example.com"
                    value={formEmail}
                    onChange={(e) => {
                      setFormEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                    }}
                  />
                  {errors.email && (
                    <div className="error-message">
                      <AlertCircle size={12} />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label" htmlFor="form-phone">Phone Number</label>
                <input
                  type="text"
                  id="form-phone"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  placeholder="e.g. +91 8885677877"
                  value={formPhone}
                  onChange={(e) => {
                    setFormPhone(e.target.value);
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
                  }}
                />
                {errors.phone && (
                  <div className="error-message">
                    <AlertCircle size={12} />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" htmlFor="form-msg">Inquiry Message *</label>
                <textarea
                  id="form-msg"
                  className={`form-input ${errors.message ? 'error' : ''}`}
                  rows={5}
                  placeholder="Enter details about your inquiry (e.g. admissions, academic records, fee structure)..."
                  value={formMessage}
                  onChange={(e) => {
                    setFormMessage(e.target.value);
                    if (errors.message) setErrors(prev => ({ ...prev, message: null }));
                  }}
                />
                {errors.message && (
                  <div className="error-message">
                    <AlertCircle size={12} />
                    <span>{errors.message}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  marginTop: '5px',
                  cursor: 'pointer'
                }}
              >
                <Send size={16} />
                <span>{submitted ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
              </button>

            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
