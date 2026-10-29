import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AetherVault — Cryptographic Document Sanctuary',
  description: 'Next-generation glassmorphic document vault with offline-first PWA, end-to-end local encryption, and atmospheric themes.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.svg',
    apple: '/icon-512.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/manifest.json`} />
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/icon-192.svg`} type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden selection:bg-purple-600 selection:text-white"
            style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-inter)' }}>
        {/* ── Ambient glow orbs — always rendered behind content ── */}
        <div className="ambient-orbs" aria-hidden="true">
          <div className="orb-1" />
          <div className="orb-2" />
          <div className="orb-3" />
          <div className="dot-grid" />
        </div>

        {/* ── Main app content ── */}
        <div className="relative z-10">
          {children}
        </div>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
                window.addEventListener('load', function() {
                  const basePath = '${process.env.NEXT_PUBLIC_BASE_PATH || ""}';
                  navigator.serviceWorker.register(basePath + '/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
