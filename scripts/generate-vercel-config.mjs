import fs from 'node:fs';
import productSource from '../src/app/Data/products.json' with { type: 'json' };
import { buildProduct, productPath } from '../src/app/Data/catalogContent.js';

const products = productSource.products.map(buildProduct);
const redirects = [
  { source: '/shop', destination: '/boutique', permanent: true },
  { source: '/shop/category/bracelet', destination: '/boutique/categorie/bracelets', permanent: true },
  { source: '/shop/category/cap', destination: '/boutique/categorie/casquettes', permanent: true },
  { source: '/shop/category/necklace', destination: '/boutique/categorie/colliers', permanent: true },
  { source: '/shop/category/earring', destination: '/boutique/categorie/boucles-d-oreilles', permanent: true },
  { source: '/checkout', destination: '/commande', permanent: true },
  { source: '/login', destination: '/connexion', permanent: true },
  { source: '/register', destination: '/inscription', permanent: true },
  ...products.map((product) => ({
    source: `/product/${product.id}`,
    destination: productPath(product),
    permanent: true,
  })),
];

fs.writeFileSync('vercel.json', `${JSON.stringify({
  redirects,
  rewrites: [{ source: '/(.*)', destination: '/index.html' }],
}, null, 2)}\n`);
console.log(`Generated ${redirects.length} permanent redirects and the SPA rewrite.`);
