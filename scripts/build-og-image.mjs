/**
 * Builds public/OG.jpg (1200×630) for Open Graph / WhatsApp link previews.
 * Composites the first hero image with brand logo and text.
 */
import sharp from 'sharp';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const W = 1200;
const H = 630;

const gradientSvg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#020617" stop-opacity="0.25"/>
      <stop offset="0.45" stop-color="#020617" stop-opacity="0.12"/>
      <stop offset="1" stop-color="#020617" stop-opacity="0.78"/>
    </linearGradient>
    <linearGradient id="side" x1="0" y1="0.5" x2="1" y2="0.5">
      <stop offset="0" stop-color="#020617" stop-opacity="0.72"/>
      <stop offset="0.42" stop-color="#020617" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#020617" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" fill="url(#side)"/>
</svg>`
);

const textSvg = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="56" y="${H - 118}" font-family="Georgia, 'Times New Roman', serif" font-size="48" font-weight="600" fill="#f8fafc" letter-spacing="0.02em">DIYA&apos;S ORGANICS</text>
  <text x="56" y="${H - 74}" font-family="Segoe UI, system-ui, -apple-system, sans-serif" font-size="24" font-weight="500" fill="rgba(248,250,252,0.95)">Ayurvedic hair care &amp; beauty · Ghana</text>
  <text x="56" y="${H - 38}" font-family="Segoe UI, system-ui, -apple-system, sans-serif" font-size="19" font-weight="400" fill="#a7f3d0">Stronger, thicker, healthier hair — shop online</text>
</svg>`
);

async function main() {
  const heroPath = join(root, 'public/hero1.png');
  const logoPath = join(root, 'public/diya_white.png');
  const outPath = join(root, 'public/OG.jpg');

  const hero = await sharp(heroPath).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();

  const logo = await sharp(logoPath).resize({ width: 200 }).toBuffer();

  await sharp(hero)
    .composite([
      { input: gradientSvg, blend: 'over' },
      { input: logo, left: 52, top: 44 },
      { input: textSvg, blend: 'over' },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outPath);

  console.log('Wrote', outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
