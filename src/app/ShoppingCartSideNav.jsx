import React, { useState, forwardRef } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';



const ShoppingCartSideNav = forwardRef(({ isOpen, setIsOpen, cartItems, updateCartItem, removeCartItem }, ref) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.price;
      return total + price * item.quantity;
    }, 0);
    return (subtotal + 6).toFixed(2); // Add 6 DT to the subtotal
  };


const handleConfirm = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const itemsList = cartItems.map(item => {
    const price = item.price;
    return `${item.name} x${item.quantity} prix: ${price} Total: ${(price * item.quantity).toFixed(2)}`;
  }).join('\n');

  // Get current user ID from localStorage
  const currentUser = parseInt(localStorage.getItem('currentUser'));
  
  if (!currentUser) {
    console.error('No user logged in');
    setIsSubmitting(false);
    return;
  }

  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Find the current user
    const userIndex = users.findIndex(user => user.id === currentUser);
    
    if (userIndex === -1) {
      console.error('User not found');
      setIsSubmitting(false);
      return;
    }

    // Create order items from cart
    const orderItems = cartItems.map(item => ({
      displayString:itemsList,
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
      name: item.name, // Store name for easy reference
      timestamp: new Date().toISOString()
    }));

    // Update user's orders
    const updatedUsers = [...users];
    if (!updatedUsers[userIndex].orders) {
      updatedUsers[userIndex].orders = [];
    }
    
    // Add all order items to user's orders
    updatedUsers[userIndex].orders.push(...orderItems);
    
    // Save updated users back to localStorage
    setIsSubmitting(false);
    setShowConfirmModal(false);
        
  } catch (error) {
    console.error('Error updating user orders:', error);
    setIsSubmitting(false);
  }
};

  return (
    <>
      <div
        ref={ref}
        className={`fixed top-0 right-0 h-full w-80 bg-[#4A3C31] text-[#F5F2E9] transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="sticky top-0 bg-[#4A3C31] z-10 p-4 flex justify-between items-center border-b border-[#F5F2E9]">
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2" /> Panier
          </h2>
          <X
            className="cursor-pointer hover:text-[#1A9D8F] transition-colors"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <ul className="mt-4 px-4">
          {cartItems?.map((item) => (
            <li key={item.id} className="mb-4 p-2 bg-[#5B4D3D] rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{item.name}</span>
                <span className="text-[#1A9D8F]">{item.price}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-[#4A3C31] rounded-full">
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)} className="p-1 hover:bg-[#3A2C21] rounded-l-full">
                    <Minus size={16} />
                  </button>
                  <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)} className="p-1 hover:bg-[#3A2C21] rounded-r-full">
                    <Plus size={16} />
                  </button>
                </div>
                <button onClick={() => removeCartItem(item.id)} className="text-red-500 hover:text-red-700">
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0 bg-[#4A3C31] p-4 border-t border-[#F5F2E9]">
          <div className="mb-2 text-xl font-bold">
            Total: {cartItems.length>0?calculateTotal():0} TND
            
          </div>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full bg-[#1A9D8F] text-white font-bold py-2 px-4 rounded hover:bg-[#158275] transition-colors"
            disabled={cartItems.length === 0}
          >
            Confirmer la commande
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-11/12">
            <h2 className="text-2xl font-bold mb-4 text-[#4A3C31]">Confirmer la commande</h2>
            <form onSubmit={handleConfirm}>
              <input
                type="text"
                name="fullName"
                placeholder="Nom complet"
                value={formData.fullName}
                onChange={handleInputChange}
                className="mb-3 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]"
                required
              />
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Numéro de téléphone"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mb-3 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]"
                required
              />
              <textarea
                name="address"
                placeholder="Adresse"
                value={formData.address}
                onChange={handleInputChange}
                className="mb-3 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#1A9D8F]"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1A9D8F] text-white rounded hover:bg-[#158275] transition-colors"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirmation...' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

export default ShoppingCartSideNav;