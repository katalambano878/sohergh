'use client';

import { useEffect } from 'react';

import { SITE_NAME, SITE_TAGLINE } from '@/lib/site-defaults';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${SITE_TAGLINE}`;
  }, [title]);
}
