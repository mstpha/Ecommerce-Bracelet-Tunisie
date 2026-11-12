import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ShopItem from '../Components/ShopItem';
import Suggestions from '../Components/Suggestions';
import LoadingTruck from '../Components/Loader';
import { pushEcommerce, toAnalyticsItem } from '../../utils/analytics';
import { categories, categoryTitle, products } from '../Data/catalog';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';
import { collectionStructuredData } from '../Data/seoData';
import { categorySeo, shopSeo } from '../Data/seoPages';

const Shop = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const { category: categorySlug } = useParams();
  const category = categorySlug
    ? Object.keys(categories).find((key) => categories[key].path.endsWith(categorySlug))
    : undefined;
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [location, setSearchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filteredItems = products;
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    setItems(filteredItems);
    setSortedItems(filteredItems);

    if (category && filteredItems?.length) {
      pushEcommerce('view_item_list', {
        item_list_id: category,
        item_list_name: categories[category].name,
        items: filteredItems.map((p, index) => toAnalyticsItem(p, { index }))
      });
    }
  }, [category]);

  useEffect(() => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setSortedItems(filtered);
    setSortOrder('none');
  }, [items, searchTerm]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const sortByPrice = (order) => {
    setSortedItems(prevItems => {
      const sorted = [...prevItems].sort((a, b) => {
        const priceA = a.discount ? parseFloat(a.discount) : parseFloat(a.price);
        const priceB = b.discount ? parseFloat(b.discount) : parseFloat(b.price);
        return order === 'asc' ? priceA - priceB : priceB - priceA;
      });
      return sorted;
    });
    setSortOrder(order);
  };

  const resetOrder = () => {
    setSortedItems(items);
    setSortOrder('none');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="transform scale-150 sm:scale-200 md:scale-300 lg:scale-400">
          <LoadingTruck />
        </div>
      </div>
    );
  }

  const pageSeo = category ? categorySeo(category) : shopSeo;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        {...pageSeo}
        jsonLd={collectionStructuredData(items, category)}
      />
      {category && (
        <Breadcrumb items={[
          { name: 'Accueil', path: '/' },
          { name: 'Boutique', path: '/boutique' },
          { name: categories[category].name, path: pageSeo.path },
        ]} />
      )}
      <h1 className="text-2xl font-bold text-[#4A3C31] mb-6">
        {category
          ? category === 'bracelet' ? 'Bracelets homme et femme en Tunisie'
            : `${categoryTitle(category)} en Tunisie`
          : 'Notre boutique de bracelets et accessoires'}
      </h1>
      {category && (
        <p className="text-[#4A3C31] leading-relaxed mb-8">{categories[category].intro}</p>
      )}

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Suggestions suggestions={shuffleArray(products).slice(0, 15)} />

        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => sortByPrice('asc')}
            className={`px-4 py-2 text-sm font-medium border border-[#1A9D8F] rounded-l-lg 
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300 ${sortOrder === 'asc' ? 'ring-2 ring-[#1A9D8F]' : ''}`}
          >
            Prix croissant
          </button>

          <button
            onClick={() => sortByPrice('desc')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-[#1A9D8F] 
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300 ${sortOrder === 'desc' ? 'ring-2 ring-[#1A9D8F]' : ''}`}
          >
            Prix décroissant
          </button>

          <button
            onClick={resetOrder}
            className={`px-4 py-2 text-sm font-medium border border-[#1A9D8F] rounded-r-lg
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300`}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedItems.map((item, index) => (
          <ShopItem key={item.id} item={item} eager={index === 0} />
        ))}
      </div>
      <section className="mt-10 rounded-lg bg-white p-6 text-[#4A3C31]">
        <h2 className="mb-2 text-xl font-semibold">Livraison et paiement</h2>
        <p>Livraison dans toute la Tunisie, paiement à la livraison et confirmation de la commande par téléphone.</p>
      </section>
    </div>
  );
};

export default Shop;