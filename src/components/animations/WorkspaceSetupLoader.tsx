'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

interface WorkspaceSetupLoaderProps {
  username: string;
  onComplete: () => void;
}

export const WorkspaceSetupLoader: React.FC<WorkspaceSetupLoaderProps> = ({
  username,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Decrypting private database...');
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const hasFinishedRef = useRef(false);

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setProgress(100);
    onCompleteRef.current();
  };

  useEffect(() => {
    const statusMessages = [
      { at: 15, text: `Decrypting personal vault for ${username}...` },
      { at: 38, text: 'Mounting isolated document storage...' },
      { at: 62, text: 'Generating live inline preview renderers...' },
      { at: 85, text: 'Cryptographic keys verified & vault secured...' },
      { at: 95, text: 'Offline & cross-device sync active...' },
      { at: 100, text: `Welcome to your workspace, ${username}!` },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(handleFinish, 350);
          return 100;
        }
        const delta = Math.random() < 0.65 ? 1 : 2;
        const nextVal = Math.min(prev + delta, 100);
        const foundMsg = statusMessages.find((m) => nextVal >= m.at && prev < m.at);
        if (foundMsg) setStatusText(foundMsg.text);
        return nextVal;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [username]);

  // Circumference for r=68: 2 * π * 68 ≈ 427.25
  const circumference = 427.25;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Skip button */}
      <button
        onClick={handleFinish}
        className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer"
        style={{
          background: 'var(--glass-pill-bg)',
          border: '1px solid var(--glass-border)',
          color: 'var(--text-muted)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span>Skip to Dashboard</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col items-center text-center max-w-lg w-full">
        {/* Vault icon badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: 'var(--glass-card-bg)',
            border: '1px solid var(--glass-border-hover)',
            boxShadow: '0 8px 30px var(--accent-glow)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="var(--accent-color)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </motion.div>

        {/* Large Editorial "Hello — username" */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ fontFamily: 'var(--font-playfair)', color: 'var(--text-primary)', lineHeight: 1.15 }}
          className="text-4xl sm:text-6xl font-bold"
        >
          Welcome back,{' '}
          <span
            style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6, #f43f5e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {username}
          </span>
          !
        </motion.h1>

        <p
          className="mt-3 mb-8"
          style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
        >
          Initializing Secure Vault Parameters
        </p>

        {/* Dual-ring progress indicator */}
        <div className="relative h-48 w-48 flex items-center justify-center">
          {/* Outer dashed spinning ring */}
          <div className="absolute inset-0 opacity-25" style={{ animation: 'spin 10s linear infinite' }}>
            <svg className="h-full w-full" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="76"
                stroke="var(--accent-color)"
                strokeWidth="2"
                strokeDasharray="8 12"
                fill="none"
              />
            </svg>
          </div>

          {/* Main progress ring */}
          <svg className="h-full w-full" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="userLoadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            <circle cx="80" cy="80" r="68" stroke="rgba(255,255,255,0.05)" strokeWidth="9" fill="transparent" />
            <circle
              cx="80" cy="80" r="68"
              stroke="url(#userLoadGrad)"
              strokeWidth="9"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.1s ease-out',
                filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.6))',
              }}
            />
          </svg>

          {/* Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.8rem', color: 'var(--text-primary)', fontWeight: 700, lineHeight: 1 }}
            >
              {progress}
            </span>
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 600 }}>
              %
            </span>
          </div>
        </div>

        {/* Status & encryption badge */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <p style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.7rem', color: 'var(--accent-color)', height: '1.2rem', transition: 'all 0.2s' }}>
            {statusText}
          </p>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
            style={{ background: 'var(--glass-pill-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}
          >
            <Lock className="h-3.5 w-3.5" style={{ color: '#10b981' }} />
            <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              End-to-End Client Encryption Active
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
