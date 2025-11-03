import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, ThumbsUp, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Suggestions from './Suggestions';
import { UserContext } from '../userContext';
import { addOrderToUser } from './Services/userServices';

const ProductDetail = ({ addToCart, products }) => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', address: '' });
  const [quantity, setQuantity] = useState(1);
  const [confirmdisable, setConfirmDisable] = useState(false);
  const [psug, setPsug] = useState([]);
  const product = products.find(p => p.id === parseInt(id));
  const currentUser = localStorage.getItem('ID');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate()
  let suggestions = [];
  useEffect(() => {

    window.scrollTo(0, 0);

    suggestions = products.filter(item => item.category === product.category);
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    setPsug(shuffleArray(suggestions));

  }, [product])
  const nextImage = () => {
    setSlideDirection('slide-left');
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imageCount);
  };

  const prevImage = () => {
    setSlideDirection('slide-right');
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imageCount) % product.imageCount);
  };



  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#F5F5F5]">
      <Toaster />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 overflow-hidden">
          <img
            src={`/${product.folder}/${currentImageIndex + 1}.webp`}
            alt={product.name}
            className={`w-full h-auto transition-transform duration-300 ${slideDirection}`}
            onAnimationEnd={() => setSlideDirection('')}
          />
          <button onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A3C31] mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-[#1A9D8F] mb-4">
              {product.price}
              <br /> 6DT Livraison.
            </p>
            <p className="text-lg text-[#4A3C31] mb-4 font-serif leading-relaxed">{product.description}</p>

            <div className="flex items-center mb-4">
              <span className="mr-4 text-lg font-medium">Quantité:</span>
              <button onClick={decrementQuantity} className="bg-[#1A9D8F] text-white rounded-full p-1">
                <Minus size={20} />
              </button>
              <span className="mx-4 text-xl font-bold">{quantity}</span>
              <button onClick={incrementQuantity} className="bg-[#1A9D8F] text-white rounded-full p-1">
                <Plus size={20} />
              </button>
            </div>

            <div className="flex justify-between items-center mt-8 mb-8">
              <div className="flex flex-col items-center">
                <Truck size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Livraison rapide 48 heures</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Qualité assurée</p>
              </div>
              <div className="flex flex-col items-center">
                <ThumbsUp size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Satisfaction garantie</p>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate('/checkout', {
                state: {
                  product,
                  quantity,
                  isCart: false
                }
              })}
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600 mb-2"
            >
              Acheter maintenant
            </button>
            <button
              onClick={() => addToCart(product, quantity)}
              className="w-full bg-[#1A9D8F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#157A6E]"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      <Suggestions suggestions={psug.slice(0, 15)} />

    </div>
  );
};

export default ProductDetail;