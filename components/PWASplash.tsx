'use client';

import { useState, useEffect } from 'react';
import { SITE_NAME, SITE_TAGLINE, SITE_LOGO_PATH } from '@/lib/site-defaults';

export default function PWASplash() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Only show splash in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    // Only show on first load (not on subsequent navigations)
    const hasShownSplash = sessionStorage.getItem('splashShown');

    if (isStandalone && !hasShownSplash) {
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');

      const timer = setTimeout(() => setShowSplash(false), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showSplash) return null;

  return (
    <div className="pwa-splash" aria-hidden="true">
      <div className="pwa-splash-logo mb-6">
        <img
          src={SITE_LOGO_PATH}
          alt={SITE_NAME}
          className="w-auto h-32 max-w-[200px] object-contain drop-shadow-lg"
        />
      </div>
      <h1 className="text-white text-xl font-bold font-serif mb-2">{SITE_NAME}</h1>
      <p className="text-blue-200 text-sm font-medium mb-8">{SITE_TAGLINE}</p>
      <div className="pwa-splash-dots flex gap-1.5">
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
        <span className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
  );
}
