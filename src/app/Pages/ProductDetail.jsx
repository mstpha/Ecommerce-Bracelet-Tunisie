import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, ThumbsUp, Plus, Minus, Package, Info, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Suggestions from '../Components/Suggestions';
import { UserContext } from '../../userContext';
import { addOrderToUser, addReview, addToFavorites, getReviews, getUserFavorites, removeFromFavorites } from '../Services/userServices';
import LoadingTruck from '../Components/Loader';

const ProductDetail = ({ addToCart, products }) => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [formData, setFormData] = useState({ full_name: '', phoneNumber: '', address: '' });
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [confirmdisable, setConfirmDisable] = useState(false);
  const [psug, setPsug] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const product = products.find(p => p.id === parseInt(id));
  const currentUser = localStorage.getItem('ID');
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate()
  let suggestions = [];

  useEffect(() => {
    window.scrollTo(0, 0);

    suggestions = products.filter(item => item.category === product.category);
    function shuffleArray(array) {
      for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    setPsug(shuffleArray(suggestions));

    const fetchReviews = async () => {
      const productReviews = await getReviews(id);
      setReviews(productReviews);
    };
    fetchReviews();


  }, [product, id])

  useEffect(()=>{
    const isFavorited = async ()=>{
      const productS = products.find(p => p.id === parseInt(id));

      if (!productS) return;

      const faves=await getUserFavorites(localStorage.getItem('ID'))
      const isInFavorites = faves?.some(fav => fav.product_id === String(productS.id));
      setIsFavorite(isInFavorites);
    }
    if (user) {
      isFavorited()
    }
  })
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        const updatedUser = await removeFromFavorites(currentUser, parseInt(id));
        if (updatedUser) {
          setIsFavorite(false);
        }
      } else {
        const updatedUser = await addToFavorites(currentUser, product);
        if (updatedUser) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };


  const nextImage = () => {
    if (slideDirection) return;
    setSlideDirection('next');
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.imageCount);
      setSlideDirection('');
    }, 300);
  };

  const prevImage = () => {
    if (slideDirection) return;
    setSlideDirection('prev');
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.imageCount) % product.imageCount);
      setSlideDirection('');
    }, 300);
  };

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      toast.error('Please write a review');
      return;
    }

    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    const result = await addReview(id, user.full_name, reviewText);
    if (result) {
      setReviews(result.reviews);
      setReviewText('');
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const formatKey = (key) => {
    return key?.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value;
  };

  const getAvailabilityBadge = (availability) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800 border-green-200',
      limited_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      in_stock: 'In Stock',
      limited_stock: 'Limited Stock',
      out_of_stock: 'Out of Stock'
    };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${styles[availability] || styles.in_stock}`}>
        <Package size={16} className="mr-1.5" />
        {labels[availability] || labels.in_stock}
      </span>
    );
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="transform scale-150 sm:scale-200 md:scale-300 lg:scale-400">
          <LoadingTruck />
        </div>
      </div>
    );
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
          <button
            onClick={handleToggleFavorite}
            className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-110 transition-transform"
          >
            <Star
              size={24}
              className={`${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'} transition-colors`}
            />
          </button>
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A3C31] mb-2">{product.name}</h1>




            {/* Availability Badge */}
            <div className="mb-4">
              {getAvailabilityBadge(product.availability)}
            </div>

            <p className="text-2xl font-bold text-[#1A9D8F] mb-4">
              {product.price} DT
              <br />
              <span className="text-base font-normal text-gray-600">+ 6DT Delivery</span>
            </p>

            <p className="text-lg text-[#4A3C31] mb-6 font-serif leading-relaxed">{product.description}</p>

            {/* Product Characteristics */}
            {product.characteristics && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Info size={20} className="text-[#1A9D8F] mr-2" />
                  <h3 className="text-lg font-semibold text-[#4A3C31]">Product Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.characteristics).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {formatKey(key)}
                      </span>
                      <span className="text-sm font-semibold text-[#4A3C31] mt-0.5">
                        {formatValue(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center mb-4">
              <span className="mr-4 text-lg font-medium">Quantity:</span>
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
                <p className="text-base text-center font-medium max-w-[120px]">Fast Delivery 48 Hours</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Assured Quality</p>
              </div>
              <div className="flex flex-col items-center">
                <ThumbsUp size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Guaranteed Satisfaction</p>
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
              Buy now
            </button>
            <button
              onClick={() => addToCart(product, quantity)}
              className="w-full bg-[#1A9D8F] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-[#157A6E]"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#4A3C31]">Customer Reviews</h2>
          {reviews?.length > 0 && (
            <div className="flex items-center gap-2 bg-[#1A9D8F] text-white px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{reviews?.length} Reviews</span>
            </div>
          )}
        </div>

        <div className="mb-8 bg-gradient-to-br from-[#1A9D8F]/5 to-[#1A9D8F]/10 rounded-xl p-6 border border-[#1A9D8F]/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-[#1A9D8F] rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#4A3C31] mb-1">Share Your Experience</h3>
              <p className="text-sm text-gray-600">Help others by sharing your thoughts on this product</p>
            </div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here... What did you like? How was the quality?"
            className="w-full p-4 text-sm border-2 border-gray-200 rounded-xl mb-3 focus:ring-2 focus:ring-[#1A9D8F] focus:border-[#1A9D8F] transition-all resize-none"
            rows="4"
          />
          <button
            onClick={handleAddReview}
            className="bg-[#1A9D8F] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#157A6E] transition-all hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Post Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews?.length > 0 ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-sm font-medium text-gray-500">All Reviews</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {reviews?.map((review, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 border border-gray-100 hover:border-[#1A9D8F]/30 hover:shadow-md transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#1A9D8F] to-[#157A6E] rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-lg">
                          {review?.user_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base text-[#4A3C31]">{review?.user_name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(review?.created_at).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{review?.review_message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 text-sm">
                Be the first to share your experience with this product!
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1A9D8F;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #157A6E;
        }
      `}</style>

      <Suggestions suggestions={psug.slice(0, 15)} />
    </div>
  );
};

export default ProductDetail;