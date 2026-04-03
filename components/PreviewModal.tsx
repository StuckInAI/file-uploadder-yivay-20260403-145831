'use client';

import React, { useEffect, useState } from 'react';
import { UploadedFile } from './FileUploader';

interface PreviewModalProps {
  uploadedFile: UploadedFile;
  onClose: () => void;
  onDownload: (file: UploadedFile) => void;
}

export default function PreviewModal({ uploadedFile, onClose, onDownload }: PreviewModalProps) {
  const { file, url } = uploadedFile;
  const [textContent, setTextContent] = useState<string | null>(null);

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  const isText = file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.csv');
  const isPdf = file.type === 'application/pdf';

  useEffect(() => {
    if (isText) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  }, [file, isText]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const renderPreview = () => {
    if (isImage) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={file.name} />
      );
    }
    if (isVideo) {
      return (
        <video controls src={url}>
          Your browser does not support the video tag.
        </video>
      );
    }
    if (isAudio) {
      return <audio controls src={url} />;
    }
    if (isPdf) {
      return (
        <iframe
          src={url}
          title={file.name}
          style={{ width: '100%', height: '60vh', border: 'none', borderRadius: '8px' }}
        />
      );
    }
    if (isText) {
      return (
        <div className="text-preview">
          {textContent ?? 'Loading...'}
        </div>
      );
    }
    return (
      <div style={{ textAlign: 'center', color: '#a0aec0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
        <p>Preview not available for this file type.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Download the file to view it.</p>
      </div>
    );
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview of ${file.name}`}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h3 title={file.name}>{file.name}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close preview">
            ✕
          </button>
        </div>
        <div className="modal-body">{renderPreview()}</div>
        <div className="modal-footer">
          <button
            className="btn btn-download"
            style={{ flex: 'none', padding: '0.55rem 1.5rem' }}
            onClick={() => onDownload(uploadedFile)}
          >
            ⬇️ Download
          </button>
          <button
            className="btn btn-delete"
            style={{ flex: 'none', padding: '0.55rem 1.5rem' }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
