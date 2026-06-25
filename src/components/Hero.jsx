import React, { useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, Camera, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function Hero({ data, isEditMode, onUpdateData, slides = [], onUpdateSlides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideImg, setNewSlideImg] = useState('');
  const [sliderError, setSliderError] = useState('');

  // Fallback slides in case none exist
  const activeSlides = slides.length > 0 ? slides : [
    { id: 'hs1', image: '/school_building.png', title: 'Main Campus Building' },
    { id: 'hs2', image: '/farewell_banner.jpg', title: 'Farewell Day Celebrations' },
    { id: 'hs3', image: '/fire_ceremony.png', title: 'Traditional Festivities' },
    { id: 'hs4', image: '/palm_leaves.jpg', title: 'Students Cultural Activities' }
  ];

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Upload local slide image and convert to Base64
  const handleFileUpload = (e) => {
    setSliderError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1500000) {
      setSliderError('Slide image is too large. Please select a photo under 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewSlideImg(reader.result);
      if (!newSlideTitle) {
        setNewSlideTitle(file.name.split('.')[0] || 'Campus View');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlideSubmit = (e) => {
    e.preventDefault();
    if (!newSlideImg) {
      setSliderError('Please upload a slide photo file.');
      return;
    }

    const newSlide = {
      id: Date.now().toString(),
      image: newSlideImg,
      title: newSlideTitle || 'School Activity'
    };

    onUpdateSlides([...slides, newSlide]);
    setNewSlideTitle('');
    setNewSlideImg('');
    setSliderError('');
    setCurrentSlide(slides.length); // Snap to newly added slide
    window.dispatchEvent(new CustomEvent('viswam_notification', {
      detail: { 
        message: "New background picture added to the Home Hero slider!", 
        type: 'success' 
      }
    }));
  };

  const handleDeleteSlide = (id, event) => {
    event.stopPropagation();
    if (activeSlides.length <= 1) {
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { 
          message: "You must keep at least one background slide image for the Hero banner.", 
          type: 'warning' 
        }
      }));
      return;
    }
    const updated = activeSlides.filter(s => s.id !== id);
    onUpdateSlides(updated);
    setCurrentSlide(0);
  };

  return (
    <section id="home" className="hero-section" style={{ position: 'relative' }}>
      
      {/* Background Slides */}
      <div className="hero-slider">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id || index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />

      {/* Hero Content Overlay Container */}
      <div className="hero-container">
        <div className="hero-tagline">Viswam English Medium High School</div>

        <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
          <span className="edit-indicator">Edit Welcome Title</span>
          {isEditMode ? (
            <input
              type="text"
              className="form-input"
              style={{
                fontSize: '2.5rem',
                fontWeight: '900',
                color: 'white',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px dashed var(--accent)',
                marginBottom: '20px',
                width: '100%',
                padding: '8px'
              }}
              value={data.heroTitle || ''}
              onChange={(e) => onUpdateData('heroTitle', e.target.value)}
            />
          ) : (
            <h1 className="hero-title">{data.heroTitle}</h1>
          )}
        </div>

        <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ marginTop: '10px' }}>
          <span className="edit-indicator">Edit Welcome Description</span>
          {isEditMode ? (
            <textarea
              className="form-input"
              rows={4}
              style={{
                fontSize: '1.05rem',
                color: 'white',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px dashed var(--accent)',
                marginBottom: '20px',
                width: '100%',
                fontFamily: 'inherit',
                padding: '8px'
              }}
              value={data.heroDesc || ''}
              onChange={(e) => onUpdateData('heroDesc', e.target.value)}
            />
          ) : (
            <p className="hero-desc">{data.heroDesc}</p>
          )}
        </div>

        <div className="hero-bullets">
          <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
            <span className="edit-indicator">Edit Bullet 1</span>
            {isEditMode ? (
              <input
                type="text"
                className="form-input"
                style={{
                  color: 'white',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed var(--accent)',
                  margin: '5px 0',
                  width: '100%',
                  padding: '6px'
                }}
                value={data.heroBullet1 || ''}
                onChange={(e) => onUpdateData('heroBullet1', e.target.value)}
              />
            ) : (
              <div className="hero-bullet-item">
                <CheckCircle2 size={18} className="hero-bullet-icon" />
                <span>{data.heroBullet1}</span>
              </div>
            )}
          </div>

          <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
            <span className="edit-indicator">Edit Bullet 2</span>
            {isEditMode ? (
              <input
                type="text"
                className="form-input"
                style={{
                  color: 'white',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed var(--accent)',
                  margin: '5px 0',
                  width: '100%',
                  padding: '6px'
                }}
                value={data.heroBullet2 || ''}
                onChange={(e) => onUpdateData('heroBullet2', e.target.value)}
              />
            ) : (
              <div className="hero-bullet-item">
                <CheckCircle2 size={18} className="hero-bullet-icon" />
                <span>{data.heroBullet2}</span>
              </div>
            )}
          </div>

          <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
            <span className="edit-indicator">Edit Bullet 3</span>
            {isEditMode ? (
              <input
                type="text"
                className="form-input"
                style={{
                  color: 'white',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px dashed var(--accent)',
                  margin: '5px 0',
                  width: '100%',
                  padding: '6px'
                }}
                value={data.heroBullet3 || ''}
                onChange={(e) => onUpdateData('heroBullet3', e.target.value)}
              />
            ) : (
              <div className="hero-bullet-item">
                <CheckCircle2 size={18} className="hero-bullet-icon" />
                <span>{data.heroBullet3}</span>
              </div>
            )}
          </div>
        </div>

        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => (window.location.hash = '#about')}>
            <span>Our History</span>
            <ChevronRight size={16} />
          </button>
          <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => (window.location.hash = '#contact')}>
            <span>Contact Information</span>
          </button>
        </div>
      </div>

      <div className="hero-slide-nav">
        {activeSlides.map((_, index) => (
          <div
            key={index}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>

      {/* Hero Background Slider Manager Panel (Visible only in Edit Mode) */}
      {isEditMode && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          zIndex: 40,
          color: 'white',
          animation: 'fadeInUp 0.3s ease-out'
        }} className="slider-admin-panel">
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: '800' }}>
            <Camera size={16} />
            <span>Home Background Picture Manager</span>
          </h4>

          {sliderError && (
            <div style={{ color: '#ff4d4d', fontSize: '0.8rem', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} />
              <span>{sliderError}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Form to upload new background picture */}
            <form onSubmit={handleAddSlideSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end', flexGrow: 1 }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Upload Slide File</label>
                <div className="file-input-wrapper" style={{ width: '160px' }}>
                  <button type="button" className="btn btn-outline" style={{ width: '100%', height: '35px', padding: '0 10px', fontSize: '0.8rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                    <Camera size={14} style={{ marginRight: '5px' }} />
                    <span>Upload Image</span>
                  </button>
                  <input type="file" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Slide Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Science Labs"
                  className="form-input"
                  style={{ height: '35px', width: '160px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ height: '35px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 15px' }}>
                <Plus size={14} />
                <span>Add Slide</span>
              </button>
              {newSlideImg && (
                <img src={newSlideImg} alt="Preview" style={{ width: '35px', height: '35px', borderRadius: '4px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }} />
              )}
            </form>

            {/* List of current slides */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px', maxWidth: '400px' }} className="slider-list-edit">
              {activeSlides.map((slide, index) => (
                <div key={slide.id || index} style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: index === currentSlide ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }} onClick={() => setCurrentSlide(index)}>
                  <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button onClick={(e) => handleDeleteSlide(slide.id, e)} style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(239, 68, 68, 0.8)', color: 'white', border: 'none', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }} title="Delete Slide">
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
