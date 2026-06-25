import React, { useState } from 'react';
import { Camera, Plus, Trash2, Maximize2, Link, FileImage, X } from 'lucide-react';

export default function Gallery({ gallery, isEditMode, onUpdateGallery }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [newImgUrl, setNewImgUrl] = useState('');
  const [newImgTitle, setNewImgTitle] = useState('');
  const [newImgDesc, setNewImgDesc] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Handle local file upload and convert to Base64
  const handleFileUpload = (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 1.5MB to stay within LocalStorage limits safely)
    if (file.size > 1500000) {
      setUploadError('Image is too large. Please select an image under 1.5MB for local browser storage.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        id: Date.now().toString(),
        src: reader.result,
        title: file.name.split('.')[0] || 'Uploaded Image',
        desc: 'Added by Owner'
      };
      onUpdateGallery([newPhoto, ...gallery]);
    };
    reader.onerror = () => {
      setUploadError('Error reading file.');
    };
    reader.readAsDataURL(file);
  };

  // Handle adding image via Direct URL link
  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!newImgUrl) return;

    const newPhoto = {
      id: Date.now().toString(),
      src: newImgUrl,
      title: newImgTitle || 'URL Image',
      desc: newImgDesc || 'External Reference'
    };

    onUpdateGallery([newPhoto, ...gallery]);
    setNewImgUrl('');
    setNewImgTitle('');
    setNewImgDesc('');
  };

  const handleDeleteImage = (id, e) => {
    e.stopPropagation(); // Prevent opening lightbox
    const updated = gallery.filter((item) => item.id !== id);
    onUpdateGallery(updated);
  };

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 className="section-title">Photo Gallery</h2>
          <p className="section-subtitle">
            Glimpses of cultural events, farewell day functions, student celebrations, and the modern campus facilities.
          </p>
        </div>

        {/* Gallery Admin Manager Panel */}
        {isEditMode && (
          <div className="gallery-admin-panel">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
              <Camera size={20} />
              <span>Gallery Photo Manager</span>
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', maxWidth: '550px' }}>
              Add photos by either uploading an image from your computer or pasting an image URL link.
            </p>

            {uploadError && (
              <div style={{ color: 'var(--error)', fontSize: '0.85rem', fontWeight: '600' }}>
                {uploadError}
              </div>
            )}

            <div className="gallery-admin-actions">
              {/* Method 1: Local Upload */}
              <div className="file-input-wrapper">
                <button className="btn btn-primary">
                  <FileImage size={16} />
                  <span>Upload Local Photo</span>
                </button>
                <input type="file" accept="image/*" onChange={handleFileUpload} />
              </div>

              <span style={{ fontWeight: '700', color: 'var(--text-light)', fontSize: '0.9rem' }}>OR</span>

              {/* Method 2: Link URL */}
              <form onSubmit={handleUrlSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="url"
                  placeholder="Paste Image Web URL..."
                  className="form-input"
                  style={{ width: '220px', height: '40px' }}
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Caption..."
                  className="form-input"
                  style={{ width: '120px', height: '40px' }}
                  value={newImgTitle}
                  onChange={(e) => setNewImgTitle(e.target.value)}
                />
                <button type="submit" className="btn btn-outline" style={{ height: '40px' }}>
                  <Plus size={16} />
                  <span>Add URL</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => !isEditMode && setSelectedImage(item)}
            >
              <img src={item.src} alt={item.title} className="gallery-image" loading="lazy" />
              <div className="gallery-overlay">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
                  <div>
                    <h5 className="gallery-item-title">{item.title}</h5>
                    <p className="gallery-item-desc">{item.desc}</p>
                  </div>
                  <Maximize2 size={16} style={{ color: 'white', opacity: 0.8 }} />
                </div>
              </div>

              {/* Delete button visible to admin only */}
              {isEditMode && (
                <button
                  className="gallery-item-delete"
                  onClick={(e) => handleDeleteImage(item.id, e)}
                  title="Delete Photo"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox modal overlay */}
        {selectedImage && (
          <div className="lightbox" onClick={() => setSelectedImage(null)}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              <X size={24} />
            </button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
              <img src={selectedImage.src} alt={selectedImage.title} className="lightbox-img" />
              <div className="lightbox-info">
                <h4 className="lightbox-title">{selectedImage.title}</h4>
                <p className="lightbox-desc">{selectedImage.desc}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
