import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import productSource from '../src/app/Data/products.json' with { type: 'json' };
import { buildProduct, categories, productImage, productPath } from '../src/app/Data/catalogContent.js';
import { categorySeo, homeSeo, productSeo, shopSeo } from '../src/app/Data/seoPages.js';
import { SITE_NAME, SITE_URL, DEFAULT_SOCIAL_IMAGE } from '../src/config/seo.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const products = productSource.products.map(buildProduct);
const today = new Date().toISOString().slice(0, 10);
const shopProducts = products;

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const escapeJsonLd = (value) => JSON.stringify(value).replaceAll('<', '\\u003c');

function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

function collectionData(items, category) {
  const collectionPath = category ? categories[category].path : '/boutique';
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category ? categories[category].name : 'Boutique de bracelets et accessoires',
      url: `${SITE_URL}${collectionPath}`,
      inLanguage: 'fr-TN',
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: items.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: `${SITE_URL}${productPath(product)}`,
        })),
      },
    },
    breadcrumb([
      { name: 'Accueil', path: '/' },
      ...(category ? [
        { name: 'Boutique', path: '/boutique' },
        { name: categories[category].name, path: collectionPath },
      ] : []),
    ]),
  ];
}

function productData(product) {
  const category = categories[product.category];
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: `${SITE_URL}${productImage(product)}`,
      brand: { '@type': 'Brand', name: SITE_NAME },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TND',
        availability: `https://schema.org/${{
          in_stock: 'InStock',
          limited_stock: 'LimitedAvailability',
          out_of_stock: 'OutOfStock',
        }[product.availability] ?? 'InStock'}`,
        url: `${SITE_URL}${productPath(product)}`,
      },
    },
    breadcrumb([
      { name: 'Accueil', path: '/' },
      { name: 'Boutique', path: '/boutique' },
      { name: category.name, path: category.path },
      { name: product.name, path: productPath(product) },
    ]),
  ];
}

function setMeta(html, attribute, key, content) {
  const matcher = new RegExp(`<meta\\s+${attribute}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `  ${tag}\n  </head>`);
}

function renderHtml(page) {
  let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, `<title data-rh="true">${escapeHtml(page.title)}</title>`);
  html = html.replace(/<link[^>]+rel="canonical"[^>]*>/gi, '');
  html = html.replace('</head>', `  <link data-rh="true" rel="canonical" href="${escapeHtml(`${SITE_URL}${page.path}`)}" />\n  </head>`);
  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:type', page.type ?? 'website');
  html = setMeta(html, 'property', 'og:url', `${SITE_URL}${page.path}`);
  html = setMeta(html, 'property', 'og:image', page.image ?? DEFAULT_SOCIAL_IMAGE);
  html = setMeta(html, 'property', 'og:image:alt', page.imageAlt ?? 'Sélection de bracelets et accessoires de Bracelet Tunisie');
  html = setMeta(html, 'property', 'og:locale', 'fr_TN');
  html = setMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:image', page.image ?? DEFAULT_SOCIAL_IMAGE);
  html = setMeta(html, 'name', 'twitter:image:alt', page.imageAlt ?? 'Sélection de bracelets et accessoires de Bracelet Tunisie');
  if (page.noindex) html = setMeta(html, 'name', 'robots', 'noindex, nofollow');
  const structuredData = page.jsonLd
    ? `<script data-rh="true" type="application/ld+json">${escapeJsonLd(page.jsonLd)}</script>`
    : '';
  const body = `<main><h1>${escapeHtml(page.heading)}</h1>${page.content ?? ''}${structuredData}</main>`;
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/i, `<div id="root">${body}</div>`);
  const target = path.join(dist, page.path.replace(/^\//, ''), 'index.html');
  if (page.path === '/') {
    fs.writeFileSync(path.join(dist, 'index.html'), html);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, html);
  }
}

const routes = [
  {
    ...homeSeo,
    heading: 'Bracelets, bagues et accessoires en Tunisie',
    jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.jfif` },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, inLanguage: 'fr-TN' },
    ],
  },
  {
    ...shopSeo,
    heading: 'Notre boutique de bracelets et accessoires',
    jsonLd: collectionData(shopProducts, null),
    content: '<p>Parcourez notre sélection de bracelets et accessoires en Tunisie. Livraison dans toute la Tunisie, paiement à la livraison et confirmation par téléphone.</p>',
  },
];

for (const [key, category] of Object.entries(categories)) {
  const categoryProducts = products.filter((product) => product.category === key);
  const page = categorySeo(key);
  routes.push({
    ...page,
    heading: key === 'bracelet' ? 'Bracelets homme et femme en Tunisie' : `${category.name} en Tunisie`,
    jsonLd: collectionData(categoryProducts, key),
    content: `<p>${escapeHtml(category.intro)}</p>`,
  });
}

for (const product of products) {
  const page = productSeo(product);
  routes.push({
    ...page,
    heading: product.name,
    image: `${SITE_URL}${productImage(product)}`,
    imageAlt: `Photo du produit : ${product.name}`,
    type: 'product',
    jsonLd: productData(product),
    content: `<p>${escapeHtml(product.description)}</p>`,
  });
}

routes.push(
  {
    path: '/connexion',
    title: 'Connexion | Bracelet Tunisie',
    description: 'Connectez-vous à votre compte Bracelet Tunisie pour retrouver votre profil et vos commandes. Accédez à votre espace client en toute simplicité.',
    heading: 'Connexion',
    noindex: true,
  },
  {
    path: '/inscription',
    title: 'Créer un compte | Bracelet Tunisie',
    description: 'Créez un compte Bracelet Tunisie pour gérer votre profil et vos commandes. Inscrivez-vous facilement dès maintenant et retrouvez votre espace client.',
    heading: 'Créer un compte',
    noindex: true,
  },
  {
    path: '/commande',
    title: 'Finaliser votre commande | Bracelet Tunisie',
    description: 'Finalisez votre commande de bracelets et accessoires en Tunisie. Renseignez vos coordonnées pour recevoir votre sélection et payer à la livraison.',
    heading: 'Finaliser votre commande',
    noindex: true,
  },
  {
    path: '/commande/confirmation',
    title: 'Commande confirmée | Bracelet Tunisie',
    description: 'Votre commande est enregistrée. Notre équipe vous contactera par téléphone pour la confirmer avant la livraison dans toute la Tunisie. Paiement à la livraison.',
    heading: 'Commande confirmée',
    noindex: true,
  },
);

for (const page of routes) {
  if (page.title.length >= 60) throw new Error(`Titre trop long (${page.title.length}) : ${page.path}`);
  if (page.description.length < 140 || page.description.length > 160) {
    throw new Error(`Description SEO hors limite (${page.description.length}) : ${page.path} — ${page.description}`);
  }
  if (!page.noindex && page.jsonLd == null) throw new Error(`JSON-LD manquant : ${page.path}`);
  renderHtml(page);
}

for (const product of products) {
  const count = product.description.trim().split(/\s+/).length;
  if (count < 80 || count > 120) throw new Error(`Description produit hors limite (${count} mots) : ${product.id}`);
}
for (const category of Object.values(categories)) {
  const count = category.intro.trim().split(/\s+/).length;
  if (count < 100 || count > 150) throw new Error(`Introduction catégorie hors limite (${count} mots) : ${category.name}`);
}

const sitemapRoutes = routes.filter((page) => !page.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((page) => `  <url><loc>${SITE_URL}${page.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(root, 'public', 'robots.txt'), robots);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(dist, 'robots.txt'), robots);

console.log(`Generated ${routes.length} static route pages and ${sitemapRoutes.length} sitemap URLs.`);
