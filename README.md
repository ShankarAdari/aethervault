# DocFlow - Cross-Device, Offline-First PWA Document Vault

A full-featured, cross-device, PWA-enabled Document Management Web Application built with **Next.js 14**, **Tailwind CSS**, **Framer Motion**, **Dexie.js (IndexedDB)**, and **Service Workers**.

---

## ✨ Key Features Implemented

1. **Atmospheric Dynamic Time-of-Day Theme Engine**:
   - Automatically adapts colors, ambient gradients, and glowing halos according to local device time:
     - 🌅 **Dawn / Sunrise** (Warm pastel amber & rose gradients)
     - ☀️ **Midday Daylight** (Crisp, high-contrast ambient workspace)
     - 🌆 **Sunset & Dusk** (Rich amber twilight & deep violet)
     - 🌌 **Midnight Obsidian** (Sleek dark mode with subtle floating starlight particles)
   - Interactive manual theme override pills in the top bar for testing anytime.

2. **0-to-100% Kinetic Initial Welcome Animation**:
   - Liquid neon progress circle with real-time hardware boot phases.
   - Smooth easing transitions into the user workspace.

3. **Authentication & Workspace Onboarding**:
   - Toggle between "Login" and "Create New Account" with credential validation.
   - Secondary stylized welcome loading animation (0% to 100%): *"Welcome back, [Username]! Setting up your workspace..."*.
   - Inline error banners with instant "Try Again" recovery actions.

4. **Offline-First Vault & Two-Way Sync Engine**:
   - Built on **IndexedDB** using **Dexie.js** and **dexie-react-hooks**.
   - Works 100% offline: browse, search, preview, and add documents with zero network connection.
   - Optimistic Outbox Queue auto-syncs with backend endpoints whenever the network reconnects.
   - Live badge showing network status (Online / Offline Mode / Syncing / All Synced).

5. **Drag-and-Drop Uploader & Naming Flow**:
   - Prominent upload zone with drop animations.
   - Live instant preview modal (PDF, Images, Text).
   - "How would you like to save this document?" prompt with editable title, category assignment, and tags.

6. **In-App Multi-Format Document Viewer**:
   - Inline modal preview for PDFs, Images (with pan/zoom controls), Code, and Text documents.
   - Complete metadata inspector: file name, file size, format tag, upload date, and category.
   - One-click Download and Delete actions.

7. **Storage Analytics Dashboard**:
   - Storage progress bar (used of 10.00 GB allocation).
   - Metrics cards for total documents, offline cached count, active categories, and AES-256 encryption status.

---

## 🚀 Getting Started

### 1. Set as Active Workspace
Open `C:\Users\HP\.gemini\antigravity\scratch\docflow-pwa` in your editor or terminal.

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Install as PWA
- In Google Chrome or Microsoft Edge: click the **Install** icon in the address bar.
- On iOS (Safari): tap **Share** > **Add to Home Screen**.
- On Android (Chrome): tap **Add to Home screen**.
