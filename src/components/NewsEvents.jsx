import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit, Check } from 'lucide-react';

export default function NewsEvents({ newsList, isEditMode, onUpdateNews }) {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddNews = (e) => {
    e.preventDefault();
    if (!newTitle || !newDate || !newDesc) return;
    
    const newItem = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      desc: newDesc
    };

    onUpdateNews([newItem, ...newsList]);
    setNewTitle('');
    setNewDate('');
    setNewDesc('');
  };

  const handleDeleteNews = (id) => {
    if (window.confirm("Delete this news article?")) {
      const updated = newsList.filter(item => item.id !== id);
      onUpdateNews(updated);
    }
  };

  const handleEditNews = (index, field, value) => {
    const updated = [...newsList];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateNews(updated);
  };

  return (
    <section id="news" className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '45px' }}>
        <h2 className="section-title">News & Announcements</h2>
        <p className="section-subtitle">
          Stay up to date with school activities, board schedules, admission cycles, and cultural events.
        </p>
      </div>

      {/* Admin Add News Form */}
      {isEditMode && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '25px',
          boxShadow: 'var(--shadow-sm)',
          border: '2px dashed var(--accent)',
          marginBottom: '35px'
        }}>
          <h4 style={{ color: 'var(--primary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            <span>Create News Announcement</span>
          </h4>
          <form onSubmit={handleAddNews} style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 3fr auto',
            gap: '15px',
            alignItems: 'end'
          }}>
            <div>
              <label className="form-label">Headline / Title</label>
              <input
                type="text"
                placeholder="e.g. Science Fair 2026"
                className="form-input"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Announcement Date</label>
              <input
                type="text"
                placeholder="e.g. Oct 12, 2026"
                className="form-input"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Description Details</label>
              <input
                type="text"
                placeholder="Write full announcement details..."
                className="form-input"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px', padding: '0 20px' }}>
              Publish
            </button>
          </form>
        </div>
      )}

      {/* News Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px'
      }}>
        {newsList.map((item, index) => (
          <div key={item.id} style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '25px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--accent)',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                <Calendar size={14} />
                <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ display: 'inline-block' }}>
                  {isEditMode ? (
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '0.8rem', height: '24px', padding: '2px 4px', width: '100px' }}
                      value={item.date}
                      onChange={(e) => handleEditNews(index, 'date', e.target.value)}
                    />
                  ) : (
                    <span>{item.date}</span>
                  )}
                </div>
              </div>

              {/* Owner actions */}
              {isEditMode && (
                <button
                  onClick={() => handleDeleteNews(item.id)}
                  style={{
                    color: 'var(--error)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="Remove News"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* Title */}
            <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
              <span className="edit-indicator">Edit Title</span>
              {isEditMode ? (
                <input
                  type="text"
                  className="form-input"
                  style={{ fontWeight: '700', fontSize: '1.1rem' }}
                  value={item.title}
                  onChange={(e) => handleEditNews(index, 'title', e.target.value)}
                />
              ) : (
                <h4 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-dark)' }}>{item.title}</h4>
              )}
            </div>

            {/* Description */}
            <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ flexGrow: 1 }}>
              <span className="edit-indicator">Edit Details</span>
              {isEditMode ? (
                <textarea
                  className="form-input"
                  style={{ fontSize: '0.9rem', width: '100%', fontFamily: 'inherit' }}
                  rows={3}
                  value={item.desc}
                  onChange={(e) => handleEditNews(index, 'desc', e.target.value)}
                />
              ) : (
                <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.5' }}>{item.desc}</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
