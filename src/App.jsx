import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import { getUserById } from './app/Services/userServices';
import { UserContext } from './userContext';
import Checkout from './app/Checkout';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const { user,setUser } = useContext(UserContext);
  const navigate=useNavigate()
  const addToCart = (product, quantity) => {
    toast.success("Produit ajouté avec succès.");
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevItems, { ...product, quantity: quantity }];
    });
  };
  
  const updateCartItem = (id, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  useEffect(() => {
    const initalize = async ()=>{
      if (user) return;
      var currentUser=localStorage.getItem("ID")
      var LoggedInUser;

      if(currentUser){
        LoggedInUser = await getUserById(currentUser)

        setUser(LoggedInUser)
        if (location.pathname==="/"){
          navigate("/welcome")
        }
      }
      setProducts(productsData.products);

    }
    initalize()
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
          cartItems={cartItems} 
          updateCartItem={updateCartItem} 
          removeCartItem={removeCartItem} 
          clearCartItems={clearCartItems}
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
            <Route path="/checkout" element={<Checkout />} />
            <Route 
              path="/product/:id" 
              element={<ProductDetail addToCart={addToCart} products={products} />} 
            />
          </Routes>
        </main>

        <Footer />

      </div>
  );
}

export default App;