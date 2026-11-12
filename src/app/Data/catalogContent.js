const productNames = {
  1: 'Collier et bracelet argentés à strass',
  2: 'Collier et bracelet dorés à strass',
  3: 'Collier et bracelet style Cartier argentés',
  4: 'Collier et bracelet style Cartier dorés',
  5: 'Collier et bracelet chaîne grain de café',
  6: 'Collier doré pour homme',
  7: 'Collier et bracelet maille suisse argentés',
  8: 'Collier maille suisse argenté',
  9: 'Collier chaîne grain de café argenté',
  10: 'Collier torsadé doré',
  11: 'Collier style Cartier argenté',
  12: 'Collier style Cartier doré',
  13: 'Parure collier, bracelet et montre dorée à strass',
  14: 'Parure collier, bracelet et montre argentée à strass',
  15: 'Collier argenté à strass',
  16: 'Collier doré à strass',
  17: 'Collier argenté pour homme',
  18: 'Bracelet serpent argenté',
  19: 'Bracelet serpent doré',
  20: 'Collier argenté pour homme, modèle 20',
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
  33: 'Boucles d’oreilles puces argentées',
  34: 'Boucles d’oreilles créoles noires',
};

export const categories = {
  bracelet: {
    name: 'Bracelets',
    path: '/boutique/categorie/bracelets',
    keyword: 'bracelets homme et femme en Tunisie',
    intro: 'Explorez notre sélection de bracelets en Tunisie et parcourez les modèles présentés dans cette catégorie. Chaque fiche vous permet de consulter le nom de l’article, son prix et les images disponibles avant de faire votre choix. Retrouvez des bracelets pour homme, ainsi que des références dont l’intitulé précise leur couleur ou leur style. Les informations affichées sont limitées aux données du catalogue ; consultez les visuels pour observer chaque modèle et vérifiez les détails indiqués sur sa page. Ajoutez votre sélection au panier ou ouvrez une fiche pour préparer une commande. La livraison est proposée dans toute la Tunisie et le paiement s’effectue à la livraison.',
  },
  cap: {
    name: 'Casquettes',
    path: '/boutique/categorie/casquettes',
    keyword: 'casquette Tunisie',
    intro: 'Parcourez notre sélection de casquettes en Tunisie et découvrez les références réunies dans cette catégorie. Les fiches présentent le nom de chaque modèle, son prix et les photos disponibles pour vous aider à comparer leur apparence. Vous trouverez notamment des casquettes dont le nom indique une couleur ou un style, sans supposer de caractéristiques supplémentaires. Avant de choisir, ouvrez la page du produit et examinez ses images ainsi que les informations affichées. Vous pouvez ensuite sélectionner l’article et préparer votre commande en ligne. La livraison est proposée dans toute la Tunisie et le paiement s’effectue à la livraison, après confirmation de la commande par téléphone.',
  },
  necklace: {
    name: 'Colliers',
    path: '/boutique/categorie/colliers',
    keyword: 'collier Tunisie',
    intro: 'Découvrez notre sélection de colliers en Tunisie et explorez les modèles présentés dans cette catégorie. Chaque fiche regroupe le nom du produit, son prix et ses images afin de vous permettre d’examiner l’article avant votre choix. La sélection comprend des références pour homme et des modèles dont le nom mentionne un style, une couleur ou des éléments associés. Consultez la page de chaque collier pour retrouver les informations fournies au catalogue et visualiser ses photos. Ajoutez ensuite votre sélection au panier ou passez directement à la commande. La livraison est proposée dans toute la Tunisie et le paiement s’effectue à la livraison après confirmation téléphonique.',
  },
  earring: {
    name: 'Boucles d’oreilles',
    path: '/boutique/categorie/boucles-d-oreilles',
    keyword: 'boucles d’oreilles Tunisie',
    intro: 'Retrouvez notre sélection de boucles d’oreilles en Tunisie dans cette catégorie dédiée. Les fiches produits indiquent le nom de chaque référence, son prix et les images disponibles pour vous permettre d’en observer l’apparence. Les intitulés précisent certains éléments tels que la couleur ou le type de modèle lorsqu’ils figurent dans le catalogue. Pour choisir en connaissance de cause, consultez les photos et les détails de la fiche concernée ; aucune caractéristique non indiquée n’est supposée. Vous pouvez ensuite ajouter le produit au panier et préparer votre commande. La livraison est proposée dans toute la Tunisie, avec paiement à la livraison et confirmation de la commande par téléphone.',
  },
};

const categoryNames = {
  bracelet: 'bracelet',
  cap: 'casquette',
  necklace: 'collier',
  earring: 'boucles d’oreilles',
};

export function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function productSlug(product) {
  return slugify(product.name);
}

export function productPath(product) {
  return `/produit/${product.id}-${productSlug(product)}`;
}

export function productImage(product, imageNumber = 1) {
  return `/images/${productSlug(product)}-tunisie-${String(imageNumber).padStart(2, '0')}.webp`;
}

function descriptionFor(product) {
  const category = categoryNames[product.category];
  const article = category === 'boucles d’oreilles' ? 'une paire de' : 'un modèle de';
  return `Cette fiche présente « ${product.name} », ${article} ${category} de notre sélection en Tunisie. Son intitulé permet d’identifier la référence présentée, tandis que les images de cette fiche vous aident à examiner son apparence avant votre choix. Les informations disponibles sont volontairement limitées aux éléments fournis pour ce produit ; aucune autre caractéristique ne doit être supposée. Consultez la galerie et le prix affiché, puis choisissez la quantité souhaitée pour préparer votre demande. Après l’envoi de la commande, notre équipe vous contacte par téléphone pour la confirmer. La livraison est proposée dans toute la Tunisie et le paiement s’effectue à la livraison.`;
}

export function buildProduct(item) {
  const product = { ...item, name: productNames[item.id] ?? item.name };
  return {
    ...product,
    description: descriptionFor(product),
    descriptor: `À découvrir dans notre sélection de ${categoryNames[product.category]}`,
    slug: productSlug(product),
  };
}

export function categoryPath(category) {
  return categories[category]?.path ?? '/boutique';
}

export function categoryTitle(category) {
  return categories[category]?.name ?? 'Boutique';
}

export function categorySeoDescription(category) {
  const name = categoryTitle(category).toLowerCase();
  return `Découvrez nos ${name} en Tunisie. Parcourez les modèles et commandez facilement, avec livraison dans toute la Tunisie et paiement à la livraison.`;
}
