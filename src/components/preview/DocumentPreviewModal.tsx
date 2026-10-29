'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Trash2, 
  Calendar, 
  HardDrive, 
  Tag as TagIcon, 
  FileText, 
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { LocalDocument } from '@/types/document';

interface DocumentPreviewModalProps {
  document: LocalDocument | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onDelete,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [textContent, setTextContent] = useState<string | null>(null);

  useEffect(() => {
    if (!document) {
      setObjectUrl(null);
      setTextContent(null);
      return;
    }

    setZoomLevel(1);

    if (document.blobData) {
      const url = URL.createObjectURL(document.blobData);
      setObjectUrl(url);

      // If text/json/markdown file, read content
      if (
        document.mimeType.startsWith('text/') ||
        document.mimeType.includes('json') ||
        document.mimeType.includes('javascript') ||
        document.mimeType.includes('markdown')
      ) {
        document.blobData.text().then((txt) => setTextContent(txt));
      } else {
        setTextContent(null);
      }

      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (document.remoteUrl) {
      setObjectUrl(document.remoteUrl);
    }
  }, [document]);

  if (!document) return null;

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = () => {
    if (!objectUrl) return;
    const a = window.document.createElement('a');
    a.href = objectUrl;
    a.download = document.originalName || `${document.title}.${document.mimeType.split('/')[1] || 'bin'}`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
  };

  const handleDeleteAndClose = () => {
    onDelete(document.id);
    onClose();
  };

  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl p-4 sm:p-6">
      <div className="relative flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] glass-panel shadow-2xl">
        {/* Top Header bar */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] bg-black/30 px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-md font-bold text-xs uppercase"
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                fontFamily: 'var(--font-grotesk)',
              }}
            >
              {document.mimeType.split('/')[1] || 'doc'}
            </div>
            <div>
              <h2
                className="line-clamp-1"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                }}
              >
                {document.title}
              </h2>
              <div
                className="flex items-center gap-2 text-xs mt-0.5"
                style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
              >
                <span>{document.originalName}</span>
                <span className="opacity-40">•</span>
                <span>{formatSize(document.fileSize)}</span>
                <span className="opacity-40">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Encrypted Verified
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {isImage && (
              <div
                className="hidden sm:flex items-center rounded-xl p-0.5 text-xs"
                style={{
                  background: 'var(--glass-pill-bg)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)',
                }}
              >
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="p-1.5 hover:text-[var(--text-primary)] transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 font-mono font-bold" style={{ fontFamily: 'var(--font-grotesk)' }}>
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                  className="p-1.5 hover:text-[var(--text-primary)] transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleDownload}
              className="glass-button-primary inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all cursor-pointer"
              style={{ fontFamily: 'var(--font-grotesk)' }}
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={handleDeleteAndClose}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/25 transition cursor-pointer"
              title="Delete Document"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Viewer Viewport */}
        <div className="flex-1 overflow-auto bg-black/20 p-4 sm:p-6 flex items-center justify-center">
          {isImage && objectUrl ? (
            <div className="flex items-center justify-center overflow-auto max-h-full max-w-full">
              <img
                src={objectUrl}
                alt={document.title}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-2xl transition-transform duration-200 border border-white/10"
              />
            </div>
          ) : isPdf && objectUrl ? (
            <iframe
              src={objectUrl}
              title={document.title}
              className="h-full w-full rounded-2xl border border-[var(--glass-border)] bg-white shadow-2xl"
            />
          ) : textContent !== null ? (
            <div
              className="h-full w-full overflow-auto rounded-2xl border border-[var(--glass-border)] p-6 text-xs leading-relaxed"
              style={{
                background: 'rgba(5, 7, 13, 0.75)',
                fontFamily: 'var(--font-grotesk)',
                color: 'var(--text-primary)',
              }}
            >
              <pre className="whitespace-pre-wrap">{textContent}</pre>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl mb-4"
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  color: 'var(--accent-color)',
                }}
              >
                <FileText className="h-10 w-10 stroke-[1.4]" />
              </div>
              <h4
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                }}
              >
                Binary Document Stored in Vault
              </h4>
              <p
                className="mt-2 text-xs max-w-md"
                style={{ fontFamily: 'var(--font-inter)', color: 'var(--text-muted)', lineHeight: 1.6 }}
              >
                This document is securely preserved in your private IndexedDB partition. Download the decrypted payload to open it in your local environment.
              </p>
              <button
                onClick={handleDownload}
                className="glass-button-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer shadow-lg"
                style={{ fontFamily: 'var(--font-grotesk)' }}
              >
                <Download className="h-4 w-4" />
                <span>Download {document.originalName}</span>
              </button>
            </div>
          )}
        </div>

        {/* Cryptographic Metadata Footer */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--glass-border)] bg-black/25 px-6 py-3.5 text-xs"
          style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
              <span>Deposited {new Date(document.createdAt).toLocaleString()}</span>
            </span>

            <span className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-emerald-400" />
              <span>Category: {document.category}</span>
            </span>
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
              {document.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
