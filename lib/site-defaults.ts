/**
 * Storefront defaults. Override via CMS settings, env, and NEXT_PUBLIC_APP_URL where noted.
 */

export const SITE_NAME = 'SoHer GH';
export const SITE_TAGLINE = 'Wigs, hair & beauty';
export const SITE_DESCRIPTION =
  'SoHer GH — wigs, hair accessories, wholesale at sohergh.com, and SoHer Beauty for makeup & skincare.';

/** Used when NEXT_PUBLIC_APP_URL is unset */
export const SITE_URL_FALLBACK = 'https://sohergh.com';

/** Main brand mark in `public/` (PNG from SoHer artwork). CMS `site_logo` overrides when set. */
export const SITE_LOGO_PATH = '/logo.png';

export const CONTACT_EMAIL_FALLBACK = 'info@sohergh.com';
/** Privacy Policy contact line (same as general email unless you split roles later). */
export const PRIVACY_POLICY_CONTACT_EMAIL = 'info@sohergh.com';

/** Primary: used for tel:, WhatsApp wa.me, SMS defaults, and schema.org telephone. */
export const CONTACT_PHONE_E164_FALLBACK = '+233203097369';
/** Second line for display and optional secondary tel links. */
export const CONTACT_PHONE_SECONDARY_E164_FALLBACK = '+233500675444';
export const CONTACT_PHONE_DISPLAY_FALLBACK =
  '+233 20 309 7369 / +233 50 067 5444';

export const CONTACT_ADDRESS_FALLBACK = 'Achimota, Accra, Ghana';

export const SMS_SENDER_ID = 'SOHERGH';
export const ORDER_SKU_PREFIX = 'SKU';
export const SITE_DOMAIN_PLACEHOLDER = 'sohergh.com';

/** Full profile URLs for footer / CMS defaults (@_so_her, soherwigs). */
export const SOCIAL_INSTAGRAM_URL = 'https://www.instagram.com/_so_her/';
export const SOCIAL_FACEBOOK_URL = 'https://www.facebook.com/soherwigs';

export function getPublicSiteUrl(): string {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return SITE_URL_FALLBACK;
}

/** Absolute URL for `public` assets (OG, Twitter, JSON-LD). */
export function getAbsolutePublicUrl(path: string): string {
  const base = getPublicSiteUrl().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
