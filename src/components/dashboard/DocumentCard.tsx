'use client';

import React from 'react';
import { Eye, Download, Trash2, Tag, ShieldCheck, Lock } from 'lucide-react';
import { LocalDocument } from '@/types/document';
import { DocumentLiveThumbnail } from '../preview/DocumentLiveThumbnail';

interface DocumentCardProps {
  document: LocalDocument;
  onPreview: (doc: LocalDocument) => void;
  onDelete: (id: string) => void;
  onDownload: (doc: LocalDocument) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPreview,
  onDelete,
  onDownload,
}) => {
  const getFormatBadge = (mime: string) => {
    if (mime.startsWith('image/'))
      return { label: 'IMG', color: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(16,185,129,0.3)' };
    if (mime === 'application/pdf')
      return { label: 'PDF', color: 'rgba(244,63,94,0.12)', text: '#fb7185', border: 'rgba(244,63,94,0.3)' };
    if (mime.includes('text') || mime.includes('json') || mime.includes('markdown'))
      return { label: 'TXT', color: 'rgba(6,182,212,0.12)', text: '#38bdf8', border: 'rgba(6,182,212,0.3)' };
    return { label: 'DOC', color: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)' };
  };

  const badge = getFormatBadge(document.mimeType);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-card p-5 transition-all duration-300 cursor-default"
      style={{
        border: '1px solid var(--glass-border)',
      }}
    >
      {/* Top subtle colored hairline glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${badge.text}, transparent)`,
        }}
      />

      {/* Top header row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2">
            {/* Format badge */}
            <span
              className="inline-flex items-center rounded-lg px-2 py-0.5 font-mono font-bold tracking-wider"
              style={{
                fontSize: '0.62rem',
                background: badge.color,
                color: badge.text,
                border: `1px solid ${badge.border}`,
              }}
            >
              {badge.label}
            </span>
            {/* Category pill */}
            <span
              className="rounded-lg px-2.5 py-0.5 font-mono"
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-muted)',
              }}
            >
              {document.category}
            </span>
          </div>

          {/* Sync badge */}
          {document.syncStatus === 'synced' ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
              style={{
                fontSize: '0.62rem',
                color: '#34d399',
                fontFamily: 'var(--font-grotesk)',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Synced
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
              style={{
                fontSize: '0.62rem',
                color: '#fbbf24',
                fontFamily: 'var(--font-grotesk)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Encrypted Local
            </span>
          )}
        </div>

        {/* Live Visual Preview Frame */}
        <div
          onClick={() => onPreview(document)}
          className="relative cursor-pointer overflow-hidden rounded-2xl group-hover:scale-[1.015] transition-all duration-300"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <DocumentLiveThumbnail document={document} size="md" />

          {/* Glass Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
            <span
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono font-bold text-white shadow-xl"
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                fontSize: '0.72rem',
                border: '1px solid rgba(255,255,255,0.25)',
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              Expand In-App Preview
            </span>
          </div>
        </div>

        {/* Title & filename */}
        <div className="mt-4">
          <h4
            onClick={() => onPreview(document)}
            className="cursor-pointer line-clamp-1 hover:text-[var(--accent-color)] transition-colors"
            title={document.title}
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: '1.15rem',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}
          >
            {document.title}
          </h4>
          <p
            className="mt-1 truncate"
            title={document.originalName}
            style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.68rem', color: 'var(--text-muted)' }}
          >
            {document.originalName}
          </p>
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {document.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5"
                style={{
                  fontFamily: 'var(--font-grotesk)',
                  fontSize: '0.6rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--text-muted)',
                }}
              >
                <Tag className="h-2.5 w-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer row */}
      <div
        className="mt-5 pt-3.5 flex items-center justify-between"
        style={{ borderTop: '1px solid var(--glass-border)' }}
      >
        <div style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>{formatSize(document.fileSize)}</span>
          <span className="mx-1.5 opacity-40">·</span>
          <span>{new Date(document.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Action icons dock */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPreview(document)}
            className="rounded-xl p-1.5 transition cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--accent-color)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDownload(document)}
            className="rounded-xl p-1.5 transition cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#38bdf8';
              (e.currentTarget as HTMLElement).style.background = 'rgba(56,189,248,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="rounded-xl p-1.5 transition cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#f43f5e';
              (e.currentTarget as HTMLElement).style.background = 'rgba(244,63,94,0.15)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
