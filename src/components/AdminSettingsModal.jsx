import React, { useState } from 'react';
import { X, Shield, Mail, Phone, Calendar, Trash2, Key, UserCheck, Inbox } from 'lucide-react';

export default function AdminSettingsModal({ isOpen, onClose, inquiries, onUpdateInquiries, mode }) {
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Email change states
  const [newEmail, setNewEmail] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');

  if (!isOpen) return null;

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const storedPassword = localStorage.getItem('viswam_adminPassword') || 'viswam@2013';

    if (currentPassword !== storedPassword) {
      setPasswordError('The current password you entered is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    localStorage.setItem('viswam_adminPassword', newPassword);
    setPasswordSuccess('Password successfully updated!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleEmailChangeSubmit = (e) => {
    e.preventDefault();
    setEmailError('');
    setEmailSuccess('');

    const storedPassword = localStorage.getItem('viswam_adminPassword') || 'viswam@2013';

    if (emailConfirmPassword !== storedPassword) {
      setEmailError('Incorrect password validation.');
      return;
    }

    if (!newEmail.trim() || !newEmail.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    localStorage.setItem('viswam_adminEmail', newEmail.trim());
    setEmailSuccess('Admin email successfully updated!');
    setNewEmail('');
    setEmailConfirmPassword('');
    
    window.dispatchEvent(new CustomEvent('viswam_notification', {
      detail: { 
        message: `Admin login email changed to: ${newEmail.trim()}. Use this email for your next login.`, 
        type: 'success' 
      }
    }));
  };

  const handleDeleteEnquiry = (id) => {
    const updated = inquiries.filter((item) => item.id !== id);
    onUpdateInquiries(updated);
  };

  const handleClearAllEnquiries = () => {
    if (window.confirm('Are you sure you want to delete all inquiries? This cannot be undone.')) {
      onUpdateInquiries([]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', width: '90%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0 }}>
        
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 25px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={22} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
              {mode === 'enquiries' ? 'Parent Enquiries Hub' : 'Security Settings Portal'}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose} style={{ position: 'static', padding: '5px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Area */}
        <div style={{ overflowY: 'auto', padding: '25px' }}>
          
          {/* VIEW MODE A: Enquiries List (Only shows messages, no security settings) */}
          {mode === 'enquiries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--text-dark)' }}>
                  Inquiries Received via Contact Form
                </h4>
                {inquiries.length > 0 && (
                  <button
                    onClick={handleClearAllEnquiries}
                    className="btn"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                  >
                    Clear All Records
                  </button>
                )}
              </div>

              {inquiries.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {inquiries.map((item) => (
                    <div key={item.id} style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      padding: '18px',
                      position: 'relative',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteEnquiry(item.id)}
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          border: 'none',
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '5px'
                        }}
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* Header details */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '10px', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '600' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dark)', fontWeight: '700', fontSize: '0.95rem' }}>
                          {item.name}
                        </span>
                        {item.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={13} /> {item.phone}
                          </span>
                        )}
                        {item.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={13} /> {item.email}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                          <Calendar size={13} /> {item.date}
                        </span>
                      </div>

                      {/* Message Content */}
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: 'var(--text-main)',
                        backgroundColor: 'white',
                        padding: '10px 15px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'pre-line'
                      }}>
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                  <Inbox size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                  <p style={{ fontWeight: '600' }}>No inquiries received yet.</p>
                  <p style={{ fontSize: '0.8rem' }}>When visitors submit the Contact Us form, their messages will display here.</p>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE B: Security settings (Only shows security inputs, no messages list) */}
          {mode === 'security' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }} className="contact-grid-mobile">
              
              {/* Card A: Change Password */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                padding: '25px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 15px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  <Key size={18} style={{ color: 'var(--accent)' }} />
                  <span>Change Password</span>
                </h4>

                {passwordError && <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px' }}>{passwordError}</div>}
                {passwordSuccess && <div style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px' }}>{passwordSuccess}</div>}

                <form onSubmit={handlePasswordChangeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Present Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>New Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Confirm New Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Save Password
                  </button>
                </form>
              </div>

              {/* Card B: Change Login Email */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                padding: '25px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 15px', fontWeight: '800', color: 'var(--text-dark)' }}>
                  <UserCheck size={18} style={{ color: 'var(--accent)' }} />
                  <span>Change Admin Email</span>
                </h4>

                {emailError && <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px' }}>{emailError}</div>}
                {emailSuccess && <div style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px' }}>{emailSuccess}</div>}

                <form onSubmit={handleEmailChangeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>New Admin Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. viswamschool2013@gmail.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Validate with Password *</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="Enter admin password to confirm"
                      value={emailConfirmPassword}
                      onChange={(e) => setEmailConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '27px' }}>
                    Update Email Address
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
