import Dexie, { type Table } from 'dexie';
import { LocalDocument, SyncOutboxItem, DbUser } from '@/types/document';

export class DocFlowDatabase extends Dexie {
  users!: Table<DbUser, string>;
  documents!: Table<LocalDocument, string>;
  syncOutbox!: Table<SyncOutboxItem, number>;

  constructor() {
    super('DocFlowVaultDB');
    this.version(2).stores({
      users: 'id, &username',
      documents: 'id, userId, title, mimeType, category, syncStatus, updatedAt, *tags',
      syncOutbox: '++id, userId, documentId, action, timestamp',
    });
    this.version(3).stores({
      users: 'id, &username, email',
      documents: 'id, userId, title, mimeType, category, syncStatus, updatedAt, *tags',
      syncOutbox: '++id, userId, documentId, action, timestamp',
    });
  }
}

export const db = new DocFlowDatabase();
