'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface InitialLoadProgressProps {
  onComplete: () => void;
}

export const InitialLoadProgress: React.FC<InitialLoadProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing...');
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
      { at: 18, text: 'Calibrating atmospheric theme engine...' },
      { at: 42, text: 'Opening cryptographic document vault...' },
      { at: 68, text: 'Synchronizing offline PWA caches...' },
      { at: 88, text: 'Hardware security & encryption ready...' },
      { at: 100, text: 'Welcome to AetherVault!' },
    ];

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => handleFinish(), 350);
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
  }, []);

  // SVG ring — r=88, circumference = 2 * π * 88 ≈ 552.92
  const circumference = 552.92;
  const strokeDashoffset = circumference - (circumference * progress) / 100;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
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
        <span>Enter Workspace</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>

      <div className="flex flex-col items-center text-center">
        {/* Glowing SVG Progress Ring */}
        <div className="relative w-52 h-52 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="introRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle cx="100" cy="100" r="88" stroke="rgba(255,255,255,0.05)" strokeWidth="7" fill="transparent" />
            {/* Progress arc */}
            <circle
              cx="100"
              cy="100"
              r="88"
              stroke="url(#introRingGrad)"
              strokeWidth="7"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s ease-out', filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.7))' }}
            />
          </svg>

          {/* Center counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display font-bold tracking-tighter"
              style={{ color: 'var(--text-primary)', fontSize: '3.2rem', lineHeight: 1 }}
            >
              {progress}%
            </span>
            <span
              className="font-mono mt-1 uppercase tracking-[0.3em]"
              style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}
            >
              Initializing
            </span>
          </div>
        </div>

        {/* Brand name */}
        <div className="mt-8">
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.25rem', color: 'var(--text-primary)', fontStyle: 'italic', fontWeight: 600, lineHeight: 1.2 }}>
            Aether<span style={{ fontFamily: 'var(--font-inter)', fontStyle: 'normal', fontWeight: 300, color: 'var(--accent-color)', fontSize: '2rem' }}>Vault</span>
          </h1>
          <p className="mt-2 text-center" style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Next-Generation Cryptographic Document Sanctuary
          </p>
        </div>

        {/* Status ticker */}
        <div
          className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2"
          style={{ background: 'var(--glass-pill-bg)', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-color)' }} />
          <span style={{ fontFamily: 'var(--font-grotesk)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {statusText}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
