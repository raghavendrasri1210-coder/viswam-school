import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Check credentials loaded dynamically
    const storedEmail = localStorage.getItem('viswam_adminEmail') || 'viswamschool2013@gmail.com';
    const storedPassword = localStorage.getItem('viswam_adminPassword') || 'viswam@2013';

    if (email.trim() === storedEmail && password === storedPassword) {
      onLoginSuccess();
      onClose();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
          <div className="modal-icon">
            <Lock size={26} />
          </div>
          <h3 className="modal-title">Owner Administration</h3>
          <p className="modal-subtitle">Log in to update school content and images</p>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="form-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }} />
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  placeholder="owner@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-light)'
                }} />
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  style={{ paddingLeft: '44px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="form-submit-btn btn">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
