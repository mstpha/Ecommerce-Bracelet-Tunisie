import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, Shield, ThumbsUp, Plus, Minus, Package, Info, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import Suggestions from '../Components/Suggestions';
import { UserContext } from '../../UserContext.js';
import { addToFavorites, getUserFavorites, removeFromFavorites } from '../Services/userServices';
import { pushEcommerce, toAnalyticsItem } from '../../utils/analytics';
import { categories, productImage, productPath } from '../Data/catalog';
import Seo from '../../components/Seo';
import Breadcrumb from '../../components/Breadcrumb';
import { productStructuredData } from '../Data/seoData';
import { productSeo } from '../Data/seoPages';

const ProductDetail = ({ addToCart, products }) => {
  const { id: routeId } = useParams();
  const id = routeId?.match(/^(\d+)(?:-|$)/)?.[1];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [psug, setPsug] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const product = products.find(p => p.id === Number(id));
  const currentUser = localStorage.getItem('ID');
  const { user } = useContext(UserContext);
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!product) return;
    const suggestions = products.filter(item => item.category === product.category && item.id !== product.id);
    function shuffleArray(array) {
      for (let i = array?.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    setPsug(shuffleArray(suggestions));

  }, [product, id, products])

  useEffect(() => {
    if (!product) return;
    pushEcommerce('view_item', {
      currency: 'TND',
      value: parseFloat(product.price),
      items: [toAnalyticsItem(product, { quantity: 1 })]
    });
  }, [product])

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
      toast.error('Connectez-vous pour ajouter cet article aux favoris');
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

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const characteristicLabels = {
    material: 'Matière',
    stone: 'Pierre',
    finish: 'Finition',
    style: 'Style',
    includes: 'Contenu',
    clasp: 'Fermoir',
    closure: 'Fermeture',
    length: 'Longueur',
    color: 'Couleur',
    diameter: 'Diamètre',
    size: 'Taille',
    adjustable: 'Réglable',
    breathable: 'Respirant',
  };
  const characteristicValues = {
    'Sterling Silver': 'Argent sterling',
    Rhinestone: 'Strass',
    Polished: 'Poli',
    Luxury: 'Style raffiné',
    'Gold Plated': 'Plaqué or',
    'Stainless Steel': 'Acier inoxydable',
    'Cartier Inspired': 'Inspiré du style Cartier',
    'Silver Tone': 'Ton argenté',
    'Gold Tone': 'Ton doré',
    'Black Tone': 'Ton noir',
    'Silver & Gold': 'Argent et or',
    'Coffee Bean Chain': 'Maille grain de café',
    'High Polish': 'Poli brillant',
    'Classic Chain': 'Chaîne classique',
    'Swiss Link': 'Maille suisse',
    'Box Clasp': 'Fermoir boîte',
    'Lobster Clasp': 'Fermoir mousqueton',
    'Magnetic Clasp': 'Fermoir magnétique',
    'Hinged Clasp': 'Fermoir articulé',
    'Push Back': 'Fermoir poussette',
    'Strap Back': 'Fermeture à sangle',
    Necklace: 'Collier',
    Bracelet: 'Bracelet',
    Watch: 'Montre',
    'Africa Map Pendant': 'Pendentif carte de l’Afrique',
    'Baseball Cap': 'Casquette classique',
    'Cross Pendant': 'Pendentif croix',
    Hoop: 'Créoles',
    'Luxury Set': 'Parure',
    'Snake Chain': 'Maille serpent',
    'Sports Cap': 'Casquette de sport',
    Streetwear: 'Style urbain',
    Stud: 'Puces',
    'Twisted Rope': 'Maille torsadée',
    'Two-Tone': 'Bicolore',
    'Cotton Blend': 'Mélange de coton',
    Polyester: 'Polyester',
    Beige: 'Beige',
    Black: 'Noir',
    White: 'Blanc',
    '15mm': '15 mm',
    '6mm': '6 mm',
  };
  const formatKey = (key) => characteristicLabels[key] ?? key;

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((item) => characteristicValues[item] ?? item).join(', ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Oui' : 'Non';
    }
    return characteristicValues[value] ?? value.replace(' inches', ' pouces');
  };

  const getAvailabilityBadge = (availability) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800 border-green-200',
      limited_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      out_of_stock: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      in_stock: 'En stock',
      limited_stock: 'Stock limité',
      out_of_stock: 'Indisponible'
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
      <div className="container mx-auto px-4 py-12">
        <Seo title="Produit introuvable | Bracelet Tunisie" description="Cette fiche produit n’est pas disponible. Découvrez les articles de notre boutique en ligne en Tunisie." path="/produit/introuvable" noindex />
        <h1 className="text-3xl font-bold text-[#4A3C31]">Produit introuvable</h1>
        <a href="/boutique" className="mt-4 inline-block text-[#1A9D8F] underline">Retour à la boutique</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#F5F5F5]">
      <Toaster />
      <Seo
        {...productSeo(product)}
        image={productImage(product)}
        imageAlt={`Photo du produit : ${product.name}`}
        type="product"
        jsonLd={productStructuredData(product)}
      />
      <Breadcrumb items={[
        { name: 'Accueil', path: '/' },
        { name: 'Boutique', path: '/boutique' },
        { name: categories[product.category].name, path: categories[product.category].path },
        { name: product.name, path: productPath(product) },
      ]} />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-1/2 overflow-hidden">
          <img
            src={productImage(product, currentImageIndex + 1)}
            alt={`Vue du produit : ${product.name}`}
            width="800"
            height="800"
            loading={currentImageIndex === 0 ? 'eager' : 'lazy'}
            fetchPriority={currentImageIndex === 0 ? 'high' : 'auto'}
            className={`w-full h-auto transition-transform duration-300 ${slideDirection}`}
            onAnimationEnd={() => setSlideDirection('')}
          />
          <button aria-label="Image précédente" onClick={prevImage} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
            <ChevronLeft size={24} />
          </button>
          <button aria-label="Image suivante" onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2">
            <ChevronRight size={24} />
          </button>
          <button
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
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
              <span className="text-base font-normal text-gray-600">Frais de livraison à partir de 6 DT</span>
            </p>

            <p className="text-lg text-[#4A3C31] mb-6 font-serif leading-relaxed">{product.description}</p>
            <section className="mb-6 rounded-lg bg-white p-4">
              <h2 className="mb-2 text-lg font-semibold text-[#4A3C31]">Livraison et paiement</h2>
              <p className="text-[#4A3C31]">Livraison dans toute la Tunisie, paiement à la livraison et confirmation de la commande par téléphone.</p>
            </section>

            {/* Product Characteristics */}
            {product.characteristics && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center mb-3">
                  <Info size={20} className="text-[#1A9D8F] mr-2" />
                  <h3 className="text-lg font-semibold text-[#4A3C31]">Détails du produit</h3>
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
              <span className="mr-4 text-lg font-medium">Quantité :</span>
              <button aria-label="Diminuer la quantité" onClick={decrementQuantity} className="bg-[#1A9D8F] text-white rounded-full p-1">
                <Minus size={20} />
              </button>
              <span className="mx-4 text-xl font-bold">{quantity}</span>
              <button aria-label="Augmenter la quantité" onClick={incrementQuantity} className="bg-[#1A9D8F] text-white rounded-full p-1">
                <Plus size={20} />
              </button>
            </div>

            <div className="flex justify-between items-center mt-8 mb-8">
              <div className="flex flex-col items-center">
                <Truck size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Livraison dans toute la Tunisie</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Informations produit consultables</p>
              </div>
              <div className="flex flex-col items-center">
                <ThumbsUp size={48} className="text-[#1A9D8F] mb-3" />
                <p className="text-base text-center font-medium max-w-[120px]">Confirmation par téléphone</p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => navigate('/commande', {
                state: {
                  product,
                  quantity,
                  isCart: false
                }
              })}
              className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600 mb-2"
            >
              Commander
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