import React, { useState, forwardRef, useContext } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { addCartOrdersToUser } from '../Services/userServices';
import { UserContext } from '../../userContext';
import { useNavigate } from 'react-router-dom';



const ShoppingCartSideNav = forwardRef(({ isOpen, setIsOpen, cartItems, updateCartItem, removeCartItem }, ref) => {
  const [formData, setFormData] = useState({ fullName: '', phoneNumber: '', address: '' });
  const { user, setUser } = useContext(UserContext)
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.price;
      return total + price * item.quantity;
    }, 0);
    return (subtotal + 6).toFixed(2);
  };
  const navigate = useNavigate()

  const getDisplayCharacteristics = (item) => {
    if (!item.characteristics) return [];

    const chars = [];
    const { color, material, style, size } = item.characteristics;

    if (color) chars.push({ label: 'Color', value: color });
    if (size) chars.push({ label: 'Size', value: size });
    if (material) chars.push({ label: 'Material', value: material });
    if (style) chars.push({ label: 'Style', value: style });

    return chars.slice(0, 2);
  };

  return (
    <>
      <div
        ref={ref}
        className={`fixed top-0 right-0 h-full w-80 bg-[#4A3C31] text-[#F5F2E9] transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
          } overflow-y-auto`}
      >
        <div className="sticky top-0 bg-[#4A3C31] z-10 p-4 flex justify-between items-center border-b border-[#F5F2E9]">
          <h2 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2" /> Shopping Cart
          </h2>
          <X
            className="cursor-pointer hover:text-[#1A9D8F] transition-colors"
            onClick={() => setIsOpen(false)}
          />
        </div>
        <ul className="mt-4 px-4">
          {cartItems?.map((item) => (
            <li key={item.id} className="mb-4 p-2 bg-[#5B4D3D] rounded-lg">
              <div className="flex gap-3 mb-2">
                <img
                  src={`/${item.id}/1.webp`}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder.png';
                  }}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <span className="text-[#1A9D8F] font-semibold">{item.price} TND</span>

                  {getDisplayCharacteristics(item).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {getDisplayCharacteristics(item).map((char, index) => (
                        <div key={index} className="text-xs text-[#F5F2E9]/80">
                          <span className="font-semibold">{char.label}:</span> {char.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
                <button onClick={() => removeCartItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove item
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="sticky bottom-0 bg-[#4A3C31] p-4 border-t border-[#F5F2E9]">
          <div className="mb-2 text-xl font-bold">
            Total: {cartItems.length > 0 ? calculateTotal() : 0} TND

          </div>
          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/checkout', {
                state: {
                  orderItems: cartItems,
                  isCart: true
                }
              });
            }}
            className="w-full bg-[#1A9D8F] text-white font-bold py-2 px-4 rounded hover:bg-[#158275] transition-colors"
            disabled={cartItems.length === 0}
          >
            Confirm Cart orders
          </button>
        </div>
      </div>

    </>
  );
});

export default ShoppingCartSideNav;