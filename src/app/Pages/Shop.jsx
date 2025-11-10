import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import productsData from '../Data/products.json';
import ShopItem from '../Components/ShopItem';
import Suggestions from '../Components/Suggestions';
import Loader from '../Components/Loader';

const Shop = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const { gender, category } = useParams();
  const [items, setItems] = useState([]);
  const [sortedItems, setSortedItems] = useState([]);
  const [sortOrder, setSortOrder] = useState('none');
  const [ratingFilter, setRatingFilter] = useState('all');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    console.log(search)
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
    let filteredItems = productsData.products;

    if (gender) {
      filteredItems = filteredItems.filter(item => item.gender === gender);
    }

    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category);
    }

    setItems(filteredItems);
    setSortedItems(filteredItems);
  }, [gender, category]);

  useEffect(() => {
    let filtered = items;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
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
    setRatingFilter('all');
  };

  const handleRatingFilter = (ratingValue) => {
    setRatingFilter(ratingValue);
    if (ratingValue === 'all') {
      setSortedItems(items);
      return;
    }
    const filteredByRating = items.filter(
      item => Math.floor(parseFloat(item.rating)) === parseInt(ratingValue)
    );
    setSortedItems(filteredByRating);
  };

  const truncateDescription = (description, maxLength = 60) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">

        <div className="transform scale-150 sm:scale-200 md:scale-300 lg:scale-400">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#4A3C31] mb-6">Shop</h2>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <Suggestions suggestions={shuffleArray(productsData.products).slice(0, 15)} />

        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => sortByPrice('asc')}
            className={`px-4 py-2 text-sm font-medium border border-[#1A9D8F] rounded-l-lg 
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300 ${sortOrder === 'asc' ? 'ring-2 ring-[#1A9D8F]' : ''}`}
          >
            Low to High
          </button>

          <button
            onClick={() => sortByPrice('desc')}
            className={`px-4 py-2 text-sm font-medium border-t border-b border-[#1A9D8F] 
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300 ${sortOrder === 'desc' ? 'ring-2 ring-[#1A9D8F]' : ''}`}
          >
            High to Low
          </button>

          <select
            value={ratingFilter}
            onChange={(e) => handleRatingFilter(e.target.value)}
            className="px-4 py-2 text-sm font-medium border-t border-b border-[#1A9D8F] 
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300 cursor-pointer appearance-none"
          >
            <option value="all">All Ratings</option>
            <option value="1">1★ & Up</option>
            <option value="2">2★ & Up</option>
            <option value="3">3★ & Up</option>
            <option value="4">4★ & Up</option>
            <option value="5">5★ Only</option>
          </select>

          <button
            onClick={resetOrder}
            className={`px-4 py-2 text-sm font-medium border border-[#1A9D8F] rounded-r-lg
              text-white bg-[#1A9D8F] hover:bg-white hover:text-[#1A9D8F] 
              focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]
              transition-colors duration-300`}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedItems.map((item) => (
          <ShopItem key={item.id} item={item} truncateDescription={truncateDescription} />
        ))}
      </div>
    </div>
  );
};

export default Shop;