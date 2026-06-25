import React from 'react';
import { ToggleLeft, ToggleRight, RotateCcw, LogOut, Check, Eye, Settings, Inbox } from 'lucide-react';

export default function AdminPanel({
  isEditMode,
  onToggleEditMode,
  onResetData,
  onLogout,
  showAdmissionsAlert,
  onToggleAdmissions,
  enquiriesCount,
  onOpenSettings
}) {
  
  const handleResetConfirm = () => {
    if (window.confirm("Are you sure you want to reset all content changes back to the default school photos and texts? This cannot be undone.")) {
      onResetData();
    }
  };

  const storedEmail = localStorage.getItem('viswam_adminEmail') || 'viswamschool2013@gmail.com';

  return (
    <div className="admin-toolbar">
      <div className="admin-info">
        <span className="admin-badge">Owner</span>
        <span className="admin-user" style={{ fontSize: '0.8rem' }}>{storedEmail}</span>
      </div>

      <div className="admin-actions">
        {/* Toggle Admissions Banner Card */}
        <button
          type="button"
          className="btn-admin"
          onClick={() => onToggleAdmissions(!showAdmissionsAlert)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: showAdmissionsAlert ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255,255,255,0.05)',
            border: showAdmissionsAlert ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)'
          }}
          title="Toggle visibility of the Admissions Card at the very top of the website"
        >
          {showAdmissionsAlert ? (
            <>
              <ToggleRight size={16} style={{ color: '#22c55e' }} />
              <span style={{ color: '#22c55e', fontWeight: '700' }}>Admissions Banner Active</span>
            </>
          ) : (
            <>
              <ToggleLeft size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
              <span>Show Admissions Banner</span>
            </>
          )}
        </button>

        {/* View Enquiries Lead Hub button */}
        <button
          type="button"
          className="btn-admin"
          onClick={() => onOpenSettings('enquiries')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            position: 'relative'
          }}
        >
          <Inbox size={14} />
          <span>Messages</span>
          {enquiriesCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: '800',
              borderRadius: '10px',
              padding: '1px 6px',
              border: '2px solid #0f172a'
            }}>
              {enquiriesCount}
            </span>
          )}
        </button>

        {/* Security Settings */}
        <button
          type="button"
          className="btn-admin"
          onClick={() => onOpenSettings('security')}
          title="Change login credentials"
        >
          <Settings size={14} />
          <span>Settings</span>
        </button>

        {/* Toggle Edit Mode */}
        <button
          className={`btn-admin btn-admin-edit ${isEditMode ? 'active' : ''}`}
          onClick={onToggleEditMode}
        >
          {isEditMode ? (
            <>
              <Check size={14} />
              <span>Editing Active</span>
            </>
          ) : (
            <>
              <Eye size={14} />
              <span>Preview Mode (Click to Edit)</span>
            </>
          )}
        </button>

        {/* Reset Site Data */}
        <button
          className="btn-admin btn-admin-reset"
          onClick={handleResetConfirm}
          title="Restore original school info and photos"
        >
          <RotateCcw size={14} />
          <span>Reset Defaults</span>
        </button>

        {/* Logout */}
        <button
          className="btn-admin btn-admin-logout"
          onClick={onLogout}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
