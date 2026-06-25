import React, { useState } from 'react';
import { Award, Clock, Plus, Trash2, Calendar } from 'lucide-react';

export default function About({ data, milestones, isEditMode, onUpdateData, onUpdateMilestones }) {
  const [newYear, setNewYear] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateMilestones(updated);
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newYear || !newTitle || !newDesc) return;
    const newM = {
      id: Date.now().toString(),
      year: newYear,
      title: newTitle,
      desc: newDesc
    };
    onUpdateMilestones([...milestones, newM]);
    setNewYear('');
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteMilestone = (id) => {
    const updated = milestones.filter(m => m.id !== id);
    onUpdateMilestones(updated);
  };

  return (
    <section id="about" className="about-section">
      <div className="container">
        
        {/* Intro Grid */}
        <div className="about-intro-grid">
          
          <div className="about-text-content">
            <div className="about-badge">
              <Award size={14} />
              <span>About Our School</span>
            </div>
            
            <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
              <span className="edit-indicator">Edit About Title</span>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input"
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    marginBottom: '15px',
                    width: '100%'
                  }}
                  value={data.aboutTitle || ''}
                  onChange={(e) => onUpdateData('aboutTitle', e.target.value)}
                />
              ) : (
                <h3>{data.aboutTitle}</h3>
              )}
            </div>

            <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ marginTop: '10px' }}>
              <span className="edit-indicator">Edit About Content</span>
              {isEditMode ? (
                <textarea
                  className="form-input"
                  rows={6}
                  style={{
                    fontSize: '1.05rem',
                    lineHeight: '1.6',
                    width: '100%',
                    fontFamily: 'inherit'
                  }}
                  value={data.aboutContent || ''}
                  onChange={(e) => onUpdateData('aboutContent', e.target.value)}
                />
              ) : (
                <p style={{ whiteSpace: 'pre-line' }}>{data.aboutContent}</p>
              )}
            </div>
          </div>

          <div className="about-image-card">
            <img src="/school_building.png" alt="Viswam School Campus" />
            <div className="about-card-badge">
              <span className="year">2013</span>
              <span className="text">Founded</span>
            </div>
          </div>

        </div>

        {/* Timeline Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 className="section-title">Our Journey Through the Years</h2>
          <p className="section-subtitle">
            Explore the key milestones that have shaped Viswam School's legacy of excellence.
          </p>
        </div>

        {/* Milestone Editor Panel (Visible only in Edit Mode) */}
        {isEditMode && (
          <div className="timeline-edit-panel">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: 'var(--primary)' }}>
              <Clock size={18} />
              <span>Milestone Manager</span>
            </h4>
            
            <form onSubmit={handleAddMilestone} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 3fr auto',
              gap: '12px',
              alignItems: 'end',
              background: '#f1f5f9',
              padding: '15px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2013"
                  className="form-input"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Foundation"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Description</label>
                <input
                  type="text"
                  placeholder="Describe the milestone..."
                  className="form-input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '45px', padding: '0 15px' }}>
                <Plus size={18} />
                <span>Add</span>
              </button>
            </form>

            <div className="timeline-edit-list">
              {milestones.map((m, index) => (
                <div key={m.id} className="timeline-edit-item">
                  <input
                    type="text"
                    className="form-input"
                    value={m.year}
                    placeholder="Year"
                    onChange={(e) => handleMilestoneChange(index, 'year', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={m.title}
                    placeholder="Title"
                    onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={m.desc}
                    placeholder="Description"
                    onChange={(e) => handleMilestoneChange(index, 'desc', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteMilestone(m.id)}
                    className="btn"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--error)',
                      padding: '8px'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Layout */}
        <div className="timeline-container">
          <div className="timeline-line"></div>
          {milestones.map((milestone) => (
            <div key={milestone.id} className="timeline-item">
              <div className="timeline-node"></div>
              <div className="timeline-card">
                <div className="timeline-year">{milestone.year}</div>
                <h4 className="timeline-title">{milestone.title}</h4>
                <p className="timeline-desc">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
