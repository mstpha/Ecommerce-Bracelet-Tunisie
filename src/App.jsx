import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Nav from './app/Pages/Nav';
import ProductDetail from './app/Pages/ProductDetail';
import Shop from './app/Pages/Shop';
import Welcome from './app/Pages/Welcome';
import productsData from './app/Data/products.json'
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import Login from './app/Pages/Login';
import Register from './app/Pages/Register';
import { 
  getUserById, 
  addToUserCart, 
  updateUserCartItem, 
  removeFromUserCart, 
  clearUserCart 
} from './app/Services/userServices';
import { UserContext } from './userContext';
import Checkout from './app/Pages/Checkout';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const addToCart = async (product, quantity) => {
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

    if (user?.id) {
      try {
        const updatedUser = await addToUserCart(user.id, product, quantity);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error syncing cart:', error);
      }
    }
  };
  
  const updateCartItem = async (id, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0)
    );

    if (user?.id) {
      try {
        const updatedUser = await updateUserCartItem(user.id, id, newQuantity);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error syncing cart update:', error);
      }
    }
  };

  const removeCartItem = async (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));

    if (user?.id) {
      try {
        const updatedUser = await removeFromUserCart(user.id, id);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error syncing cart removal:', error);
      }
    }
  };

  const clearCartItems = async () => {
    setCartItems([]);

    if (user?.id) {
      try {
        const updatedUser = await clearUserCart(user.id);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error syncing cart clear:', error);
      }
    }
  };

  useEffect(() => {
    const initalize = async () => {
      if (user) {
        setCartItems(user.cartItems || []);
        return;
      }
      
      const currentUser = localStorage.getItem("ID");
      let LoggedInUser;

      if (currentUser) {
        LoggedInUser = await getUserById(currentUser);
        setUser(LoggedInUser);
        
        setCartItems(LoggedInUser?.cartItems || []);
        
        if (location.pathname === "/") {
          navigate("/welcome");
        }
      }
      
      setProducts(productsData.products);
    }
    initalize();
  }, []);

  useEffect(() => {
    if (user?.cartItems) {
      setCartItems(user.cartItems);
    }
  }, [user?.id]);

  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      {(location.pathname !== '/' && location.pathname !== "/register") && (
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
            path="/shop/category/:category" 
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