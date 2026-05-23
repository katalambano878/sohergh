#!/usr/bin/env node
/**
 * Compress images in public/ folder for faster load times.
 * Uses sharp for lossy optimization - quality 82 preserves visual quality while reducing file size ~40%.
 * Run: npm run compress-images  (stop dev server first if files are locked on Windows)
 */
import { readdir, stat, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const QUALITY = { jpeg: 82, png: 80 };

async function compressImages() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Run: npm install sharp');
    process.exit(1);
  }

  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = join(dir, e.name);
      if (e.isDirectory() && !e.name.startsWith('.')) {
        await walk(full);
      } else if (e.isFile() && EXTENSIONS.includes(extname(e.name).toLowerCase())) {
        await compress(full, sharp);
      }
    }
  }

  async function compress(path, sharpLib) {
    try {
      const ext = extname(path).toLowerCase();
      const origSize = (await stat(path)).size;
      const input = await readFile(path);
      let candidates = [];

      if (ext === '.png') {
        const optimizedPng = await sharpLib(input)
          .rotate()
          .png({
            quality: QUALITY.png,
            compressionLevel: 9,
            effort: 10,
            palette: true,
            adaptiveFiltering: true
          })
          .toBuffer();
        candidates.push(optimizedPng);
      } else {
        const optimizedJpeg = await sharpLib(input)
          .rotate()
          .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
          .toBuffer();
        candidates.push(optimizedJpeg);
      }

      const smallest = candidates.reduce((best, current) =>
        current.length < best.length ? current : best
      );

      if (smallest.length >= origSize) {
        console.log(`${path.replace(PUBLIC, 'public')}: unchanged (already optimized)`);
        return;
      }

      await writeFile(path, smallest);
      const newSize = smallest.length;
      const saved = ((1 - newSize / origSize) * 100).toFixed(1);
      console.log(`${path.replace(PUBLIC, 'public')}: ${(origSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${saved}% smaller)`);
    } catch (err) {
      console.warn(`Skip ${path}:`, err.message);
    }
  }

  console.log('Compressing images in public/...');
  await walk(PUBLIC);
  console.log('Done.');
}

compressImages().catch((e) => {
  console.error(e);
  process.exit(1);
});
