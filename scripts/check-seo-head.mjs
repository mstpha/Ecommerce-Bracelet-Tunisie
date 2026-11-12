import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function findHtmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = tag.match(new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

const requiredTags = [
  ['title', (tag) => tag.name === 'title'],
  ['meta description', (tag) => tag.name === 'meta' && getAttribute(tag.html, 'name') === 'description'],
  ['canonical', (tag) => tag.name === 'link' && getAttribute(tag.html, 'rel') === 'canonical'],
  ...['title', 'description', 'type', 'url', 'image', 'image:alt', 'locale', 'site_name']
    .map((key) => [`og:${key}`, (tag) => tag.name === 'meta' && getAttribute(tag.html, 'property') === `og:${key}`]),
  ...['card', 'title', 'description', 'image', 'image:alt']
    .map((key) => [`twitter:${key}`, (tag) => tag.name === 'meta' && getAttribute(tag.html, 'name') === `twitter:${key}`]),
];

const htmlFiles = findHtmlFiles(dist);
if (htmlFiles.length === 0) {
  throw new Error(`Aucun fichier HTML trouvé dans ${dist}`);
}

const failures = [];
const htmlDocuments = htmlFiles.filter((file) => {
  const contents = fs.readFileSync(file, 'utf8');
  // Preserve plain-text verification tokens such as Google's .html verification file.
  return /<!doctype html|<html\b/i.test(contents);
});

if (htmlDocuments.length === 0) {
  throw new Error(`Aucun document HTML trouvé dans ${dist}`);
}

for (const file of htmlDocuments) {
  const html = fs.readFileSync(file, 'utf8');
  const tags = [...html.matchAll(/<(title|meta|link)\b[^>]*>/gi)]
    .map(([tagHtml, name]) => ({ html: tagHtml, name: name.toLowerCase() }));

  for (const [label, matches] of requiredTags) {
    const count = tags.filter(matches).length;
    if (count !== 1) failures.push(`${path.relative(dist, file)}: ${label} trouvé ${count} fois`);
  }
}

if (failures.length > 0) {
  console.error('Vérification des balises SEO échouée :');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Vérification SEO réussie : ${requiredTags.length} balises uniques dans ${htmlDocuments.length} pages HTML.`);
}
