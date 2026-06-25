import React, { useState } from 'react';
import { Award, Mail, Plus, Trash2, Camera, AlertCircle } from 'lucide-react';

export default function Leadership({ staffList, isEditMode, onUpdateStaff }) {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberCreds, setNewMemberCreds] = useState('');
  const [newMemberBio, setNewMemberBio] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberImg, setNewMemberImg] = useState('/principal.png');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle staff image upload and convert to Base64
  const handleImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000000) {
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { 
          message: "Image is too large. Please select a photo under 1MB to stay within storage limit.", 
          type: 'error' 
        }
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = [...staffList];
      updated[index] = { ...updated[index], image: reader.result };
      onUpdateStaff(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleNewMemberImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000000) {
      setErrorMsg("Image is too large. Choose a photo under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewMemberImg(reader.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...staffList];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateStaff(updated);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberRole) {
      setErrorMsg('Name and Role/Title are required.');
      return;
    }

    const newStaff = {
      id: Date.now().toString(),
      name: newMemberName,
      role: newMemberRole,
      credentials: newMemberCreds || 'Credentials',
      bio: newMemberBio || 'Biography details...',
      image: newMemberImg,
      email: newMemberEmail || 'viswamschool2013@gmail.com'
    };

    onUpdateStaff([...staffList, newStaff]);
    
    // Reset Form
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberCreds('');
    setNewMemberBio('');
    setNewMemberEmail('');
    setNewMemberImg('/principal.png');
    setErrorMsg('');
  };

  const handleDeleteStaff = (id) => {
    if (staffList.length <= 1) {
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { 
          message: "You must keep at least one leadership profile (e.g. Principal).", 
          type: 'warning' 
        }
      }));
      return;
    }
    const updated = staffList.filter(s => s.id !== id);
    onUpdateStaff(updated);
  };

  return (
    <section id="leadership" style={{ padding: '50px 0', animation: 'fadeIn 0.5s ease-out' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="about-badge" style={{ margin: '0 auto 15px' }}>
            <Award size={14} />
            <span>School Leadership</span>
          </div>
          <h2 className="section-title">Academic & Administrative Roles</h2>
          <p className="section-subtitle">
            Meet the experienced leadership team and key faculty members guiding Viswam High School.
          </p>
        </div>

        {/* CMS Panel: Add Role Card */}
        {isEditMode && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '30px',
            marginBottom: '40px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '15px' }}>
              <Plus size={20} />
              <span>Add New Leadership/Role Card</span>
            </h4>

            {errorMsg && (
              <div className="form-error" style={{ marginBottom: '15px' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAddStaff} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px',
              alignItems: 'end'
            }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Maddela Neeraja"
                  className="form-input"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Role/Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Principal / Director"
                  className="form-input"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Credentials</label>
                <input
                  type="text"
                  placeholder="e.g. M.Sc B.Ed"
                  className="form-input"
                  value={newMemberCreds}
                  onChange={(e) => setNewMemberCreds(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Contact Email</label>
                <input
                  type="email"
                  placeholder="viswamschool2013@gmail.com"
                  className="form-input"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ flexGrow: 1 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>Photo</label>
                  <div className="file-input-wrapper" style={{ width: '100%' }}>
                    <button type="button" className="btn btn-outline" style={{ width: '100%', height: '40px', padding: '0 10px', fontSize: '0.8rem' }}>
                      <Camera size={14} />
                      <span>Choose File</span>
                    </button>
                    <input type="file" accept="image/*" onChange={handleNewMemberImage} />
                  </div>
                </div>
                {newMemberImg && (
                  <img src={newMemberImg} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                )}
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Biography / Quote</label>
                <textarea
                  placeholder="Describe their responsibilities or a personal message to students..."
                  className="form-input"
                  rows={2}
                  value={newMemberBio}
                  onChange={(e) => setNewMemberBio(e.target.value)}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                  <Plus size={16} />
                  <span>Add Role Card</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Leadership Grid */}
        <div className="leadership-cards-container">
          
          {staffList.map((member, index) => (
            <div key={member.id} 
              className="leadership-role-card" 
              style={{
                maxWidth: staffList.length === 1 ? '800px' : '550px'
              }}
            >

              {/* Action: Delete card */}
              {isEditMode && (
                <button
                  onClick={() => handleDeleteStaff(member.id)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--error)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title="Remove Card"
                >
                  <Trash2 size={15} />
                </button>
              )}

              {/* Column 1: Image & Role Badge */}
              <div className="leadership-image-col">
                <div className="leadership-image-wrapper">
                  <img
                    src={member.image || '/principal.png'}
                    alt={member.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Camera overlay in edit mode */}
                  {isEditMode && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      <Camera size={14} style={{ color: 'white', marginRight: '5px' }} />
                      <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: '700' }}>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          opacity: 0,
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Role Badge */}
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ width: '100%' }}>
                  <span className="edit-indicator">Edit Role</span>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.75rem', padding: '4px', textAlign: 'center', fontWeight: '700' }}
                      value={member.role}
                      onChange={(e) => handleFieldChange(index, 'role', e.target.value)}
                    />
                  ) : (
                    <div style={{
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      width: '100%'
                    }}>
                      {member.role}
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Text details */}
              <div className="leadership-info-col">
                <div>
                  <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ width: '100%' }}>
                    <span className="edit-indicator">Edit Name</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '1.2rem', fontWeight: '800' }}
                        value={member.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      />
                    ) : (
                      <h4 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                        {member.name}
                      </h4>
                    )}
                  </div>

                  <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ marginTop: '4px' }}>
                    <span className="edit-indicator">Edit Credentials</span>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '2px 4px' }}
                        value={member.credentials}
                        onChange={(e) => handleFieldChange(index, 'credentials', e.target.value)}
                      />
                    ) : (
                      <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>
                        {member.credentials}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Bio</span>
                  {isEditMode ? (
                    <textarea
                      className="form-input"
                      rows={3}
                      style={{ fontSize: '0.85rem', fontFamily: 'inherit' }}
                      value={member.bio}
                      onChange={(e) => handleFieldChange(index, 'bio', e.target.value)}
                    />
                  ) : (
                    <p style={{
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      fontStyle: 'italic',
                      margin: 0
                    }}>
                      "{member.bio}"
                    </p>
                  )}
                </div>

                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                  <span className="edit-indicator">Edit Email</span>
                  {isEditMode ? (
                    <input
                      type="email"
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '2px 4px' }}
                      value={member.email}
                      onChange={(e) => handleFieldChange(index, 'email', e.target.value)}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      <Mail size={13} />
                      <a href={`mailto:${member.email}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                        {member.email}
                      </a>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
