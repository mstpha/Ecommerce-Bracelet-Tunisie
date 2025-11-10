import React, { useState, useRef, useEffect, useContext } from 'react';
import { Menu, ShoppingCart, Search, X, Home, ShoppingBag, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ShoppingCartSideNav from './ShoppingCartSideNav';
import { UserContext } from '../userContext';
import Profile from './Profile';

const Nav = ({ setSearchTerm, clearCartItems, cartItems, updateCartItem, removeCartItem }) => {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartNavRef = useRef(null);
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const [isHommeExpanded, setIsHommeExpanded] = useState(false);
  const { user, logout, loading } = useContext(UserContext);
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
    if (!location.pathname.includes('/shop')) {
      setLocalSearchTerm('');
      setSearchTerm('');
    } else if (search) {
      setLocalSearchTerm(search);
      setSearchTerm(search);
    }
  }, [location, setSearchTerm]);

  const handleSearch = () => {
    setSearchTerm(localSearchTerm);
    if (localSearchTerm) {
      navigate(`/shop?search=${encodeURIComponent(localSearchTerm)}`);
    } else {
      navigate('/shop');
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
      <nav className="bg-[#4A3C31] text-[#F5F2E9] p-4 w-full relative">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Menu className="cursor-pointer" onClick={() => setIsSideNavOpen(true)} />
            <ShoppingCart className="cursor-pointer" onClick={() => setIsCartOpen(true)} />
          </div>

          <div className="flex-grow max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-[#F5F2E9] text-[#4A3C31] rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]"
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                value={localSearchTerm}
              />
              <Search
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A3C31] cursor-pointer"
                onClick={handleSearch}
              />

            </div>
          </div>
          <span className="flex items-center gap-2">
            <span
              className="text-[#1A9D8F] font-semibold underline decoration-2 underline-offset-4 hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              {user?.fullName}
            </span>
           {user ? (
  <LogOut
    size={18}
    className="hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
    onClick={(e) => {
      e.stopPropagation();
      logout();
    }}
  />
) : (
  <span
    className="text-[#1A9D8F] font-semibold underline decoration-2 underline-offset-4 hover:text-[#3CD6C5] transition-colors duration-300 cursor-pointer"
    onClick={() => navigate('/')}
  >
    Login
  </span>
)}

          </span>

        </div>
      </nav>

      {/* Overlay */}
      {isSideNavOpen && (
        <div className="fixed inset-0  bg-opacity-50 z-40" onClick={() => setIsSideNavOpen(false)}></div>
      )}

      {/* Side Navbar */}
      <div
        ref={sideNavRef}
        className={`fixed top-0 left-0 h-full w-64 bg-[#4A3C31] text-[#F5F2E9] transform transition-transform duration-300 ease-in-out z-50 ${isSideNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo section */}
        <div className="h-56 bg-[url('/logo.jfif')] bg-center bg-cover bg-no-repeat relative">
          <X
            className="absolute top-4 right-4 cursor-pointer text-[#F5F2E9] bg-[#4A3C31] rounded-full p-1"
            onClick={() => setIsSideNavOpen(false)}
          />
        </div>

        {/* Menu items */}
        <ul className="mt-8 px-4">
          <li className="mb-6">
            <div to="/welcome" className="flex items-center text-lg cursor-pointer hover:text-[#1A9D8F]" onClick={() => {
              navigate("/welcome")
              setIsSideNavOpen(false)
            }}>
              <Home className="mr-4" size={24} />
              Main Page
            </div>
          </li>
          <li className="mb-6">
            <div
              className="flex items-center text-lg hover:text-[#1A9D8F] cursor-pointer transition-colors duration-300"
              onClick={toggleShopExpanded}
            >
              <ShoppingBag className="mr-4" size={24} />
              Shop
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
                      navigate("/shop")
                      setIsSideNavOpen(false)
                    }}
                  >
                    <ShoppingBag className="mr-4" size={24} />
                    Shop

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
                    Category
                  </div>
                  {isHommeExpanded && (
                    <ul className="mt-2 ml-4 space-y-2">
                      {['Bracelet', 'Cap', 'Necklace', 'Earring'].map((item) => (<li key={item}>
                        <div
                          className="text-sm hover:text-[#1A9D8F] block py-1 px-2 ml-4 rounded transition-colors duration-300 hover:bg-[#4A3C31]"
                          onClick={() => {
                            navigate(`/shop/category/${item.toLowerCase()}`)
                            setIsSideNavOpen(false)
                          }}
                        >
                          {item}
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
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}

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