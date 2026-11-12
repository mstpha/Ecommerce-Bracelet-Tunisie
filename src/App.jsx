import { lazy, Suspense, useState, useEffect, useContext } from 'react';
import { Route, Routes, useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import Nav from './app/Pages/Nav';
import { products, productPath, categories } from './app/Data/catalog';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Footer from './Footer';
import { 
  getUserById, 
  addToUserCart, 
  updateUserCartItem, 
  removeFromUserCart, 
  clearUserCart, 
  getUserCart
} from './app/Services/userServices';
import { UserContext } from './UserContext.js';
import usePageView from './hooks/usePageView';
import { pushEcommerce, toAnalyticsItem } from './utils/analytics';

const ProductDetail = lazy(() => import('./app/Pages/ProductDetail'));
const Shop = lazy(() => import('./app/Pages/Shop'));
const Welcome = lazy(() => import('./app/Pages/Welcome'));
const Login = lazy(() => import('./app/Pages/Login'));
const Register = lazy(() => import('./app/Pages/Register'));
const Checkout = lazy(() => import('./app/Pages/Checkout'));
const OrderConfirmation = lazy(() => import('./app/Pages/OrderConfirmation'));
const NotFound = lazy(() => import('./app/Pages/NotFound'));

function LegacyProductRedirect() {
  const { id } = useParams();
  const product = products.find((item) => item.id === Number(id));
  return product ? <Navigate to={productPath(product)} replace /> : <Navigate to="/boutique" replace />;
}

function LegacyCategoryRedirect() {
  const { category } = useParams();
  const categoryKey = Object.keys(categories).find((key) => key === category.toLowerCase());
  return <Navigate to={categories[categoryKey]?.path ?? '/boutique'} replace />;
}

function App() {
  usePageView();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const addToCart = async (product, quantity) => {
    toast.success("Article ajouté au panier");
    
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
    pushEcommerce('add_to_cart', {
      currency: 'TND',
      value: parseFloat(product.price) * quantity,
      items: [toAnalyticsItem(product, { quantity })]
    });
    let userCart;
    if (user?.id) {
      try {
        await addToUserCart(user.id, product, quantity);
        userCart = await getUserCart(localStorage.getItem('ID'));
        setCartItems(userCart)
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
        await updateUserCartItem(user.id, id, newQuantity);
      } catch (error) {
        console.error('Error syncing cart update:', error);
      }
    }
  };

  const removeCartItem = async (id) => {

    if (user) {
      try {
        await removeFromUserCart(localStorage.getItem('ID'), id);
        const userCart = await getUserCart(localStorage.getItem('ID'));
        setCartItems(userCart)
      } catch (error) {
        console.error('Error syncing cart removal:', error);
      }
    }
  };

  const clearCartItems = async () => {
    setCartItems([]);

    if (user?.id) {
      try {
        await clearUserCart(user.id);
      } catch (error) {
        console.error('Error syncing cart clear:', error);
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (user) {
        return;
      }
      let cartOrders=[];
      const currentUser = localStorage.getItem("ID");
      let LoggedInUser;
      if (currentUser) {
        LoggedInUser = await getUserById(currentUser);
        setUser(LoggedInUser);
        cartOrders= await getUserCart(currentUser)
        setCartItems(cartOrders || []);
        
        if (location.pathname === "/connexion" || location.pathname === "/inscription") {
          navigate("/");
        }
      }
    }
    initialize();
  }, [location.pathname, navigate, setUser, user]);

  const privatePages = ['/connexion', '/inscription'];

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      {!privatePages.includes(location.pathname) && (
        <Nav 
          setSearchTerm={setSearchTerm} 
          cartItems={cartItems} 
          updateCartItem={updateCartItem} 
          removeCartItem={removeCartItem} 
          clearCartItems={clearCartItems}
        />
      )}
      
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-screen" aria-label="Chargement" />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/boutique" element={<Shop searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
            <Route path="/boutique/categorie/:category" element={<Shop searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
            <Route path="/produit/:id" element={<ProductDetail addToCart={addToCart} products={products} />} />
            <Route path="/commande" element={<Checkout clearCartItems={clearCartItems} />} />
            <Route path="/commande/confirmation" element={<OrderConfirmation />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="/shop" element={<Navigate to="/boutique" replace />} />
            <Route path="/shop/category/:category" element={<LegacyCategoryRedirect />} />
            <Route path="/product/:id" element={<LegacyProductRedirect />} />
            <Route path="/checkout" element={<Navigate to="/commande" replace />} />
            <Route path="/login" element={<Navigate to="/connexion" replace />} />
            <Route path="/register" element={<Navigate to="/inscription" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
