import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const UploadPage = () => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult]       = useState(null);
  const [error, setError]         = useState(null);
  const [dragOver, setDragOver]   = useState(false);

  const upload = async (file) => {
    if (!file) return;
    setUploading(true); setResult(null); setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Check the file format.');
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e) => { upload(e.target.files[0]); e.target.value = null; };
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]); };

  return (
    <div className="fade-in">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
          Upload an Excel or CSV file. Columns required: <code>department</code>, <code>status</code>,
          <code>createdAt</code>, <code>resolvedAt</code>.
        </p>

        {/* Drop zone */}
        <div
          className="glass-card"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          style={{
            border: `2px dashed ${dragOver ? 'var(--accent-color)' : 'var(--card-border)'}`,
            background: dragOver ? 'var(--accent-soft)' : 'var(--card-bg)',
            textAlign: 'center', padding: '3rem 2rem', transition: 'all 0.2s', cursor: 'pointer',
            position: 'relative'
          }}
        >
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={onInputChange}
            disabled={uploading}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
          />
          <FileSpreadsheet size={40} color="var(--accent-color)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {uploading ? 'Uploading…' : 'Drop file here or click to browse'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Supports .xlsx, .xls, .csv
          </p>
        </div>

        {/* Feedback */}
        {error && (
          <div className="glass-card" style={{ marginTop: '1rem', background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.35)', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#fca5a5' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}
        {result && (
          <div className="glass-card" style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.1)', borderColor: 'rgba(16,185,129,0.35)', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#34d399' }}>
            <CheckCircle2 size={18} />
            <span>{result.message} — {result.insertedCount} records inserted.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
