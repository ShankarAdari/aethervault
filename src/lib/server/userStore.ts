// In-memory persistent server user store for multi-device/online sync
export interface ServerUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

// Global declaration to persist across hot reloads in dev/production
declare global {
  var __DOCFLOW_SERVER_USERS__: Map<string, ServerUser> | undefined;
}

if (!global.__DOCFLOW_SERVER_USERS__) {
  global.__DOCFLOW_SERVER_USERS__ = new Map<string, ServerUser>();
}

export const serverUserStore = global.__DOCFLOW_SERVER_USERS__;
