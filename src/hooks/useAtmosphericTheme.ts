'use client';

import { useState, useEffect } from 'react';

export type TimePhase = 'dawn' | 'midday' | 'sunset' | 'night';

export interface AtmosphericThemeInfo {
  phase: TimePhase;
  label: string;
  description: string;
  timeString: string;
  isManualOverride: boolean;
  setTheme: (phase: TimePhase) => void;
  resetToAuto: () => void;
}

export function useAtmosphericTheme(): AtmosphericThemeInfo {
  const [phase, setPhase] = useState<TimePhase>('midday');
  const [timeString, setTimeString] = useState<string>('');
  const [isManualOverride, setIsManualOverride] = useState<boolean>(false);

  const calculateAutoPhase = (date: Date): { phase: TimePhase; label: string; desc: string } => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeVal = hours + minutes / 60;

    if (timeVal >= 5 && timeVal < 7.5) {
      return { phase: 'dawn', label: 'Dawn & Sunrise', desc: 'Warm pastel amber & rose gradients' };
    }
    if (timeVal >= 7.5 && timeVal < 17) {
      return { phase: 'midday', label: 'Midday Daylight', desc: 'Crisp, high-contrast ambient workspace' };
    }
    if (timeVal >= 17 && timeVal < 20) {
      return { phase: 'sunset', label: 'Sunset & Dusk', desc: 'Rich amber twilight & deep violet' };
    }
    return { phase: 'night', label: 'Midnight Obsidian', desc: 'Sleek dark mode with starlight aura' };
  };

  useEffect(() => {
    const applyThemeToDOM = (p: TimePhase) => {
      document.documentElement.setAttribute('data-theme', p);
    };

    const tick = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      if (!isManualOverride) {
        const auto = calculateAutoPhase(now);
        setPhase(auto.phase);
        applyThemeToDOM(auto.phase);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isManualOverride]);

  const setManualTheme = (newPhase: TimePhase) => {
    setIsManualOverride(true);
    setPhase(newPhase);
    document.documentElement.setAttribute('data-theme', newPhase);
  };

  const resetToAuto = () => {
    setIsManualOverride(false);
    const auto = calculateAutoPhase(new Date());
    setPhase(auto.phase);
    document.documentElement.setAttribute('data-theme', auto.phase);
  };

  const infoMap: Record<TimePhase, { label: string; desc: string }> = {
    dawn: { label: 'Dawn & Sunrise', desc: 'Warm pastel amber & rose gradients' },
    midday: { label: 'Midday Daylight', desc: 'Crisp, high-contrast ambient workspace' },
    sunset: { label: 'Sunset & Dusk', desc: 'Rich amber twilight & deep violet' },
    night: { label: 'Midnight Obsidian', desc: 'Sleek dark mode with starlight aura' },
  };

  return {
    phase,
    label: infoMap[phase].label,
    description: infoMap[phase].desc,
    timeString,
    isManualOverride,
    setTheme: setManualTheme,
    resetToAuto,
  };
}
