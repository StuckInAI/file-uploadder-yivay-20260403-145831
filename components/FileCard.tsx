'use client';

import React from 'react';
import { UploadedFile } from './FileUploader';

interface FileCardProps {
  uploadedFile: UploadedFile;
  onDelete: (id: string) => void;
  onDownload: (file: UploadedFile) => void;
  onPreview: () => void;
}

function getFileIcon(type: string): string {
  if (type.startsWith('image/')) return '🖼️';
  if (type.startsWith('video/')) return '🎬';
  if (type.startsWith('audio/')) return '🎵';
  if (type === 'application/pdf') return '📄';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return '📊';
  if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar')) return '📦';
  if (type.startsWith('text/')) return '📃';
  return '📁';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function FileCard({ uploadedFile, onDelete, onDownload, onPreview }: FileCardProps) {
  const { file, url } = uploadedFile;
  const isImage = file.type.startsWith('image/');

  return (
    <div className="file-card">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={file.name} className="file-preview" />
      ) : (
        <div className="file-preview-placeholder">
          <span>{getFileIcon(file.type)}</span>
        </div>
      )}
      <div className="file-info">
        <div className="file-name" title={file.name}>
          {file.name}
        </div>
        <div className="file-meta">
          {formatBytes(file.size)} &bull; {formatDate(uploadedFile.uploadedAt)}
        </div>
        <div className="file-meta" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {file.type || 'Unknown type'}
        </div>
      </div>
      <div className="file-actions">
        <button className="btn btn-preview" onClick={onPreview} title="Preview">
          👁️ Preview
        </button>
        <button className="btn btn-download" onClick={() => onDownload(uploadedFile)} title="Download">
          ⬇️
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(uploadedFile.id)} title="Delete">
          🗑️
        </button>
      </div>
    </div>
  );
}
