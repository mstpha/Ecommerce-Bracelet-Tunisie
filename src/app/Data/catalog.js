import source from './products.json';
import { buildProduct, categories, categoryPath, categorySeoDescription, categoryTitle, productImage, productPath, productSlug, slugify } from './catalogContent.js';

export {
  categories,
  categoryPath,
  categorySeoDescription,
  categoryTitle,
  productImage,
  productPath,
  productSlug,
  slugify,
};

export const products = source.products.map(buildProduct);
