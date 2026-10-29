'use client';

import React, { useState, useEffect } from 'react';
import { FileText, FileCode, Image as ImageIcon, File } from 'lucide-react';
import { LocalDocument } from '@/types/document';

interface DocumentLiveThumbnailProps {
  document: LocalDocument;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DocumentLiveThumbnail: React.FC<DocumentLiveThumbnailProps> = ({
  document,
  className = '',
  size = 'md',
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [textSnippet, setTextSnippet] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    let isMounted = true;

    if (document.blobData) {
      url = URL.createObjectURL(document.blobData);
      setObjectUrl(url);

      // If text/json, read a snippet for inline preview
      if (
        document.mimeType.startsWith('text/') ||
        document.mimeType.includes('json') ||
        document.mimeType.includes('javascript') ||
        document.mimeType.includes('markdown')
      ) {
        document.blobData.slice(0, 500).text().then((txt) => {
          if (isMounted) setTextSnippet(txt);
        });
      }
    } else if (document.thumbnailUrl) {
      setObjectUrl(document.thumbnailUrl);
    } else if (document.remoteUrl) {
      setObjectUrl(document.remoteUrl);
    }

    return () => {
      isMounted = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [document.blobData, document.thumbnailUrl, document.remoteUrl, document.mimeType]);

  const isImage = document.mimeType.startsWith('image/');
  const isPdf = document.mimeType === 'application/pdf';
  const isText =
    document.mimeType.startsWith('text/') ||
    document.mimeType.includes('json') ||
    document.mimeType.includes('javascript');

  // Size styling presets
  const sizeClasses = {
    sm: 'h-14 w-16 rounded-xl',
    md: 'h-36 w-full rounded-2xl',
    lg: 'h-48 w-full rounded-2xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-[var(--border-color)] bg-[var(--bg-primary)]/90 shadow-inner transition-all duration-300 ${sizeClasses[size]} ${className}`}
    >
      {/* 1. Live Image Preview */}
      {isImage && objectUrl ? (
        <img
          src={objectUrl}
          alt={document.title}
          className="h-full w-full object-cover"
        />
      ) : isPdf ? (
        /* 2. Live PDF Document Preview Sheet */
        <div className={`relative h-full w-full flex flex-col ${size === 'sm' ? 'p-1.5' : 'p-2.5'} bg-white text-slate-800 select-none overflow-hidden`}>
          {/* Miniature PDF Paper Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-0.5 mb-1">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              <span className="font-mono text-[8px] font-bold text-rose-600 uppercase">PDF</span>
            </div>
            {size !== 'sm' && <span className="text-[8px] text-slate-400 font-mono">Page 1</span>}
          </div>

          {/* If live blob exists and size is md/lg, render interactive iframe snapshot */}
          {objectUrl && size !== 'sm' ? (
            <iframe
              src={`${objectUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
              title="Mini PDF Preview"
              className="pointer-events-none h-full w-full border-0 rounded scale-[1.0] opacity-90"
            />
          ) : (
            /* Styled Live Paper Sheet Preview */
            <div className={`space-y-1 ${size === 'sm' ? 'pt-0.5' : 'pt-1'}`}>
              <div className="h-1.5 w-3/4 rounded bg-slate-300" />
              <div className="h-1.5 w-full rounded bg-slate-200" />
              <div className="h-1.5 w-5/6 rounded bg-slate-200" />
              {size !== 'sm' && <div className="h-1.5 w-4/6 rounded bg-slate-200" />}
              <div className="mt-1 flex items-center gap-1 pt-0.5 border-t border-slate-100">
                <span className="text-[7.5px] font-semibold text-slate-600 truncate">
                  {document.title}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : isText && textSnippet ? (
        /* 3. Live Text / Code Snippet Preview */
        <div className={`h-full w-full ${size === 'sm' ? 'p-1.5 text-[8px]' : 'p-2.5 text-[9px]'} bg-slate-950 text-emerald-400 font-mono leading-tight overflow-hidden select-none`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-0.5 mb-1 text-slate-500 text-[7.5px]">
            <span className="truncate max-w-[70%]">{document.originalName}</span>
            <span>TXT</span>
          </div>
          <pre className="whitespace-pre-wrap opacity-80 overflow-hidden line-clamp-3">
            {textSnippet}
          </pre>
        </div>
      ) : (
        /* 4. Styled Live Document Sheet Preview */
        <div className={`relative h-full w-full flex flex-col ${size === 'sm' ? 'p-1.5' : 'p-2.5'} bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 select-none`}>
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-0.5 mb-1">
            <span className="font-mono text-[8px] font-bold text-[var(--accent-color)] uppercase truncate max-w-[65%]">
              {document.category}
            </span>
            <span className="text-[7.5px] text-[var(--text-muted)] font-mono">
              {(document.fileSize / 1024).toFixed(0)} KB
            </span>
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="h-1.5 w-2/3 rounded bg-[var(--accent-color)]/25" />
            <div className="h-1.5 w-full rounded bg-[var(--text-muted)]/20" />
            <div className="h-1.5 w-4/5 rounded bg-[var(--text-muted)]/20" />
          </div>
          <p className="mt-auto text-[8px] font-medium text-[var(--text-primary)] truncate">
            {document.title}
          </p>
        </div>
      )}
    </div>
  );
};
