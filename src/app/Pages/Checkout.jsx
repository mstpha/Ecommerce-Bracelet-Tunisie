import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, Package, CreditCard, MapPin, Phone, User, ArrowLeft, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { UserContext } from '../../userContext';
import { addOrderToUser, addCartOrdersToUser } from '../Services/userServices';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [CC, setCC] = useState(0)
  const [CVV, setCVV] = useState(0)
  const [EndDate, setEndDate] = useState("")
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
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: '48 hours',
      price: 6,
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: '24 hours',
      price: 10,
      icon: Package
    }
  ];
  const paymentOptions = [
    {
      id: 'cash',

      name: 'Cash on Delivery',

      description: 'Pay in cash upon receipt'

    },

    {
      id: 'card',

      name: 'Credit Card',

      description: 'Secure Card Payment'

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
      validationErrors.push('Please fill in all delivery fields');
    }

    if (paymentMethod === 'card') {
      if (!CC || !EndDate || !CVV) {
        validationErrors.push('Please fill in all bank card details');
      } else {
        if (CC.toString().replace(/\s/g, '').length < 13 || CC.toString().replace(/\s/g, '').length > 19) {
          validationErrors.push('Carte number invalid');
        }

        if (CVV.toString().length < 3 || CVV.toString().length > 4) {
          validationErrors.push('CVV invalide');
        }

        if (!/^\d{2}\/\d{2}$/.test(EndDate)) {
          validationErrors.push('Expiration Date invalid (MM/AA)');
        }
      }
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
        const itemsList = orderItems.map(item =>
          `${item.product_name} x${item.quantity} prix: ${parseInt(item.price)} Total: ${(parseInt(item.price) * item.quantity).toFixed(2)}`
        ).join('\n');
        const ordersWithData = orderItems.map(item => ({
          ...orderData,
          productId: item.product_id,
          product_name:item.product_name,
          quantity: item.quantity,
          price: parseInt(item.price),
          total: parseInt(item.price) * item.quantity,
          name: item.name,
          displayString: itemsList
        }));
        const updatedUser = await addCartOrdersToUser(currentUser, ordersWithData, itemsList);
        navigate("/shop")
      } else if (product && quantity) {
        const itemsList = `${product.name} x${quantity} prix: ${product.price} Total: ${(product.price * quantity).toFixed(2)}`;

        const orderItem = {
          ...orderData,
          product_name:product.name,
          productId: product.id,
          quantity: quantity,
          price: product.price,
          total: product.price * quantity,
          displayString: itemsList
        };
        const updatedUser = await addOrderToUser(currentUser, orderItem);
        navigate("/shop")
      }

      toast.success('Order confirmed successfully!');

    } catch (error) {
      console.error('Error submitting order:', error);
      setErrors(['Erreur lors de la confirmation de la commande']);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!orderItems && !product) {
      toast.error('No articles bought');
      navigate('/login');
    }
  }, [orderItems, product, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Return
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalize your order</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <MapPin className="text-teal-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Delivery information</h2>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline mr-2" size={16} />
                      Full name
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
                      Phone number
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
                    Full address
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
                      City
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
                      Postal code
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
                <h2 className="text-2xl font-bold text-gray-900">Delivery type</h2>
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
                <h2 className="text-2xl font-bold text-gray-900">Payment type</h2>
              </div>

              <div className="space-y-3">
                {paymentOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => {
                      setPaymentMethod(option.id);
                      if (errors.length > 0) setErrors([]);
                    }}
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

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-4">Card information</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={CC}
                      placeholder="Numéro de carte"
                      onChange={(e) => {
                        setCC(e.target.value);
                        if (errors.length > 0) setErrors([]);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={EndDate}
                        placeholder="MM/AA"
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          if (errors.length > 0) setErrors([]);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={CVV}
                        onChange={(e) => {
                          setCVV(e.target.value);
                          if (errors.length > 0) setErrors([]);
                        }}
                        placeholder="CVV"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Summary</h2>

              {errors.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">Valiation Error</h3>
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

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {isCart && orderItems ? (
                  orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {(parseInt(item.price) * item.quantity).toFixed(2)} TND
                      </p>
                    </div>
                  ))
                ) : product && quantity ? (
                  <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">Quantity: {quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      {(product.price * quantity).toFixed(2)} TND
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sub-total</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} TND</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
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
                By confirming, you accept our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;