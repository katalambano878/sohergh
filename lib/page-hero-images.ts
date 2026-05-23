/** Landscape hero art for inner pages (home uses /hero-1.png … /hero-3.png). */
export const PAGE_HERO_IMAGES = [
  '/page-hero-1.png',
  '/page-hero-2.png',
  '/page-hero-3.png',
  '/page-hero-4.png',
  '/page-hero-5.png',
  '/page-hero-6.png',
] as const;

/** Stable image per route key so the same page always gets the same photo. */
export function pageHeroImage(routeKey: string): string {
  let h = 0;
  for (let i = 0; i < routeKey.length; i++) {
    h = (h + routeKey.charCodeAt(i) * (i + 1)) >>> 0;
  }
  return PAGE_HERO_IMAGES[h % PAGE_HERO_IMAGES.length];
}
