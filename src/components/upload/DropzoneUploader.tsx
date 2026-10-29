'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import { 
  UploadCloud, 
  FileUp, 
  X, 
  Check, 
  Tag as TagIcon, 
  Layers, 
  FileText, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  FileCheck2
} from 'lucide-react';
import { DocumentCategory, LocalDocument } from '@/types/document';
import { syncEngine } from '@/lib/sync/syncEngine';

interface DropzoneUploaderProps {
  userId?: string;
  onUploadSuccess?: () => void;
}

const CATEGORIES: DocumentCategory[] = [
  'General',
  'Invoices',
  'Certificates',
  'Contracts',
  'Personal',
  'Financial',
  'Tax',
];

export const DropzoneUploader: React.FC<DropzoneUploaderProps> = ({ userId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('General');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setSelectedFile(file);

    // Default title without extension
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setCustomTitle(baseName);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setTags([]);
    setIsModalOpen(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: false,
    noKeyboard: false,
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSaveDocument = async () => {
    if (!selectedFile) return;
    setIsSaving(true);

    try {
      const docId = uuidv4();
      const newDoc: LocalDocument = {
        id: docId,
        userId: userId || 'default_user',
        title: customTitle.trim() || selectedFile.name,
        originalName: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size,
        blobData: selectedFile,
        thumbnailUrl: selectedFile.type.startsWith('image/') ? previewUrl || undefined : undefined,
        category,
        tags: tags.length > 0 ? tags : [category.toLowerCase()],
        syncStatus: 'pending_upload',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await syncEngine.saveDocument(newDoc);

      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Prominent Editorial Dropzone Card */}
      <div
        {...getRootProps()}
        className={`group relative flex flex-col items-center justify-center rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragActive
            ? 'scale-[1.01] border-2 border-[var(--accent-color)] bg-[var(--accent-glow)]'
            : 'glass-card border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
        }`}
        style={{ minHeight: '280px' }}
      >
        {/* Subtle interior glow */}
        <div
          className="pointer-events-none absolute -top-16 -left-16 h-40 w-40 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40"
          style={{ background: 'var(--accent-glow)' }}
        />

        <input {...getInputProps()} />

        {/* Floating Icon Jewels */}
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl transition-all duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
            boxShadow: '0 8px 26px var(--accent-glow)',
          }}
        >
          <UploadCloud className="h-8 w-8 stroke-[1.8]" />
        </div>

        <h3
          className="mt-5"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.35rem',
            fontWeight: 600,
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}
        >
          {isDragActive ? 'Release to Deposit File' : 'Deposit Documents into Vault'}
        </h3>
        <p
          className="mt-2 max-w-xs"
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            fontWeight: 300,
          }}
        >
          Drag &amp; drop your PDF, high-res images, spreadsheets, or notes. Encrypted client-side instantly.
        </p>

        {/* Accepted Formats Badges */}
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {['PDF', 'PNG / JPG', 'SPREADSHEET', 'TEXT'].map((fmt) => (
            <span
              key={fmt}
              className="rounded-md px-2 py-0.5"
              style={{
                fontFamily: 'var(--font-grotesk)',
                fontSize: '0.58rem',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-muted)',
              }}
            >
              {fmt}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            open();
          }}
          className="glass-button-primary mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold cursor-pointer shadow-lg"
          style={{ fontFamily: 'var(--font-grotesk)' }}
        >
          <FileUp className="h-3.5 w-3.5" />
          <span>Select Files to Encrypt</span>
        </button>
      </div>

      {/* Upload & Naming Modal */}
      {isModalOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6">
          <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[32px] glass-panel shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--glass-border)] bg-black/20 px-6 py-4.5">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow"
                  style={{ background: 'var(--accent-color)' }}
                >
                  <FileCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      fontStyle: 'italic',
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                    }}
                  >
                    Catalog New Document
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-grotesk)',
                      fontSize: '0.62rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}
                  >
                    AES-256 Storage Preparation
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-2 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-primary)] transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
              {/* Instant Live Preview Frame */}
              <div className="flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl bg-black/30 border border-[var(--glass-border)] shadow-inner">
                {selectedFile.type.startsWith('image/') && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Instant Preview"
                    className="h-full w-full object-contain p-2"
                  />
                ) : selectedFile.type === 'application/pdf' && previewUrl ? (
                  <iframe
                    src={previewUrl}
                    title="PDF Preview"
                    className="h-full w-full pointer-events-none border-0"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <FileText className="h-14 w-14 text-[var(--accent-color)] stroke-[1.5]" />
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-playfair)' }}>
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]" style={{ fontFamily: 'var(--font-grotesk)' }}>
                      {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || 'Document'}
                    </p>
                  </div>
                )}
              </div>

              {/* Form Controls */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold"
                    style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
                  >
                    Document Title (Editable)
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter document title..."
                    className="glass-input mt-1.5 w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="block text-xs font-semibold"
                      style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
                    >
                      Archive Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                      className="glass-input mt-1.5 w-full rounded-xl px-3 py-3 text-sm outline-none cursor-pointer"
                      style={{ fontFamily: 'var(--font-inter)' }}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-900 text-white">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold"
                      style={{ fontFamily: 'var(--font-grotesk)', color: 'var(--text-muted)' }}
                    >
                      Add Tags (Press Enter)
                    </label>
                    <div className="relative mt-1.5">
                      <TagIcon className="absolute left-3.5 top-3.5 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        placeholder="e.g. Q4, Tax2026..."
                        className="glass-input w-full rounded-xl py-3 pl-10 pr-3 text-sm outline-none"
                        style={{ fontFamily: 'var(--font-inter)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tag Pills */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="glass-pill inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-[var(--text-primary)]"
                        style={{ fontFamily: 'var(--font-grotesk)' }}
                      >
                        #{t}
                        <button
                          type="button"
                          onClick={() => removeTag(t)}
                          className="hover:text-rose-400 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[var(--glass-border)] bg-black/20 px-6 py-4">
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Encrypted IndexedDB
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-[var(--text-muted)] hover:bg-white/10 hover:text-white transition cursor-pointer"
                  style={{ fontFamily: 'var(--font-grotesk)' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveDocument}
                  className="glass-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-xl transition-all cursor-pointer"
                  style={{ fontFamily: 'var(--font-grotesk)' }}
                >
                  {isSaving ? (
                    <span>Encrypting &amp; Storing...</span>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Encrypt &amp; Save to Vault</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
