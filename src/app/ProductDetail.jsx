import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, ThumbsUp, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Suggestions from './Suggestions';
import { UserContext } from '../userContext';
import { addOrderToUser } from './Services/userServices';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', address: '' });
  const [quantity, setQuantity] = useState(1);
  const [confirmdisable, setConfirmDisable] = useState(false);
  const [psug, setPsug] = useState([]);
  const product = products.find(p => p.id === parseInt(id));
  const currentUser = parseInt(localStorage.getItem('currentUser'));
  const { user,setUser } = useContext(UserContext);
  
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

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setConfirmDisable(true);

    const itemsList = `${product.name} x${quantity} prix: ${product.price} Total: ${(product.price * quantity).toFixed(2)}`;

    // Get current user ID from localStorage

    if (!currentUser) {
      console.error('No user logged in');
      setConfirmDisable(false);
      return;
    }

    try {

      const orderItem = {
        productId: product.id,
        quantity: quantity,
        price: product.price+6,
        total: product.price * quantity,
        displayString: itemsList,
        timestamp: new Date().toISOString()
      };
      var UserOrderApplied = await addOrderToUser(currentUser,orderItem);
      if (UserOrderApplied){
        setUser(UserOrderApplied)
        toast.success('Order added successfully');
        setShowConfirmModal(false)
      }
      setFormData({ 
        fullName: user.fullName?user.fullName:'', 
        phoneNumber: user.phoneNumber?user.phoneNumber:'',
        address: user.address?user.address: '' })
      setConfirmDisable(false)
    } catch (error) {
      console.error('Error updating user orders:', error);
      setConfirmDisable(false);
    }
  };

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
              onClick={() => setShowConfirmModal(true)}
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600 mb-2"
            >
              Acheter maintenant
            </button>
            <button
              className="w-full bg-[#1A9D8F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#157A6E]"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>



      {showConfirmModal && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-11/12">
            <h2 className="text-xl font-bold mb-3">Confirmer la commande</h2>
            <form onSubmit={handleConfirm}>
              <input
                type="text"
                name="fullName"
                placeholder="Nom complet"
                value={user.fullName?user.fullName:formData.fullName}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
                disabled={user.fullName?true:false}
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Numéro de téléphone"
                value={user.phone?user.phone:formData.phoneNumber}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
                disabled={user.phone?true:false}
              />
              <textarea
                name="address"
                placeholder="Adresse"
                value={user.address? user.address : formData.address}
                onChange={handleInputChange}
                className="mb-2 w-full p-2 border rounded"
                required
                disabled={user.address? true:false}
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A9D8F] text-white rounded"
                  disabled={confirmdisable}
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Suggestions suggestions={psug.slice(0, 5)} />

    </div>
  );
};

export default ProductDetail;