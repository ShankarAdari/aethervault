'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, 
  LayoutGrid, 
  List, 
  Sun, 
  Moon, 
  Sunset as SunsetIcon, 
  Sunrise, 
  ShieldCheck, 
  Clock, 
  User as UserIcon, 
  LogOut, 
  Filter,
  FileUp,
  Sparkles,
  Lock,
  FolderLock,
  Layers,
  ArrowUpRight,
  Smartphone,
  Download,
  X,
  Share2,
  CheckCircle2
} from 'lucide-react';

import { db } from '@/lib/dexie/db';
import { syncEngine } from '@/lib/sync/syncEngine';
import { LocalDocument, UserSession, DocumentCategory } from '@/types/document';
import { useAtmosphericTheme } from '@/hooks/useAtmosphericTheme';

import { InitialLoadProgress } from '@/components/animations/InitialLoadProgress';
import { WorkspaceSetupLoader } from '@/components/animations/WorkspaceSetupLoader';
import { AmbientParticleCanvas } from '@/components/animations/AmbientParticleCanvas';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { OfflineSyncBadge } from '@/components/dashboard/OfflineSyncBadge';
import { StorageMetricsWidget } from '@/components/dashboard/StorageMetricsWidget';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DropzoneUploader } from '@/components/upload/DropzoneUploader';
import { DocumentPreviewModal } from '@/components/preview/DocumentPreviewModal';

const CATEGORIES: ('All' | DocumentCategory)[] = [
  'All',
  'Invoices',
  'Certificates',
  'Contracts',
  'Personal',
  'Financial',
  'Tax',
  'General',
];

type FlowStage = 'welcome_splash' | 'auth_screen' | 'welcome_user_loading' | 'dashboard';

export default function Home() {
  const { phase, label: themeLabel, timeString, setTheme } = useAtmosphericTheme();

  // 4-Stage Workflow State Machine
  const [currentStage, setCurrentStage] = useState<FlowStage>('welcome_splash');
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);

  // Dashboard UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | DocumentCategory>('All');
  const [activePreviewDoc, setActivePreviewDoc] = useState<LocalDocument | null>(null);

  // Restore existing session if stored
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserStr = localStorage.getItem('docflow_active_user');
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          if (user && user.id) {
            setCurrentUser(user);
            setCurrentStage('dashboard');
          }
        } catch {
          // ignore corrupted session
        }
      }
    }
  }, []);

  // Stage 1 -> Stage 2: Initial Welcome (0 to 100%) Complete
  const handleInitialWelcomeComplete = useCallback(() => {
    setCurrentStage('auth_screen');
  }, []);

  // Stage 2 -> Stage 3: User submitted username and password
  const handleAuthSuccess = useCallback((user: UserSession, isNewUser: boolean) => {
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('docflow_active_user', JSON.stringify(user));
    }
    // Transition to Step 3: Welcome [Username] with 0 to 100% loading
    setCurrentStage('welcome_user_loading');
  }, []);

  // Stage 3 -> Stage 4: Secondary Loading (0 to 100%) Complete
  const handleSecondaryWelcomeComplete = useCallback(() => {
    setCurrentStage('dashboard');
  }, []);

  // Logout -> Back to Step 2
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('docflow_active_user');
    }
    setCurrentStage('auth_screen');
  }, []);

  // Live Query from Dexie IndexedDB for THIS USER ONLY
  const currentUserId = currentUser?.id || '';
  const documents = useLiveQuery<LocalDocument[]>(
    async () => {
      if (!currentUserId) return [];
      return db.documents
        .where('userId')
        .equals(currentUserId)
        .reverse()
        .sortBy('updatedAt');
    },
    [currentUserId]
  ) || [];

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        doc.title.toLowerCase().includes(q) ||
        doc.originalName.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [documents, searchQuery, selectedCategory]);

  const handleDeleteDocument = useCallback(async (id: string) => {
    await syncEngine.deleteDocument(id);
  }, []);

  const handleDownloadDocument = useCallback((doc: LocalDocument) => {
    if (doc.blobData) {
      const url = URL.createObjectURL(doc.blobData);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([`Simulated decrypted content for ${doc.title}`], { type: doc.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Background Ambient Particles */}
      <AmbientParticleCanvas />

      {/* ========================================================
          STAGE 1: 0 to 100% Loading Greeting Animation
         ======================================================== */}
      <AnimatePresence mode="wait">
        {currentStage === 'welcome_splash' && (
          <InitialLoadProgress
            key="stage-1"
            onComplete={handleInitialWelcomeComplete}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          STAGE 3: 0 to 100% Secondary Loading with Welcome [Username]
         ======================================================== */}
      <AnimatePresence mode="wait">
        {currentStage === 'welcome_user_loading' && (
          <WorkspaceSetupLoader
            key="stage-3"
            username={currentUser?.username || 'User'}
            onComplete={handleSecondaryWelcomeComplete}
          />
        )}
      </AnimatePresence>

      {/* ========================================================
          STAGE 2: Auth Screen (Login / Register)
         ======================================================== */}
      {currentStage === 'auth_screen' && (
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
          <header className="absolute top-6 right-6 flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-4 py-2"
              style={{
                background: 'var(--glass-pill-bg)',
                border: '1px solid var(--glass-border)',
                backdropFilter: 'blur(10px)',
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-grotesk)',
              }}
            >
              <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
              <span suppressHydrationWarning>{timeString || '12:00 PM'}</span>
              <span className="mx-1 opacity-40">·</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                {themeLabel}
              </span>
            </div>
            <OfflineSyncBadge />
          </header>

          <AuthScreen onSuccess={handleAuthSuccess} />
        </div>
      )}

      {/* ========================================================
          STAGE 4: Main Dashboard
         ======================================================== */}
      {currentStage === 'dashboard' && currentUser && (
        <>
          {/* In-App Document Preview Modal */}
          <DocumentPreviewModal
            document={activePreviewDoc}
            onClose={() => setActivePreviewDoc(null)}
            onDelete={handleDeleteDocument}
          />

          <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* ── Editorial Header ── */}
            <header
              className="glass-panel flex flex-col gap-4 rounded-[32px] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
              style={{ marginBottom: '2rem' }}
            >
              {/* Brand + Vault Monogram */}
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                    boxShadow: '0 6px 20px var(--accent-glow)',
                  }}
                >
                  <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.6rem',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                      }}
                    >
                      Aether
                      <span
                        style={{
                          fontFamily: 'var(--font-inter)',
                          fontStyle: 'normal',
                          fontWeight: 300,
                          fontSize: '1.4rem',
                          color: 'var(--accent-color)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Vault
                      </span>
                    </h1>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
                      style={{
                        fontFamily: 'var(--font-grotesk)',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        background: 'rgba(139, 92, 246, 0.12)',
                        border: '1px solid rgba(139, 92, 246, 0.28)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      <Lock className="h-2.5 w-2.5" />
                      {currentUser.vaultName || `${currentUser.username}'s Vault`}
                    </span>
                  </div>
                  <p
                    className="mt-1 hidden sm:block"
                    style={{
                      fontFamily: 'var(--font-grotesk)',
                      fontSize: '0.62rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Private Document Sanctuary · Zero-Knowledge
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Atmospheric Time indicator */}
                <div
                  className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  style={{
                    background: 'var(--glass-pill-bg)',
                    border: '1px solid var(--glass-border)',
                    fontFamily: 'var(--font-grotesk)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Clock className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
                  <span suppressHydrationWarning>{timeString || '12:00 PM'}</span>
                  <span className="mx-1 opacity-40">·</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                    {themeLabel}
                  </span>
                </div>

                {/* Theme switcher */}
                <div
                  className="flex items-center rounded-2xl p-1"
                  style={{
                    background: 'var(--glass-pill-bg)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {[
                    { key: 'dawn', icon: <Sunrise className="h-4 w-4" />, title: 'Dawn' },
                    { key: 'midday', icon: <Sun className="h-4 w-4" />, title: 'Midday' },
                    { key: 'sunset', icon: <SunsetIcon className="h-4 w-4" />, title: 'Sunset' },
                    { key: 'night', icon: <Moon className="h-4 w-4" />, title: 'Night' },
                  ].map(({ key, icon, title }) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key as any)}
                      title={title}
                      className="rounded-xl p-1.5 transition cursor-pointer"
                      style={{
                        background: phase === key ? 'var(--accent-color)' : 'transparent',
                        color: phase === key ? 'white' : 'var(--text-muted)',
                        boxShadow: phase === key ? '0 2px 10px var(--accent-glow)' : 'none',
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>

                <OfflineSyncBadge />

                {/* User avatar & logout pill */}
                <div
                  className="flex items-center gap-2.5 rounded-2xl px-3 py-1.5"
                  style={{
                    background: 'var(--glass-pill-bg)',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white font-bold uppercase shadow"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-color), #4f46e5)',
                      fontSize: '0.65rem',
                    }}
                  >
                    {currentUser.username[0]}
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-grotesk)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {currentUser.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-1 flex items-center gap-1 transition cursor-pointer"
                    style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontFamily: 'var(--font-grotesk)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#f43f5e')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                    title="Logout from Vault"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            </header>

            {/* ── Breathtaking Editorial Hero Showcase ── */}
            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Editorial Welcome Card */}
              <div className="glass-panel relative flex flex-col justify-between overflow-hidden rounded-[32px] p-8 lg:col-span-2">
                {/* Ambient glow light */}
                <div
                  className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-25"
                  style={{ background: 'var(--accent-glow)' }}
                />

                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
                      style={{
                        fontFamily: 'var(--font-grotesk)',
                        fontSize: '0.62rem',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        background: 'rgba(139, 92, 246, 0.12)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                      {themeLabel} Atmospheric Sanctuary
                    </span>
                  </div>

                  <h2
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontSize: '2.35rem',
                      fontWeight: 600,
                      lineHeight: 1.18,
                      color: 'var(--text-primary)',
                    }}
                  >
                    The Sanctuary for Your Most{' '}
                    <em
                      style={{
                        fontStyle: 'italic',
                        background: 'linear-gradient(135deg, var(--accent-color) 0%, #38bdf8 50%, #f43f5e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Critical Documents.
                    </em>
                  </h2>

                  <p
                    className="mt-3.5 max-w-xl"
                    style={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      fontWeight: 300,
                      lineHeight: 1.75,
                    }}
                  >
                    Preserve, organize, and inspect your digital documents with hardware-grade client-side encryption. Every file is isolated within your personal IndexedDB partition with instantaneous live previews and seamless offline synchronization.
                  </p>
                </div>

                {/* Micro-Features Row */}
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>AES-GCM 256</span>
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                    <Lock className="h-3.5 w-3.5" style={{ color: 'var(--accent-color)' }} />
                    <span>Zero-Knowledge IndexedDB</span>
                  </div>
                  <span className="opacity-30">•</span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)]">
                    <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                    <span>Instant Visual Thumbnails</span>
                  </div>
                </div>
              </div>

              {/* Storage Telemetry Widget */}
              <StorageMetricsWidget documents={documents} />
            </div>

            {/* ── Main Workspace: Upload + Document Repository ── */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column: Dropzone */}
              <div className="lg:col-span-1">
                <DropzoneUploader userId={currentUser.id} />
              </div>

              {/* Right Column: Search + Filters + Library */}
              <div className="space-y-5 lg:col-span-2">
                {/* Library Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-playfair)',
                        fontSize: '1.45rem',
                        fontStyle: 'italic',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Document Library
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-grotesk)',
                        fontSize: '0.62rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        marginTop: '0.1rem',
                      }}
                    >
                      Cryptographic Vault Repository ({filteredDocuments.length} files)
                    </p>
                  </div>

                  {/* Search + View Toggle */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-3 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        placeholder="Search title, tag, extension..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="glass-input rounded-2xl py-2 pl-9 pr-4 text-sm outline-none w-52 sm:w-64"
                        style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem' }}
                      />
                    </div>

                    <div
                      className="flex items-center rounded-2xl p-1"
                      style={{
                        background: 'var(--glass-pill-bg)',
                        border: '1px solid var(--glass-border)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <button
                        onClick={() => setViewMode('grid')}
                        className="rounded-xl p-1.5 transition cursor-pointer"
                        style={{
                          background: viewMode === 'grid' ? 'rgba(255,255,255,0.12)' : 'transparent',
                          color: viewMode === 'grid' ? 'white' : 'var(--text-muted)',
                          boxShadow: viewMode === 'grid' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                        }}
                        title="Grid view"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className="rounded-xl p-1.5 transition cursor-pointer"
                        style={{
                          background: viewMode === 'list' ? 'rgba(255,255,255,0.12)' : 'transparent',
                          color: viewMode === 'list' ? 'white' : 'var(--text-muted)',
                          boxShadow: viewMode === 'list' ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                        }}
                        title="List view"
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {CATEGORIES.map((cat) => {
                    const count = cat === 'All'
                      ? documents.length
                      : documents.filter((d) => d.category === cat).length;

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className="shrink-0 flex items-center gap-1.5 rounded-2xl px-3.5 py-1.5 transition-all cursor-pointer"
                        style={{
                          fontFamily: 'var(--font-grotesk)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          background: selectedCategory === cat
                            ? 'linear-gradient(135deg, var(--accent-color), #4f46e5)'
                            : 'var(--glass-pill-bg)',
                          border: `1px solid ${selectedCategory === cat ? 'transparent' : 'var(--glass-border)'}`,
                          color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                          boxShadow: selectedCategory === cat ? '0 4px 14px var(--accent-glow)' : 'none',
                          transform: selectedCategory === cat ? 'scale(1.02)' : 'scale(1)',
                        }}
                      >
                        <span>{cat}</span>
                        {count > 0 && (
                          <span
                            className="rounded-full px-1.5 py-0.2"
                            style={{
                              fontSize: '0.6rem',
                              background: selectedCategory === cat ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Documents Grid / List */}
                {filteredDocuments.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center rounded-3xl p-14 text-center"
                    style={{
                      background: 'var(--glass-card-bg)',
                      border: '1px dashed var(--glass-border)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border mb-4"
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderColor: 'rgba(139, 92, 246, 0.25)',
                        color: 'var(--accent-color)',
                      }}
                    >
                      <FileUp className="h-8 w-8 stroke-[1.4]" />
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
                      {searchQuery || selectedCategory !== 'All' ? 'No Matching Documents Found' : 'Your Vault is Prepared'}
                    </h4>
                    <p
                      className="mt-1.5 max-w-sm"
                      style={{ fontFamily: 'var(--font-inter)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: 1.6 }}
                    >
                      {searchQuery || selectedCategory !== 'All'
                        ? 'Try clearing your search query or choosing another category filter to explore other vault entries.'
                        : 'Deposit a PDF, high-res scan, text contract, or image using the drop zone on the left to start building your private encrypted archive.'}
                    </p>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {filteredDocuments.map((doc) => (
                      <DocumentCard
                        key={doc.id}
                        document={doc}
                        onPreview={(d) => setActivePreviewDoc(d)}
                        onDelete={handleDeleteDocument}
                        onDownload={handleDownloadDocument}
                      />
                    ))}
                  </div>
                ) : (
                  <DocumentList
                    documents={filteredDocuments}
                    onPreview={(d) => setActivePreviewDoc(d)}
                    onDelete={handleDeleteDocument}
                    onDownload={handleDownloadDocument}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
