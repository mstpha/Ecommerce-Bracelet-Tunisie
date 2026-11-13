import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDirectory = path.join(root, 'dist', 'images');
const imageFiles = (await fs.readdir(imagesDirectory, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === '.webp');

if (imageFiles.length === 0) {
  throw new Error(`No product WebP images found in ${imagesDirectory}`);
}

let originalBytes = 0;
let compressedBytes = 0;
let optimizedCount = 0;

for (const imageFile of imageFiles) {
  const imagePath = path.join(imagesDirectory, imageFile.name);
  const original = await fs.readFile(imagePath);
  const compressed = await sharp(original)
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 55, effort: 6, smartSubsample: true })
    .toBuffer();

  const output = compressed.byteLength < original.byteLength ? compressed : original;
  if (output === compressed) {
    await fs.writeFile(imagePath, compressed);
    optimizedCount += 1;
  }

  originalBytes += original.byteLength;
  compressedBytes += output.byteLength;
}

const reduction = ((1 - compressedBytes / originalBytes) * 100).toFixed(1);
console.log(
  `Optimized ${optimizedCount}/${imageFiles.length} product images: `
  + `${(originalBytes / 1024 / 1024).toFixed(2)} MB -> `
  + `${(compressedBytes / 1024 / 1024).toFixed(2)} MB (${reduction}% smaller).`
);
