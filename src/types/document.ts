export type DocumentCategory = 
  | 'Invoices' 
  | 'Certificates' 
  | 'Contracts' 
  | 'Personal' 
  | 'Financial' 
  | 'Tax' 
  | 'General';

export type SyncStatus = 'synced' | 'pending_upload' | 'pending_update' | 'pending_delete' | 'sync_error';

export interface DbUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  vaultName?: string;
  createdAt: string;
}

export interface LocalDocument {
  id: string;
  userId: string; // Per-user isolated document store
  title: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  blobData?: Blob;
  thumbnailUrl?: string;
  category: DocumentCategory;
  tags: string[];
  syncStatus: SyncStatus;
  storageKey?: string;
  remoteUrl?: string;
  checksumSha?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncOutboxItem {
  id?: number;
  userId: string;
  documentId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: number;
  retryCount: number;
}

export interface UserSession {
  id: string;
  username: string;
  vaultName?: string;
  email?: string;
  token?: string;
  createdAt?: string;
}
