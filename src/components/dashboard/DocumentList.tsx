'use client';

import React from 'react';
import { 
  Eye, 
  Download, 
  Trash2, 
  Tag as TagIcon 
} from 'lucide-react';
import { LocalDocument } from '@/types/document';
import { DocumentLiveThumbnail } from '../preview/DocumentLiveThumbnail';

interface DocumentListProps {
  documents: LocalDocument[];
  onPreview: (doc: LocalDocument) => void;
  onDelete: (id: string) => void;
  onDownload: (doc: LocalDocument) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onPreview,
  onDelete,
  onDownload,
}) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="overflow-x-auto rounded-3xl glass-panel shadow-2xl">
      <table className="w-full text-left text-sm">
        <thead
          className="border-b border-[var(--glass-border)] bg-black/25 text-xs uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
        >
          <tr>
            <th className="py-4 pl-6 pr-4 font-semibold">Live Preview &amp; Document</th>
            <th className="px-4 py-4 font-semibold">Category</th>
            <th className="px-4 py-4 font-semibold">File Size</th>
            <th className="px-4 py-4 font-semibold">Archived Date</th>
            <th className="px-4 py-4 font-semibold">Sync Status</th>
            <th className="py-4 pl-4 pr-6 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--glass-border)]">
          {documents.map((doc) => (
            <tr
              key={doc.id}
              className="group hover:bg-white/5 transition-colors duration-200"
            >
              {/* Document + Live Visual Preview Column */}
              <td className="py-3.5 pl-6 pr-4">
                <div className="flex items-center gap-4">
                  {/* Live Visual Preview Frame */}
                  <div
                    onClick={() => onPreview(doc)}
                    className="relative shrink-0 cursor-pointer overflow-hidden rounded-xl group-hover:scale-105 transition-transform shadow-md"
                    title="Click to view full preview"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <DocumentLiveThumbnail
                      document={doc}
                      size="sm"
                      className="w-16 h-14"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                      <Eye className="h-4 w-4 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* Title & metadata with editorial styling */}
                  <div>
                    <h5
                      onClick={() => onPreview(doc)}
                      className="cursor-pointer line-clamp-1 hover:text-[var(--accent-color)] transition-colors"
                      title={doc.title}
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        fontStyle: 'italic',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {doc.title}
                    </h5>
                    <p
                      className="text-xs truncate max-w-xs mt-0.5"
                      style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
                    >
                      {doc.originalName}
                    </p>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="glass-pill inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[10px]"
                            style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
                          >
                            <TagIcon className="h-2 w-2 opacity-60" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              <td className="px-4 py-3.5">
                <span
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{
                    fontFamily: 'var(--font-grotesk)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {doc.category}
                </span>
              </td>

              <td className="px-4 py-3.5 text-xs" style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}>
                {formatSize(doc.fileSize)}
              </td>

              <td className="px-4 py-3.5 text-xs" style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}>
                {new Date(doc.createdAt).toLocaleDateString([], {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>

              <td className="px-4 py-3.5">
                {doc.syncStatus === 'synced' ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: '#34d399', fontFamily: 'var(--font-grotesk)' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Cloud Synced
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold"
                    style={{ color: '#fbbf24', fontFamily: 'var(--font-grotesk)' }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    Encrypted Local
                  </span>
                )}
              </td>

              <td className="py-3.5 pl-4 pr-6 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onPreview(doc)}
                    className="rounded-xl p-2 transition cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--accent-color)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                    title="View Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDownload(doc)}
                    className="rounded-xl p-2 transition cursor-pointer"
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
                    onClick={() => onDelete(doc.id)}
                    className="rounded-xl p-2 transition cursor-pointer"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
