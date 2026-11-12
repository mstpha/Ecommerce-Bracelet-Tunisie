import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Package, CreditCard, MapPin, Phone, User, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserContext } from '../../UserContext.js';
import { addOrderToUser, addCartOrdersToUser } from '../Services/userServices';
import { pushEcommerce, toAnalyticsItem } from '../../utils/analytics';
import Seo from '../../components/Seo';
import { products } from '../Data/catalog';

const Checkout = ({ clearCartItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [errors, setErrors] = useState([]);

  const { orderItems, product, quantity, isCart } = location.state || {};
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phoneNumber: user?.phone || '',
    address: user?.address || '',
    city: '',
    postalCode: ''
  });

  const [deliveryMode, setDeliveryMode] = useState('standard');
  const paymentMethod = 'cash';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const beginCheckoutSent = useRef(false);
  const orderSubmittedSent = useRef(false);

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Livraison standard',
      description: 'Livraison dans toute la Tunisie',
      price: 6,
      icon: Truck
    },
    {
      id: 'express',
      name: 'Livraison express',
      description: 'Livraison dans toute la Tunisie',
      price: 10,
      icon: Package
    }
  ];
  const paymentOptions = [
    {
      id: 'cash',

      name: 'Paiement à la livraison',
      description: 'Réglez votre commande à sa réception',
    }
  ];

  // Calculate totals
  const calculateSubtotal = () => {
    if (isCart && orderItems) {
      return orderItems.reduce((total, item) => total + (parseInt(item.price) * item.quantity), 0);
    } else if (product && quantity) {
      return product.price * quantity;
    }
    return 0;
  };

  const deliveryFee = deliveryOptions.find(opt => opt.id === deliveryMode)?.price || 6;
  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee;

  const getAnalyticsEcommerce = () => {
    let items = [];
    if (isCart && orderItems) {
      items = orderItems.map(item => toAnalyticsItem(item, { quantity: item.quantity }));
    } else if (product && quantity) {
      items = [toAnalyticsItem(product, { quantity })];
    }
    return { currency: 'TND', value: total, items };
  };

  const handleFormFocus = () => {
    if (beginCheckoutSent.current) return;
    beginCheckoutSent.current = true;
    pushEcommerce('begin_checkout', getAnalyticsEcommerce());
  };

  const trackOrderSubmitted = () => {
    if (orderSubmittedSent.current) return;
    orderSubmittedSent.current = true;
    pushEcommerce('order_submitted', getAnalyticsEcommerce());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    const currentUser = localStorage.getItem('ID');
    const validationErrors = [];

    if (!formData.full_name || !formData.phoneNumber || !formData.address || !formData.city || !formData.postalCode) {
      validationErrors.push('Veuillez remplir tous les champs de livraison.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const orderData = {
        ...formData,
        deliveryMode,
        paymentMethod,
        deliveryFee,
        subtotal,
        total,
        timestamp: new Date().toISOString()
      };
      if (isCart && orderItems) {
        const itemsList = orderItems.map((item) => {
          const catalogProduct = products.find((entry) => String(entry.id) === String(item.product_id ?? item.id));
          const name = catalogProduct?.name ?? item.product_name;
          return `${name} x${item.quantity} prix : ${parseFloat(item.price)} total : ${(parseFloat(item.price) * item.quantity).toFixed(2)}`;
        }).join('\n');
        const ordersWithData = orderItems.map((item) => {
          const catalogProduct = products.find((entry) => String(entry.id) === String(item.product_id ?? item.id));
          return {
            ...orderData,
            productId: item.product_id ?? item.id,
            product_name: catalogProduct?.name ?? item.product_name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            total: parseFloat(item.price) * item.quantity,
            name: catalogProduct?.name ?? item.name,
            displayString: itemsList
          };
        });
        await addCartOrdersToUser(currentUser, ordersWithData, itemsList);
        trackOrderSubmitted();
        clearCartItems()
        navigate("/commande/confirmation")
      } else if (product && quantity) {
        const itemsList = `${product.name} x${quantity} prix : ${product.price} total : ${(product.price * quantity).toFixed(2)}`;

        const orderItem = {
          ...orderData,
          product_name:product.name,
          productId: product.id,
          quantity: quantity,
          price: product.price,
          total: product.price * quantity,
          displayString: itemsList
        };
        await addOrderToUser(currentUser, orderItem);
        trackOrderSubmitted();
        navigate("/commande/confirmation")
      }

      toast.success('Commande confirmée avec succès !');

    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors(['Erreur lors de la confirmation de la commande']);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!orderItems && !product) {
      toast.error('Aucun article à commander.');
      navigate('/connexion');
    }
  }, [orderItems, product, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Seo
        title="Finaliser votre commande | Bracelet Tunisie"
        description="Finalisez votre commande de bracelets et accessoires en Tunisie. Renseignez vos coordonnées pour recevoir votre sélection et payer à la livraison."
        path="/commande"
        noindex
      />
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser votre commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <MapPin className="text-teal-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Informations de livraison</h2>
              </div>

              <form className="space-y-4" onFocus={handleFormFocus}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline mr-2" size={16} />
                      Nom complet
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={user?.full_name}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline mr-2" size={16} />
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                      disabled={user?.phone}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse complète
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    disabled={user?.address}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Truck className="text-teal-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Mode de livraison</h2>
              </div>

              <div className="space-y-3">
                {deliveryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.id}
                      onClick={() => setDeliveryMode(option.id)}
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryMode === option.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                        }`}
                    >
                      <div className="flex items-center">
                        <div className={`mr-4 p-2 rounded-lg ${deliveryMode === option.id ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                          <Icon size={24} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{option.name}</p>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-teal-600">{option.price} TND</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <CreditCard className="text-teal-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Mode de paiement</h2>
              </div>

              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => errors.length > 0 && setErrors([])}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === option.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                      }`}
                  >
                    <div className={`mr-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === option.id ? 'border-teal-500' : 'border-gray-300'
                      }`}>
                      {paymentMethod === option.id && (
                        <div className="w-3 h-3 bg-teal-500 rounded-full" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{option.name}</p>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">Erreur de validation</h3>
                      <ul className="space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-700">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {isCart && orderItems ? (
                  orderItems.map((item, index) => {
                    const catalogProduct = products.find((entry) => String(entry.id) === String(item.product_id ?? item.id));
                    return (
                    <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{catalogProduct?.name ?? item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {(parseFloat(item.price) * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                    );
                  })
                ) : product && quantity ? (
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantité : {quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {(product.price * quantity).toFixed(2)} TND
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-semibold">{deliveryFee.toFixed(2)} TND</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-teal-600">{total.toFixed(2)} TND</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-lg font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Confirmation en cours...' : 'Confirmer la commande'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                En confirmant, vous acceptez les conditions de la commande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
