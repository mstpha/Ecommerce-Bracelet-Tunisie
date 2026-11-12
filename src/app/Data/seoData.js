import { categories, productImage, productPath } from './catalog';
import { SITE_NAME, SITE_URL } from '../../config/seo';

export function homeStructuredData() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.jfif`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'fr-TN',
    },
  ];
}

export function breadcrumbStructuredData(items) {
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

export function collectionStructuredData(products, category) {
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
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: product.name,
          url: `${SITE_URL}${productPath(product)}`,
        })),
      },
    },
    breadcrumbStructuredData([
      { name: 'Accueil', path: '/' },
      ...(category ? [{ name: 'Boutique', path: '/boutique' }] : []),
      ...(category ? [{ name: categories[category].name, path: collectionPath }] : []),
    ]),
  ];
}

export function productStructuredData(product) {
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
    breadcrumbStructuredData([
      { name: 'Accueil', path: '/' },
      { name: 'Boutique', path: '/boutique' },
      { name: category.name, path: category.path },
      { name: product.name, path: productPath(product) },
    ]),
  ];
}
