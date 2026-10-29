'use client';

import React from 'react';
import { Database, HardDrive, FileText, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { LocalDocument } from '@/types/document';

interface StorageMetricsWidgetProps {
  documents: LocalDocument[];
}

export const StorageMetricsWidget: React.FC<StorageMetricsWidgetProps> = ({ documents }) => {
  const totalFiles = documents.length;
  const totalBytes = documents.reduce((acc, doc) => acc + (doc.fileSize || 0), 0);
  const maxStorageBytes = 10 * 1024 * 1024 * 1024; // 10 GB Tier

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = Math.min(100, Math.max(0.4, (totalBytes / maxStorageBytes) * 100));

  // Category diversity
  const uniqueCategories = new Set(documents.map((d) => d.category)).size;
  const offlineCachedCount = documents.filter((d) => !!d.blobData).length;

  return (
    <div className="glass-panel relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-2xl">
      {/* Ambient background glow orb */}
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{ background: 'var(--accent-glow)' }}
      />

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                boxShadow: '0 4px 18px var(--accent-glow)',
              }}
            >
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                Vault Telemetry
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-grotesk)',
                  fontSize: '0.62rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginTop: '0.15rem',
                }}
              >
                Zero-Knowledge Storage
              </p>
            </div>
          </div>

          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: '0.65rem',
              fontWeight: 600,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              color: '#34d399',
            }}
          >
            <Sparkles className="h-3 w-3" />
            10 GB Secure Tier
          </span>
        </div>

        {/* Storage Bar Meter */}
        <div className="mt-5 rounded-2xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--glass-border)' }}>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-grotesk)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {formatSize(totalBytes)}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                  fontWeight: 400,
                }}
              >
                used of 10.00 GB
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-grotesk)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-color)',
              }}
            >
              {usagePercent < 0.1 ? '< 0.1%' : `${usagePercent.toFixed(1)}%`}
            </span>
          </div>

          {/* Progress track */}
          <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5 p-0.5">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.max(2, usagePercent)}%`,
                background: 'linear-gradient(90deg, var(--accent-color), #38bdf8, #ec4899)',
                boxShadow: '0 0 14px var(--accent-glow)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 4 Micro-Stat Jewels */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {/* Total Docs */}
        <div className="glass-card rounded-2xl p-3">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-grotesk)' }}>
            <FileText className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
            <span>Documents</span>
          </div>
          <p
            className="mt-1"
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {totalFiles}
          </p>
        </div>

        {/* Offline Cached */}
        <div className="glass-card rounded-2xl p-3">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-grotesk)' }}>
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span>Encrypted Cache</span>
          </div>
          <p
            className="mt-1"
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {offlineCachedCount}
          </p>
        </div>

        {/* Unique Categories */}
        <div className="glass-card rounded-2xl p-3">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-grotesk)' }}>
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>Categories</span>
          </div>
          <p
            className="mt-1"
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            {uniqueCategories}
          </p>
        </div>

        {/* Security Health */}
        <div className="glass-card rounded-2xl p-3">
          <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-grotesk)' }}>
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            <span>Encryption</span>
          </div>
          <p
            className="mt-1"
            style={{
              fontFamily: 'var(--font-grotesk)',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#38bdf8',
              lineHeight: 1.5,
            }}
          >
            AES-256
          </p>
        </div>
      </div>
    </div>
  );
};
