'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { syncEngine } from '@/lib/sync/syncEngine';

export const OfflineSyncBadge: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((syncing, count) => {
      setIsSyncing(syncing);
      setPendingCount(count);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = () => {
    if (isOnline) {
      syncEngine.drainQueue();
    }
  };

  return (
    <div
      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs shadow-md backdrop-blur-md"
      style={{
        background: 'var(--glass-pill-bg)',
        border: '1px solid var(--glass-border)',
        fontFamily: 'var(--font-grotesk)',
      }}
    >
      {isOnline ? (
        <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#34d399' }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <Wifi className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Online</span>
        </span>
      ) : (
        <span className="flex items-center gap-1.5 font-semibold" style={{ color: '#fbbf24' }}>
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <WifiOff className="h-3.5 w-3.5" />
          <span>Offline</span>
        </span>
      )}

      <div className="h-3 w-px opacity-20" style={{ background: 'var(--text-muted)' }} />

      {isSyncing ? (
        <span className="flex items-center gap-1 font-semibold" style={{ color: 'var(--accent-color)' }}>
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span>Syncing {pendingCount > 0 ? `(${pendingCount})` : ''}</span>
        </span>
      ) : pendingCount > 0 ? (
        <button
          onClick={handleManualSync}
          className="flex items-center gap-1 font-semibold hover:underline cursor-pointer"
          style={{ color: '#fbbf24' }}
          title="Click to sync changes to cloud"
        >
          <RefreshCw className="h-3 w-3" />
          <span>{pendingCount} unsynced</span>
        </button>
      ) : (
        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span className="hidden sm:inline">All Synced</span>
        </span>
      )}
    </div>
  );
};
