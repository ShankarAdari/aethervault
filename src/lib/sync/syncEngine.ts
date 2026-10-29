import { db } from '../dexie/db';
import { LocalDocument } from '@/types/document';

type SyncListener = (isSyncing: boolean, pendingCount: number) => void;

class SyncEngineManager {
  private isSyncing = false;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.drainQueue();
      });
    }
  }

  public subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async notify() {
    try {
      const pendingCount = await db.syncOutbox.count();
      this.listeners.forEach((fn) => fn(this.isSyncing, pendingCount));
    } catch {
      // ignore during initialization
    }
  }

  public async saveDocument(doc: LocalDocument): Promise<void> {
    // 1. Write immediately to Dexie for instant offline capability
    await db.documents.put({
      ...doc,
      syncStatus: 'pending_upload',
    });

    // 2. Add to outbox queue
    await db.syncOutbox.add({
      userId: doc.userId,
      documentId: doc.id,
      action: 'CREATE',
      payload: {
        id: doc.id,
        userId: doc.userId,
        title: doc.title,
        originalName: doc.originalName,
        mimeType: doc.mimeType,
        fileSize: doc.fileSize,
        category: doc.category,
        tags: doc.tags,
      },
      timestamp: Date.now(),
      retryCount: 0,
    });

    await this.notify();

    // 3. Attempt sync if online
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.drainQueue();
    }
  }

  public async deleteDocument(id: string): Promise<void> {
    const doc = await db.documents.get(id);
    await db.documents.delete(id);
    if (doc) {
      await db.syncOutbox.add({
        userId: doc.userId,
        documentId: id,
        action: 'DELETE',
        payload: { id },
        timestamp: Date.now(),
        retryCount: 0,
      });
    }
    await this.notify();

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.drainQueue();
    }
  }

  public async drainQueue(): Promise<void> {
    if (this.isSyncing || typeof navigator === 'undefined' || !navigator.onLine) return;
    this.isSyncing = true;
    await this.notify();

    try {
      const items = await db.syncOutbox.orderBy('timestamp').toArray();
      for (const item of items) {
        try {
          if (item.action === 'CREATE') {
            const localDoc = await db.documents.get(item.documentId);
            if (!localDoc) {
              if (item.id) await db.syncOutbox.delete(item.id);
              continue;
            }

            const res = await fetch('/api/documents', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item.payload),
            });

            if (res.ok) {
              await db.documents.update(localDoc.id, {
                syncStatus: 'synced',
                updatedAt: new Date().toISOString(),
              });
              if (item.id) await db.syncOutbox.delete(item.id);
            } else {
              if (item.id) {
                await db.syncOutbox.update(item.id, { retryCount: item.retryCount + 1 });
              }
            }
          } else if (item.action === 'DELETE') {
            await fetch(`/api/documents?id=${item.documentId}`, {
              method: 'DELETE',
            });
            if (item.id) await db.syncOutbox.delete(item.id);
          }
        } catch (err) {
          console.warn(`Sync retry queued for item ${item.documentId}:`, err);
        }
      }
    } finally {
      this.isSyncing = false;
      await this.notify();
    }
  }
}

export const syncEngine = new SyncEngineManager();
