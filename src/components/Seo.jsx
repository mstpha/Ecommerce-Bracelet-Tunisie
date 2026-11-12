import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_SOCIAL_IMAGE, SITE_NAME, SITE_URL } from '../config/seo';

function updateMeta(attribute, key, content) {
  const selector = `meta[${attribute}="${key}"]`;
  const existing = document.head.querySelectorAll(selector);
  const meta = existing[0] ?? document.createElement('meta');

  existing.forEach((element, index) => {
    if (index > 0) element.remove();
  });

  meta.setAttribute(attribute, key);
  meta.setAttribute('content', content);
  if (!meta.isConnected) document.head.append(meta);
}

function updateCanonical(href) {
  const existing = document.head.querySelectorAll('link[rel="canonical"]');
  const canonical = existing[0] ?? document.createElement('link');

  existing.forEach((element, index) => {
    if (index > 0) element.remove();
  });

  canonical.setAttribute('rel', 'canonical');
  canonical.setAttribute('href', href);
  if (!canonical.isConnected) document.head.append(canonical);
}

function updateTitle(title) {
  const existing = document.head.querySelectorAll('title');
  const titleElement = existing[0] ?? document.createElement('title');

  existing.forEach((element, index) => {
    if (index > 0) element.remove();
  });

  titleElement.textContent = title;
  if (!titleElement.isConnected) document.head.append(titleElement);
}

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = 'Sélection de bracelets et accessoires de Bracelet Tunisie',
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== path) return;

    const absolutePath = `${SITE_URL}${path}`;
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    updateTitle(title);
    updateMeta('name', 'description', description);
    updateCanonical(absolutePath);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:type', type);
    updateMeta('property', 'og:url', absolutePath);
    updateMeta('property', 'og:image', absoluteImage);
    updateMeta('property', 'og:image:alt', imageAlt);
    updateMeta('property', 'og:locale', 'fr_TN');
    updateMeta('property', 'og:site_name', SITE_NAME);
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', absoluteImage);
    updateMeta('name', 'twitter:image:alt', imageAlt);

    const robots = document.head.querySelectorAll('meta[name="robots"]');
    robots.forEach((element, index) => {
      if (index > 0 || !noindex) element.remove();
    });
    if (noindex) updateMeta('name', 'robots', 'noindex, nofollow');

    const jsonLdScripts = document.querySelectorAll('script[data-seo-jsonld]');
    jsonLdScripts.forEach((element, index) => {
      if (index > 0 || !jsonLd) element.remove();
    });
    if (jsonLd) {
      const script = jsonLdScripts[0] ?? document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.seoJsonld = '';
      script.textContent = JSON.stringify(jsonLd);
      if (!script.isConnected) document.head.append(script);
    }
  }, [description, image, imageAlt, jsonLd, noindex, path, pathname, title, type]);

  return null;
}
