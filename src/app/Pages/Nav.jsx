import React, { useState, useRef, useEffect, useContext } from 'react';
import { Menu, ShoppingCart, Search, X, Home, ShoppingBag, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ShoppingCartSideNav from './ShoppingCartSideNav';
import { UserContext } from '../../UserContext.js';
import Profile from './Profile';
import { pushEvent } from '../../utils/analytics';
import { categories } from '../Data/catalog';

const Nav = ({ setSearchTerm, clearCartItems, cartItems, updateCartItem, removeCartItem }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartNavRef = useRef(null);
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const [isHommeExpanded, setIsHommeExpanded] = useState(false);
  const { user, logout } = useContext(UserContext);
  const [showProfile, setShowProfile] = useState(false);
  const sideNavRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sideNavRef.current && !sideNavRef.current.contains(event.target)) {
        setIsSideNavOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (!location.pathname.includes('/boutique')) {
      setLocalSearchTerm('');
      setSearchTerm('');
    } else if (search) {
      setLocalSearchTerm(search);
      setSearchTerm(search);
    }
  }, [location, setSearchTerm]);

  const handleSearch = () => {
    if (localSearchTerm.trim()) {
      pushEvent('search', { search_term: localSearchTerm.trim().toLowerCase() });
    }
    setSearchTerm(localSearchTerm);
    if (localSearchTerm) {
      navigate(`/boutique?search=${encodeURIComponent(localSearchTerm)}`);
    } else {
      navigate('/boutique');
    }
  };

  const toggleShopExpanded = () => {
    setIsShopExpanded(!isShopExpanded);
    if (!isShopExpanded) {
      setIsHommeExpanded(false);
    }
  };

  const toggleHommeExpanded = () => {
    setIsHommeExpanded(!isHommeExpanded);
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setLocalSearchTerm(newSearchTerm);
  };

  return (
    <>
      <header>
      <nav aria-label="Navigation principale" className="bg-[#4A3C31] text-[#F5F2E9] p-4 w-full relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button type="button" aria-label="Ouvrir le menu" onClick={() => setIsSideNavOpen(true)}>
              <Menu className="cursor-pointer" />
            </button>
            <button type="button" aria-label="Ouvrir le panier" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="cursor-pointer" />
            </button>
        <button type="button" onClick={() => navigate('/boutique')} className="flex items-center cursor-pointer space-x-1">
          <ShoppingBag size={24} />
          <span>Boutique</span>
        </button>
          </div>

          <div className="flex-grow max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                aria-label="Rechercher un produit"
                className="w-full bg-[#F5F2E9] text-[#4A3C31] rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]"
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                value={localSearchTerm}
              />
              <button type="button" aria-label="Rechercher" onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A3C31]">
                <Search className="cursor-pointer" />
              </button>

            </div>
          </div>
          <span className="flex items-center gap-2">
            <span
              className="text-[#1A9D8F] font-semibold underline decoration-2 underline-offset-4 hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
              onClick={() => setShowProfile(true)}
              aria-label="Ouvrir le profil"
            >
              {user?.full_name}
            </span>
            {user ? (
              <LogOut
                size={18}
                aria-label="Se déconnecter"
                role="button"
                className="hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  logout();
                }}
              />
            ) : (
              <span
                className="text-[#1A9D8F] font-semibold underline decoration-2 underline-offset-4 hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
                onClick={() => navigate('/connexion')}
              >
                Connexion
              </span>
            )}

          </span>

        </div>
      </nav>
      </header>

      {isSideNavOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-40" onClick={() => setIsSideNavOpen(false)}></div>
      )}

      <div
        ref={sideNavRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#4A3C31] text-[#F5F2E9] transform transition-transform duration-300 ease-in-out z-50 ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="h-56 bg-[url('/logo.jfif')] bg-center bg-cover bg-no-repeat relative">
          <X
            aria-label="Fermer le menu"
            role="button"
            className="absolute top-4 right-4 cursor-pointer text-[#F5F2E9] bg-[#4A3C31] rounded-full p-1"
            onClick={() => setIsSideNavOpen(false)}
          />
        </div>

        <ul className="mt-8 px-4">
          <li className="mb-6">
            <div to="/" className="flex items-center text-lg cursor-pointer hover:text-[#1A9D8F]" onClick={() => {
              navigate("/")
              setIsSideNavOpen(false)
            }}>
              <Home className="mr-4" size={24} />
              Accueil
            </div>
          </li>
          <li className="mb-6">
            <div
              className="flex items-center text-lg hover:text-[#1A9D8F] cursor-pointer transition-colors duration-300"
              onClick={toggleShopExpanded}
            >
              <ShoppingBag className="mr-4" size={24} />
              Boutique
              {isShopExpanded ? (
                <ChevronDown className="ml-2" size={20} />
              ) : (
                <ChevronRight className="ml-2" size={20} />
              )}
            </div>
            {isShopExpanded && (
              <ul className="mt-4 ml-4 bg-[#3A2C21] rounded-md p-3">
                <li className="my-2">
                  <div
                    className="flex items-center text-md hover:text-[#1A9D8F] cursor-pointer transition-colors duration-300 pb-2"
                    onClick={() => {
                      navigate("/boutique")
                      setIsSideNavOpen(false)
                    }}
                  >
                    <ShoppingBag className="mr-4" size={24} />
                    Boutique

                  </div>
                  <div
                    className="flex items-center text-md hover:text-[#1A9D8F] cursor-pointer transition-colors duration-300"
                    onClick={toggleHommeExpanded}
                  >
                    {isHommeExpanded ? (
                      <ChevronDown className="mr-2" size={20} />
                    ) : (
                      <ChevronRight className="mr-2" size={20} />
                    )}
                    Catégories
                  </div>
                  {isHommeExpanded && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {Object.entries(categories).map(([key, category]) => (<li key={key}>
                        <div
                          className="text-sm hover:text-[#1A9D8F] block py-1 px-2 ml-4 rounded transition-colors duration-300 hover:bg-[#4A3C31]"
                          onClick={() => {
                            navigate(category.path)
                            setIsSideNavOpen(false)
                          }}
                        >
                          {category.name}
                        </div>
                      </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
      {showProfile && <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />}

      <ShoppingCartSideNav
        isOpen={isCartOpen}
        setIsOpen={setIsCartOpen}
        cartItems={cartItems}
        updateCartItem={updateCartItem}
        removeCartItem={removeCartItem}
        clearCartItems={clearCartItems}
        ref={cartNavRef}
      />
    </>
  );
};

export default Nav;