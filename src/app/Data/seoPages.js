import { categories, categorySeoDescription, categoryTitle } from './catalogContent.js';

const brand = ' | Bracelet Tunisie';
export const homeSeo = {
  title: 'Bracelets et accessoires en Tunisie | Bracelet Tunisie',
  description: 'Découvrez bracelets et accessoires en Tunisie. Parcourez notre sélection et commandez en ligne, avec livraison dans toute la Tunisie et paiement à la livraison.',
  path: '/',
};

export const shopSeo = {
  title: 'Boutique : bracelets et accessoires | Bracelet Tunisie',
  description: 'Découvrez notre boutique : bracelets et accessoires en Tunisie. Commandez en ligne. Livraison dans toute la Tunisie, paiement à la livraison. Choisissez.',
  path: '/boutique',
};

export function categorySeo(category) {
  const name = categories[category].keyword;
  const title = `${name.charAt(0).toUpperCase()}${name.slice(1)} | Bracelet Tunisie`;
  return {
    title,
    description: categorySeoDescription(category),
    path: categories[category].path,
  };
}

export function productSeo(product) {
  const titleWithLocation = `${product.name} en Tunisie${brand}`;
  const title = titleWithLocation.length < 60 ? titleWithLocation : `${product.name}${brand}`;
  return {
    title,
    description: product.metaDescription,
    path: `/produit/${product.id}-${product.slug}`,
  };
}

export function privateSeo(path, title, description) {
  return { path, title, description };
}

export { categoryTitle };
