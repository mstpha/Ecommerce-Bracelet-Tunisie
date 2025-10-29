import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Nav from './app/Nav';
import ProductDetail from './app/ProductDetail';
import Shop from './app/Shop';
import Welcome from './app/Welcome';
import productsData from './products.json';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import Login from './app/Login';
import Register from './app/Register';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);




  useEffect(() => {
    setProducts(productsData.products);
  }, []);

  const removeCartItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCartItems = () => {
    setCartItems([]);
  };
  const location =useLocation();

  return (
    
      <div className="flex flex-col min-h-screen">
        <Toaster />
      {(location.pathname !== '/' && location.pathname!=="/register") && (
        <Nav 
          setSearchTerm={setSearchTerm} 
        />
      )}
      
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="register" element={<Register/>}/>
            <Route path="/welcome" element={<Welcome />} />
            <Route 
              path="/shop" 
              element={<Shop searchTerm={searchTerm} setSearchTerm={setSearchTerm} products={products} />} 
            />
            <Route 
              path="/shop/:gender/:category" 
              element={<Shop searchTerm={searchTerm} setSearchTerm={setSearchTerm} products={products} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetail products={products} />} 
            />
          </Routes>
        </main>

        <Footer />

      </div>
  );
}

export default App;