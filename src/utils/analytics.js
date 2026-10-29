import productsData from '../app/Data/products.json';

export function pushEvent(event, params = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });
  } catch {
    // Tracking must never break the app
  }
}

export function pushEcommerce(event, ecommerce) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce });
  } catch {
    // Tracking must never break the app
  }
}

// Builds a GA4 item from a catalog product or a server cart item
// (cart items use product_id / product_name and may lack a category).
export function toAnalyticsItem(item, extra = {}) {
  const id = item?.product_id ?? item?.id;
  const catalogProduct = productsData.products.find(p => String(p.id) === String(id));
  return {
    item_id: String(id),
    item_name: item?.product_name ?? item?.name ?? catalogProduct?.name,
    item_category: item?.category ?? catalogProduct?.category,
    price: parseFloat(item?.price) || 0,
    ...extra
  };
}
