import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDirectory = path.join(root, 'dist', 'images');
const imageFiles = (await fs.readdir(imagesDirectory, { withFileTypes: true }))
  .filter((entry) => (
    entry.isFile()
    && path.extname(entry.name).toLowerCase() === '.webp'
    && !entry.name.toLowerCase().endsWith('-thumb.webp')
  ));

if (imageFiles.length === 0) {
  throw new Error(`No product WebP images found in ${imagesDirectory}`);
}

let originalBytes = 0;
let compressedBytes = 0;
let optimizedCount = 0;
let thumbnailBytes = 0;

for (const imageFile of imageFiles) {
  const imagePath = path.join(imagesDirectory, imageFile.name);
  const original = await fs.readFile(imagePath);
  const thumbnail = await sharp(original)
    .resize({ width: 720, height: 720, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 50, effort: 6, smartSubsample: true })
    .toBuffer();
  const thumbnailPath = path.join(
    imagesDirectory,
    imageFile.name.replace(/\.webp$/i, '-thumb.webp')
  );
  const thumbnailOutput = thumbnail.byteLength < original.byteLength ? thumbnail : original;
  await fs.writeFile(thumbnailPath, thumbnailOutput);
  thumbnailBytes += thumbnailOutput.byteLength;

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
console.log(`Generated ${imageFiles.length} listing thumbnails: ${(thumbnailBytes / 1024 / 1024).toFixed(2)} MB.`);

const logoPath = path.join(root, 'dist', 'logo.jfif');
const originalLogo = await fs.readFile(logoPath);
const optimizedLogo = await sharp(originalLogo)
  .resize({ width: 600, height: 600, fit: 'inside', withoutEnlargement: true })
  .jpeg({ quality: 60, mozjpeg: true })
  .toBuffer();

if (optimizedLogo.byteLength < originalLogo.byteLength) {
  await fs.writeFile(logoPath, optimizedLogo);
  console.log(
    `Optimized site logo: ${(originalLogo.byteLength / 1024).toFixed(1)} KB -> `
    + `${(optimizedLogo.byteLength / 1024).toFixed(1)} KB.`
  );
}
