import { categories, categorySeoDescription, categoryTitle } from './catalogContent.js';

const brand = ' | Bracelet Tunisie';
const productTitleNames = {
  1: 'Parure argentée à strass',
  2: 'Parure dorée à strass',
  3: 'Parure style Cartier argentée',
  4: 'Parure style Cartier dorée',
  5: 'Parure maille grain de café',
  6: 'Collier doré pour homme',
  7: 'Parure maille suisse argentée',
  8: 'Collier maille suisse argenté',
  9: 'Collier grain de café argenté',
  10: 'Collier torsadé doré',
  11: 'Collier style Cartier argenté',
  12: 'Collier style Cartier doré',
  13: 'Parure montre dorée à strass',
  14: 'Parure montre argentée',
  15: 'Collier argenté à strass',
  16: 'Collier doré à strass',
  17: 'Collier argenté pour homme',
  18: 'Bracelet serpent argenté',
  19: 'Bracelet serpent doré',
  20: 'Collier argenté homme n°20',
  21: 'Collier maille suisse doré',
  22: 'Collier multicolore',
  23: 'Bracelet multicolore',
  24: 'Collier Afrique',
  25: 'Collier croix argenté',
  26: 'Collier pendentif croix',
  27: 'Bracelet argenté à strass',
  28: 'Bracelet doré à strass',
  29: 'Bracelet maille suisse doré',
  30: 'Casquette classique noire',
  31: 'Casquette streetwear beige',
  32: 'Casquette de sport blanche',
  33: 'Puces d’oreilles argentées',
  34: 'Créoles noires',
};

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
  const titleName = productTitleNames[product.id] ?? product.name;
  const title = `${titleName} en Tunisie${brand}`;
  const description = `Découvrez « ${titleName} » en Tunisie. Livraison dans toute la Tunisie et paiement à la livraison. Consultez la fiche pour commander en ligne.`;
  return {
    title,
    description,
    path: `/produit/${product.id}-${product.slug}`,
  };
}

export function privateSeo(path, title, description) {
  return { path, title, description };
}

export { categoryTitle };
