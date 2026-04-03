'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import FileCard from './FileCard';
import PreviewModal from './PreviewModal';
import Toast from './Toast';

export interface UploadedFile {
  id: string;
  file: File;
  url: string;
  uploadedAt: Date;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function FileUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const arr = Array.from(newFiles);
      const uploaded: UploadedFile[] = arr.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
        uploadedAt: new Date(),
      }));
      setFiles((prev) => [...prev, ...uploaded]);
      showToast(`✅ ${arr.length} file${arr.length > 1 ? 's' : ''} added successfully!`);
    },
    [showToast]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDelete = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((f) => f.id !== id);
    });
    showToast('🗑️ File removed.');
  };

  const handleDownload = (uploadedFile: UploadedFile) => {
    const a = document.createElement('a');
    a.href = uploadedFile.url;
    a.download = uploadedFile.file.name;
    a.click();
    showToast(`⬇️ Downloading ${uploadedFile.file.name}`);
  };

  const totalSize = files.reduce((acc, f) => acc + f.file.size, 0);

  return (
    <>
      <div
        className={`dropzone${dragging ? ' dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="File upload area"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          onClick={(e) => e.stopPropagation()}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <span className="dropzone-icon">☁️</span>
        <h2>Drag & Drop files here</h2>
        <p>
          or <span className="browse-link">browse</span> to choose files
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Any file type supported</p>
      </div>

      {files.length > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <div className="stat-value">{files.length}</div>
            <div className="stat-label">Files Uploaded</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatBytes(totalSize)}</div>
            <div className="stat-label">Total Size</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(files.map((f) => f.file.type.split('/')[0])).size}
            </div>
            <div className="stat-label">File Types</div>
          </div>
        </div>
      )}

      <div className="files-section">
        {files.length > 0 && (
          <h2>
            📂 Uploaded Files
            <span
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                borderRadius: '20px',
                padding: '0.1rem 0.7rem',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {files.length}
            </span>
          </h2>
        )}
        {files.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>No files uploaded yet. Drop some files above!</p>
          </div>
        ) : (
          <div className="files-grid">
            {files.map((f) => (
              <FileCard
                key={f.id}
                uploadedFile={f}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onPreview={() => setPreviewFile(f)}
              />
            ))}
          </div>
        )}
      </div>

      {previewFile && (
        <PreviewModal
          uploadedFile={previewFile}
          onClose={() => setPreviewFile(null)}
          onDownload={handleDownload}
        />
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
