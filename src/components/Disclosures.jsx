import React, { useState } from 'react';
import { FileText, Upload, Trash2, Shield, Plus, Camera, AlertCircle } from 'lucide-react';

export default function Disclosures({ disclosures, isEditMode, onUpdateDisclosures }) {
  const [activeTab, setActiveTab] = useState('general');
  const [uploadErrors, setUploadErrors] = useState({});

  // Add row form states
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newFileSrc, setNewFileSrc] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  const handleGeneralChange = (index, value) => {
    const updatedGeneral = [...disclosures.general];
    updatedGeneral[index] = { ...updatedGeneral[index], value };
    onUpdateDisclosures({ ...disclosures, general: updatedGeneral });
  };

  const handleTableFieldChange = (tabKey, index, field, value) => {
    const updatedList = [...disclosures[tabKey]];
    updatedList[index] = { ...updatedList[index], [field]: value };
    onUpdateDisclosures({ ...disclosures, [tabKey]: updatedList });
  };

  const handleLinkNameChange = (tabKey, index, value) => {
    handleTableFieldChange(tabKey, index, 'fileName', value);
  };

  const handleFileChange = (tabKey, index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1500000) {
      setUploadErrors(prev => ({
        ...prev,
        [`${tabKey}-${index}`]: 'File size exceeds 1.5MB. Please choose a smaller document.'
      }));
      return;
    }

    setUploadErrors(prev => {
      const copy = { ...prev };
      delete copy[`${tabKey}-${index}`];
      return copy;
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedList = [...disclosures[tabKey]];
      updatedList[index] = {
        ...updatedList[index],
        fileSrc: reader.result,
        fileName: file.name
      };
      onUpdateDisclosures({ ...disclosures, [tabKey]: updatedList });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (tabKey, index) => {
    const updatedList = [...disclosures[tabKey]];
    const updatedItem = { ...updatedList[index] };
    delete updatedItem.fileSrc;
    updatedItem.fileName = '-';
    updatedList[index] = updatedItem;
    onUpdateDisclosures({ ...disclosures, [tabKey]: updatedList });
  };

  const handleDownload = (item) => {
    if (!item.fileSrc || item.fileSrc === '#') {
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { 
          message: `"${item.fileName}" is a default template document. You can log in as Owner to upload the official school PDF.`, 
          type: 'warning' 
        }
      }));
      return;
    }

    if (item.fileSrc.startsWith('http')) {
      window.open(item.fileSrc, '_blank');
      return;
    }

    const link = document.createElement('a');
    link.href = item.fileSrc;
    link.download = item.fileName || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add row submit
  const handleNewRowFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1500000) {
      window.dispatchEvent(new CustomEvent('viswam_notification', {
        detail: { 
          message: 'File size exceeds 1.5MB. Choose a smaller document.', 
          type: 'error' 
        }
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewFileSrc(reader.result);
      setNewFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleAddRowSubmit = (e) => {
    e.preventDefault();
    if (!newLabel) return;

    const isDocTable = activeTab === 'documents' || activeTab === 'academics';
    const newRow = {
      id: Date.now().toString(),
      name: isDocTable ? newLabel : undefined,
      label: !isDocTable ? newLabel : undefined,
      value: isDocTable ? undefined : (newValue || '-'),
      fileSrc: newFileSrc || undefined,
      fileName: newFileName || (newFileSrc ? 'Attached Document' : '-')
    };

    const updatedList = [...(disclosures[activeTab] || [])];
    onUpdateDisclosures({
      ...disclosures,
      [activeTab]: [...updatedList, newRow]
    });

    // Reset Form
    setNewLabel('');
    setNewValue('');
    setNewFileSrc(null);
    setNewFileName('');
    window.dispatchEvent(new CustomEvent('viswam_notification', {
      detail: { 
        message: "New parameter/document successfully added to the active disclosures tab!", 
        type: 'success' 
      }
    }));
  };

  const handleDeleteRow = (tabKey, index) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this parameter/document row from the disclosures list? This cannot be undone.");
    if (!confirmDelete) return;

    const updatedList = disclosures[tabKey].filter((_, i) => i !== index);
    onUpdateDisclosures({
      ...disclosures,
      [tabKey]: updatedList
    });
  };

  const renderSimpleTable = (tabKey, title) => {
    const items = disclosures[tabKey] || [];
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '700', width: '80px' }}>SL NO.</th>
              <th style={{ padding: '16px 20px', fontWeight: '700', width: '400px' }}>INFORMATION / PARAMETER</th>
              <th style={{ padding: '16px 20px', fontWeight: '700' }}>DETAILS / ATTACHMENTS</th>
              {isEditMode && <th style={{ padding: '16px 20px', fontWeight: '700', width: '100px', textAlign: 'center' }}>ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-light)' }}>{index + 1}</td>
                <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-dark)' }}>{item.label}</td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`} style={{ display: 'inline-block' }}>
                      <span className="edit-indicator">Edit Value</span>
                      {isEditMode ? (
                        <input
                          type="text"
                          className="form-input"
                          style={{ width: '250px' }}
                          value={item.value}
                          onChange={(e) => handleTableFieldChange(tabKey, index, 'value', e.target.value)}
                        />
                      ) : (
                        <span style={{ fontWeight: '500' }}>{item.value}</span>
                      )}
                    </div>

                    {/* File Attachment logic for tables that support attachments */}
                    { (item.fileSrc !== undefined || isEditMode) && (
                      <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {item.fileSrc ? (
                            <button
                              onClick={() => handleDownload(item)}
                              className="btn btn-outline"
                              style={{
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--accent)',
                                borderColor: 'var(--accent)'
                              }}
                            >
                              <FileText size={12} />
                              <span>{item.fileName}</span>
                            </button>
                          ) : (
                            isEditMode && <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>No document uploaded</span>
                          )}

                          {isEditMode && item.fileSrc && (
                            <button
                              onClick={() => handleRemoveFile(tabKey, index)}
                              style={{ color: 'var(--error)', cursor: 'pointer', background: 'none', border: 'none' }}
                              title="Remove Document"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {isEditMode && (
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                            <div className="file-input-wrapper">
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '3px 8px', fontSize: '0.7rem', height: '26px' }}
                              >
                                <Upload size={10} />
                                <span>Attach File</span>
                              </button>
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx,image/*"
                                onChange={(e) => handleFileChange(tabKey, index, e)}
                              />
                            </div>
                            
                            {item.fileSrc && (
                              <input
                                type="text"
                                className="form-input"
                                style={{ height: '26px', padding: '2px 6px', fontSize: '0.7rem', width: '150px' }}
                                placeholder="Link Name"
                                value={item.fileName || ''}
                                onChange={(e) => handleTableFieldChange(tabKey, index, 'fileName', e.target.value)}
                              />
                            )}
                          </div>
                        )}

                        {uploadErrors[`${tabKey}-${index}`] && (
                          <div style={{ color: 'var(--error)', fontSize: '0.7rem' }}>
                            {uploadErrors[`${tabKey}-${index}`]}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                
                {/* Delete row action */}
                {isEditMode && (
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteRow(tabKey, index)}
                      style={{ border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}
                      title="Remove Row"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const isDocTable = activeTab === 'documents' || activeTab === 'academics';

  return (
    <section id="disclosures" style={{ padding: '40px 0 80px 0' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 className="section-title">CBSE Mandatory Disclosures</h2>
          <p className="section-subtitle">
            Official declarations, staff count, infrastructure logs, committees, and registration files.
          </p>
        </div>

        {/* Tabs list */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '35px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '20px',
          flexWrap: 'wrap'
        }}>
          {['general', 'documents', 'academics', 'staff', 'infrastructure', 'committees'].map((tab) => (
            <button
              key={tab}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab(tab)}
              style={{ borderRadius: 'var(--radius-sm)', padding: '8px 14px', fontSize: '0.85rem', textTransform: 'capitalize' }}
            >
              {tab === 'infrastructure' ? 'Infrastructure' : tab === 'general' ? 'General Info' : tab === 'documents' ? 'Documents & Info' : tab === 'academics' ? 'Academics & Results' : `${tab} details`}
            </button>
          ))}
        </div>

        {/* Add Entry Card Panel (Visible only in Edit Mode) */}
        {isEditMode && (
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', margin: '0 0 15px 0', fontSize: '0.95rem', fontWeight: '800' }}>
              <Plus size={16} />
              <span>Add Entry to {activeTab.toUpperCase()} Table</span>
            </h4>
            
            <form onSubmit={handleAddRowSubmit} style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              alignItems: 'end'
            }}>
              <div style={{ flexGrow: 2, minWidth: '220px' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Name / Parameter Label *</label>
                <input
                  type="text"
                  placeholder={isDocTable ? "e.g. COPY OF WATER QUALITY REPORT" : "e.g. COMPUTER LAB SIZE"}
                  className="form-input"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  required
                />
              </div>

              {!isDocTable && (
                <div style={{ flexGrow: 1, minWidth: '180px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Details / Value *</label>
                  <input
                    type="text"
                    placeholder="e.g. 100 sq meters"
                    className="form-input"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                </div>
              )}

              {/* Document upload for tables that support files */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexGrow: 1 }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>{isDocTable ? 'Attach Document' : 'Attach File (Optional)'}</label>
                  <div className="file-input-wrapper" style={{ width: '130px' }}>
                    <button type="button" className="btn btn-outline" style={{ width: '100%', height: '40px', padding: '0 8px', fontSize: '0.75rem' }}>
                      <Upload size={12} style={{ marginRight: '4px' }} />
                      <span>{newFileName ? 'Replace' : 'Upload File'}</span>
                    </button>
                    <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleNewRowFile} />
                  </div>
                </div>
                {newFileName && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: '600', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {newFileName}
                  </span>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ height: '40px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} />
                <span>Add Row</span>
              </button>
            </form>
          </div>
        )}

        {/* Table A: General Info */}
        {activeTab === 'general' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '80px' }}>SL NO.</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '350px' }}>INFORMATION</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700' }}>DETAILS</th>
                  {isEditMode && <th style={{ padding: '16px 20px', fontWeight: '700', width: '100px', textAlign: 'center' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {disclosures.general.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-light)' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-dark)' }}>{item.label}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div className={`editable-container ${isEditMode ? 'edit-active' : ''}`}>
                        <span className="edit-indicator">Edit Field</span>
                        {isEditMode ? (
                          item.label.includes('ADDRESS') ? (
                            <textarea
                              className="form-input"
                              style={{ width: '100%', fontFamily: 'inherit' }}
                              rows={3}
                              value={item.value}
                              onChange={(e) => handleGeneralChange(index, e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              className="form-input"
                              style={{ width: '100%' }}
                              value={item.value}
                              onChange={(e) => handleGeneralChange(index, e.target.value)}
                            />
                          )
                        ) : (
                          <span style={{ fontWeight: '500', whiteSpace: 'pre-line' }}>{item.value}</span>
                        )}
                      </div>
                    </td>
                    {isEditMode && (
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteRow('general', index)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}
                          title="Remove Row"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table B: Documents & Info */}
        {activeTab === 'documents' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '80px' }}>SL NO.</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '550px' }}>DOCUMENTS / INFORMATION</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700' }}>UPLOAD / DOWNLOAD</th>
                  {isEditMode && <th style={{ padding: '16px 20px', fontWeight: '700', width: '100px', textAlign: 'center' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {disclosures.documents.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-light)' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: 'var(--text-dark)', fontSize: '0.92rem' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {item.fileSrc ? (
                            <button
                              onClick={() => handleDownload(item)}
                              className="btn btn-outline"
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--accent)',
                                borderColor: 'var(--accent)'
                              }}
                            >
                              <FileText size={14} />
                              <span>{item.fileName}</span>
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>N/A</span>
                          )}

                          {isEditMode && item.fileSrc && (
                            <button
                              onClick={() => handleRemoveFile('documents', index)}
                              style={{ color: 'var(--error)', cursor: 'pointer', background: 'none', border: 'none' }}
                              title="Remove Document"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {isEditMode && (
                          <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <div className="file-input-wrapper">
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', height: '30px' }}
                                >
                                  <Upload size={12} />
                                  <span>Choose Document</span>
                                </button>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,image/*"
                                  onChange={(e) => handleFileChange('documents', index, e)}
                                />
                              </div>
                              
                              {item.fileSrc && (
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ height: '30px', padding: '4px 8px', fontSize: '0.75rem', width: '180px' }}
                                  value={item.fileName}
                                  onChange={(e) => handleLinkNameChange('documents', index, e.target.value)}
                                />
                              )}
                            </div>
                            
                            {uploadErrors[`documents-${index}`] && (
                              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px' }}>
                                {uploadErrors[`documents-${index}`]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {isEditMode && (
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteRow('documents', index)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}
                          title="Remove Row"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '20px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-light)' }}>
              <strong>NOTE:</strong> THE SCHOOLS NEED TO UPLOAD THE SELF-ATTESTED COPIES OF THE ABOVE LISTED DOCUMENTS BY CHAIRMAN/ MANAGER/ SECRETARY AND PRINCIPAL. IN CASE, IT IS NOTICED AT LATER STAGE THAT UPLOADED DOCUMENTS ARE NOT GENUINE THEN SCHOOL SHALL BE LIABLE FOR ACTION AS PER NORMS.
            </div>
          </div>
        )}

        {/* Table C: Academics & Results */}
        {activeTab === 'academics' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '80px' }}>SL NO.</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700', width: '550px' }}>DOCUMENTS / INFORMATION</th>
                  <th style={{ padding: '16px 20px', fontWeight: '700' }}>UPLOAD / DOWNLOAD</th>
                  {isEditMode && <th style={{ padding: '16px 20px', fontWeight: '700', width: '100px', textAlign: 'center' }}>ACTIONS</th>}
                </tr>
              </thead>
              <tbody>
                {disclosures.academics.map((item, index) => (
                  <tr key={item.id || index} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px 20px', fontWeight: '600', color: 'var(--text-light)' }}>{index + 1}</td>
                    <td style={{ padding: '16px 20px', fontWeight: '500', color: 'var(--text-dark)', fontSize: '0.92rem' }}>{item.name}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {item.fileSrc ? (
                            <button
                              onClick={() => handleDownload(item)}
                              className="btn btn-outline"
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--accent)',
                                borderColor: 'var(--accent)'
                              }}
                            >
                              <FileText size={14} />
                              <span>{item.fileName}</span>
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>N/A</span>
                          )}

                          {isEditMode && item.fileSrc && (
                            <button
                              onClick={() => handleRemoveFile('academics', index)}
                              style={{ color: 'var(--error)', cursor: 'pointer', background: 'none', border: 'none' }}
                              title="Remove Document"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>

                        {isEditMode && (
                          <div style={{ marginTop: '5px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                              <div className="file-input-wrapper">
                                <button
                                  className="btn btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', height: '30px' }}
                                >
                                  <Upload size={12} />
                                  <span>Choose Document</span>
                                </button>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,image/*"
                                  onChange={(e) => handleFileChange('academics', index, e)}
                                />
                              </div>
                              
                              {item.fileSrc && (
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ height: '30px', padding: '4px 8px', fontSize: '0.75rem', width: '180px' }}
                                  value={item.fileName}
                                  onChange={(e) => handleLinkNameChange('academics', index, e.target.value)}
                                />
                              )}
                            </div>
                            
                            {uploadErrors[`academics-${index}`] && (
                              <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '4px' }}>
                                {uploadErrors[`academics-${index}`]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    {isEditMode && (
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteRow('academics', index)}
                          style={{ border: 'none', background: 'transparent', color: 'var(--error)', cursor: 'pointer' }}
                          title="Remove Row"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table D: Staff Details */}
        {activeTab === 'staff' && renderSimpleTable('staff', 'Staff Details (Teaching)')}

        {/* Table E: School Infrastructure */}
        {activeTab === 'infrastructure' && renderSimpleTable('infrastructure', 'School Infrastructure')}

        {/* Table F: Committees */}
        {activeTab === 'committees' && renderSimpleTable('committees', 'School Committees')}

      </div>
    </section>
  );
}
