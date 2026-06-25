import React from 'react';

export default function Stats({ stats, isEditMode, onUpdateStats }) {
  
  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    onUpdateStats(newStats);
  };

  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={stat.id} className="stat-card">
            <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ width: '100%' }}>
              <span className="edit-indicator" style={{ top: '-15px' }}>Edit Stat</span>
              {isEditMode ? (
                <div className="stat-input-group">
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      padding: '4px',
                      color: 'var(--accent)'
                    }}
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      padding: '4px'
                    }}
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <div className={`stat-number ${stat.colorClass}`}>{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
