import React, { useState, useRef, useEffect } from 'react';
import { Rotate3d, ChevronLeft, ChevronRight, Plus, Trash2, Camera, AlertCircle } from 'lucide-react';

export default function InteractiveCarousel3D({ gallery, isEditMode, onUpdateGallery }) {
  const [rotationY, setRotationY] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(0);
  const startRotationY = useRef(0);

  // Form states for adding photo in 3D carousel
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImgSrc, setNewImgSrc] = useState('');
  const [uploadError, setUploadError] = useState('');

  // We will display up to 8 images in the carousel. If gallery has fewer, we use what we have.
  const carouselItems = gallery.slice(0, 8);
  const totalItems = carouselItems.length;
  const angleStep = totalItems > 0 ? 360 / totalItems : 0;
  
  // Radius of the 3D cylinder
  const radius = totalItems > 0 ? Math.max(160, 45 * totalItems) : 160;

  // Rotate next / prev
  const handleNext = () => {
    if (totalItems === 0) return;
    setSelectedIndex((prev) => (prev + 1) % totalItems);
    setRotationY((prev) => prev - angleStep);
  };

  const handlePrev = () => {
    if (totalItems === 0) return;
    setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setRotationY((prev) => prev + angleStep);
  };

  // Drag handlers
  const handleMouseDown = (e) => {
    if (totalItems === 0) return;
    setIsDragging(true);
    dragStart.current = e.clientX;
    startRotationY.current = rotationY;
  };

  const handleMouseMove = (e) => {
    if (!isDragging || totalItems === 0) return;
    const deltaX = e.clientX - dragStart.current;
    const rotationChange = (deltaX / window.innerWidth) * 360;
    setRotationY(startRotationY.current + rotationChange);
  };

  const handleMouseUp = (e) => {
    if (!isDragging || totalItems === 0) return;
    setIsDragging(false);

    const normalizedRotation = rotationY % 360;
    const itemIndex = Math.round(-normalizedRotation / angleStep) % totalItems;
    const finalIndex = itemIndex < 0 ? itemIndex + totalItems : itemIndex;
    
    setSelectedIndex(finalIndex);
    setRotationY(-finalIndex * angleStep);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1 || totalItems === 0) return;
    setIsDragging(true);
    dragStart.current = e.touches[0].clientX;
    startRotationY.current = rotationY;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || totalItems === 0) return;
    const deltaX = e.touches[0].clientX - dragStart.current;
    const rotationChange = (deltaX / window.innerWidth) * 360;
    setRotationY(startRotationY.current + rotationChange);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [rotationY, isDragging, totalItems]);

  // Handle adding photo details in 3D
  const handleFileUpload = (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1500000) {
      setUploadError('Image must be under 1.5MB to save in local storage.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImgSrc(reader.result);
      if (!newTitle) {
        setNewTitle(file.name.split('.')[0] || 'New Photo');
      }
    };
    reader.readAsDataURL(file);
  };

  const [carouselSuccess, setCarouselSuccess] = useState('');

  const handleAddPhotoSubmit = (e) => {
    e.preventDefault();
    if (!newImgSrc) {
      setUploadError('Please select a photo file or enter a web URL.');
      return;
    }

    const newPhoto = {
      id: Date.now().toString(),
      src: newImgSrc,
      title: newTitle || '3D Carousel Photo',
      desc: newDesc || 'Added via 3D panel'
    };

    const updated = [newPhoto, ...gallery];
    onUpdateGallery(updated);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewImgSrc('');
    setUploadError('');
    setSelectedIndex(0);
    setRotationY(0);
    
    setCarouselSuccess('Photo successfully added to 3D Carousel!');
    setTimeout(() => {
      setCarouselSuccess('');
    }, 5000);
  };

  // Handle deleting from carousel
  const handleDeleteCurrent = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this photo from the school gallery?");
    if (!confirmDelete) return;

    const updated = gallery.filter(item => item.id !== id);
    onUpdateGallery(updated);
    
    // Snap back to 0 index safely
    setSelectedIndex(0);
    setRotationY(0);
  };

  // Edit details of active photo
  const handleEditActiveDetails = (id, field, value) => {
    const updated = gallery.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdateGallery(updated);
  };

  const activeItem = carouselItems[selectedIndex];

  return (
    <section id="tour" style={{ padding: '40px 0', overflow: 'hidden' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <h2 className="section-title">3D Interactive Photo Showcase</h2>
          <p className="section-subtitle">
            Click and drag the carousel left or right to spin the school images in 3D. Click a photo card to bring it forward.
          </p>
        </div>

        {/* 3D Add Photo Form - visible only to owner in edit mode */}
        {isEditMode && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '25px',
            marginBottom: '35px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '15px' }}>
              <Plus size={18} />
              <span>Add Picture with Details directly to 3D Carousel</span>
            </h4>

            {uploadError && (
              <div style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '15px' }}>
                {uploadError}
              </div>
            )}

            {carouselSuccess && (
              <div style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: '600', marginBottom: '15px' }}>
                {carouselSuccess}
              </div>
            )}

            <form onSubmit={handleAddPhotoSubmit} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '15px',
              alignItems: 'end'
            }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Choose Photo File *</label>
                <div className="file-input-wrapper" style={{ width: '100%' }}>
                  <button type="button" className="btn btn-outline" style={{ width: '100%', height: '40px' }}>
                    <Camera size={16} />
                    <span>Upload Image file</span>
                  </button>
                  <input type="file" accept="image/*" onChange={handleFileUpload} />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Or Paste Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                  value={newImgSrc.startsWith('data:') ? '' : newImgSrc}
                  onChange={(e) => setNewImgSrc(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Picture Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Science Lab Experiment"
                  className="form-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Description / Caption *</label>
                <input
                  type="text"
                  placeholder="e.g. Grade X students conducting chemistry labs."
                  className="form-input"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '40px' }}>
                  <Plus size={16} />
                  <span>Add to Carousel</span>
                </button>
                {newImgSrc && (
                  <img src={newImgSrc} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                )}
              </div>
            </form>
          </div>
        )}

        {/* 3D Viewport container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          height: '420px',
          backgroundColor: '#0f172a',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-premium)',
          border: '1px solid var(--border)',
          userSelect: 'none'
        }}>
          
          {/* Navigation Helper */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10
          }}>
            <Rotate3d size={16} />
            <span>
              {totalItems > 0 
                ? `Click & Drag to Spin | Selected Card: ${selectedIndex + 1} of ${totalItems}`
                : "No Photos Available"
              }
            </span>
          </div>

          {totalItems > 0 ? (
            <div 
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              style={{
                perspective: '1000px',
                width: '100%',
                height: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {/* 3D Ring container */}
              <div style={{
                position: 'relative',
                width: '240px',
                height: '160px',
                transformStyle: 'preserve-3d',
                transform: `rotateX(-10deg) rotateY(${rotationY}deg)`,
                transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
              }}>
                {carouselItems.map((item, index) => {
                  const itemAngle = index * angleStep;
                  const isFront = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedIndex(index);
                        setRotationY(-index * angleStep);
                      }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        left: 0,
                        top: 0,
                        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                        transformStyle: 'preserve-3d',
                        backfaceVisibility: 'visible',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        boxShadow: isFront 
                          ? `0 0 25px var(--primary-light), 0 10px 25px rgba(0,0,0,0.5)` 
                          : '0 4px 15px rgba(0,0,0,0.4)',
                        border: isFront ? '3px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.1)',
                        transition: 'all 0.3s ease',
                        opacity: isFront ? 1 : 0.4,
                        transformOrigin: 'center center'
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          pointerEvents: 'none'
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
                        padding: '8px 12px',
                        color: 'white',
                        fontSize: '0.8rem',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontWeight: '700' }}>{item.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px' }}>
              <Camera size={48} style={{ opacity: 0.5, marginBottom: '15px' }} />
              <p>No photos in the gallery.</p>
              {isEditMode && <p style={{ fontSize: '0.8rem' }}>Use the uploader above to add new school pictures!</p>}
            </div>
          )}

          {totalItems > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="btn"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <button 
                onClick={handleNext}
                className="btn"
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '45px',
                  height: '45px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        {/* Details card shown below the 3D Carousel */}
        {activeItem && (
          <div style={{
            marginTop: '25px',
            padding: '20px 30px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            position: 'relative',
            animation: 'fadeInUp 0.4s ease-out'
          }} className="carousel-details-box">
            
            {/* Delete current photo action in CMS */}
            {isEditMode && (
              <button
                onClick={() => handleDeleteCurrent(activeItem.id)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: 'var(--error)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
                title="Remove picture from school records"
              >
                <Trash2 size={14} />
                <span>Remove Card</span>
              </button>
            )}

            {isEditMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '80%' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Edit Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeItem.title}
                    onChange={(e) => handleEditActiveDetails(activeItem.id, 'title', e.target.value)}
                    style={{ fontSize: '1.2rem', fontWeight: '800', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '3px' }}>Edit Description / Caption</label>
                  <input
                    type="text"
                    className="form-input"
                    value={activeItem.desc}
                    onChange={(e) => handleEditActiveDetails(activeItem.id, 'desc', e.target.value)}
                    style={{ fontSize: '0.9rem', padding: '4px 8px' }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h4 style={{
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: 'var(--text-dark)',
                  marginBottom: '6px'
                }}>
                  {activeItem.title}
                </h4>
                <p style={{
                  color: 'var(--text-light)',
                  fontSize: '0.95rem',
                  margin: 0
                }}>
                  {activeItem.desc}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
