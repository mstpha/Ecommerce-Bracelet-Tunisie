import React, { useState, useEffect, useContext } from 'react';
import { User, Phone, MapPin, Edit3, ShoppingBag, Calendar, X, Mail, Heart, Star } from 'lucide-react';
import { UserContext } from '../../userContext';
import { getUserById, getUserFavorites, getUserOrders, removeFromFavorites, updateUser } from '../Services/userServices';
import toast from 'react-hot-toast';
import LoadingTruck from '../Components/Loader';

const Profile = ({ isOpen,onClose }) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedName, setEditedName] = useState('');
  const { user, setUser, loading,favoriteChange,setFavoriteChange } = useContext(UserContext);
  const [favorites,setFavorites]=useState([])
  const [orders,setOrders]=useState([])
  useEffect(() => {
    let favs=[];
    let ords=[];
    const getOrders = async ()=>{
      ords= await getUserOrders(localStorage.getItem('ID'));
      setOrders(ords)
    }
    const getFaves = async ()=>{
      favs= await getUserFavorites(localStorage.getItem('ID'));
      setFavorites(favs)
    }
    if (user) {
      setEditedPhone(user.phone ?? '');
      setEditedAddress(user.address ?? '');
      setEditedEmail(user.email ?? '');
      setEditedName(user.full_name ?? '');
      getOrders()
      getFaves()
    }
  }, [user]);

  const saveUserData = (updatedUser) => {
    try {
      const currentUser = localStorage.getItem('ID');
      const updatedUserReturn = updateUser(currentUser, updatedUser)
      if (updatedUserReturn) {

        setUser(prev => ({ ...prev, ...updatedUser }));
      }

    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleSavePhone = () => {
    if (editedPhone.trim()) {
      saveUserData({ phone: editedPhone.trim() });
    }
    setIsEditingPhone(false);
  };

  const handleSaveAddress = () => {
    if (editedAddress.trim()) {
      saveUserData({ address: editedAddress.trim() });
    }
    setIsEditingAddress(false);
  };

  const handleSaveEmail = () => {
    if (editedEmail.trim()) {
      saveUserData({ email: editedEmail.trim() });
    }
    setIsEditingEmail(false);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      saveUserData({ full_name: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const handleRemoveFavorite = async (productId) => {
    try {
      const currentUser = localStorage.getItem('ID');
      const updatedUserFaves = await removeFromFavorites(currentUser, productId);
      let updatedUser= await getUserById(localStorage.getItem('ID'))
      let favs=[];
      if (updatedUserFaves) {
        setUser(updatedUser)
        favs= await getUserFavorites(localStorage.getItem('ID'));
        setFavorites(favs)
        setFavoriteChange(!favoriteChange)
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };



  if (!user && isOpen==true) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="transform scale-150 sm:scale-200 md:scale-300 lg:scale-400">
          <LoadingTruck />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto border-4 border-[#1A9D8F] shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4A3C31]">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-[#1A9D8F] rounded-full p-3 mr-4">
              <User size={24} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-xl font-bold border-b-2 border-[#1A9D8F] focus:outline-none bg-transparent max-w-full"
                    placeholder="Entrez votre nom"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveName}
                    className="text-[#1A9D8F] text-sm font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#4A3C31] break-words overflow-hidden">{user.full_name}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-gray-500 hover:text-[#1A9D8F]"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-white rounded">
            <div className="flex items-center flex-1 min-w-0">
              <Mail size={20} className="text-[#1A9D8F] mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Email</p>
                {isEditingEmail ? (
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="border-b-2 border-[#1A9D8F] focus:outline-none w-full"
                    placeholder="Entrez votre email"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium break-words overflow-hidden">
                    {user.email || 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>
            {isEditingEmail ? (
              <button
                onClick={handleSaveEmail}
                className="text-[#1A9D8F] text-sm font-medium ml-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="text-gray-500 hover:text-[#1A9D8F]"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4 p-3 bg-white rounded">
            <div className="flex items-center flex-1 min-w-0">
              <Phone size={20} className="text-[#1A9D8F] mr-3" />

              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Phone</p>
                {isEditingPhone ? (
                  <input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="border-b-2 border-[#1A9D8F] focus:outline-none w-full max-w-full"
                    placeholder="Entrez votre numéro"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium break-words overflow-hidden">
                    {user.phone || 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>
            {isEditingPhone ? (
              <button
                onClick={handleSavePhone}
                className="text-[#1A9D8F] text-sm font-medium ml-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingPhone(true)}
                className="text-gray-500 hover:text-[#1A9D8F]"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded">
            <div className="flex items-center flex-1 min-w-0">
              <MapPin size={20} className="text-[#1A9D8F] mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">Adress</p>

                {isEditingAddress ? (
                  <textarea
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    className="border-b-2 border-[#1A9D8F] focus:outline-none w-full resize-none max-w-full"
                    placeholder="Entrez votre adresse"
                    rows="2"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium break-words overflow-hidden">
                    {user.address || 'Non renseignée'}
                  </p>
                )}
              </div>
            </div>
            {isEditingAddress ? (
              <button
                onClick={handleSaveAddress}
                className="text-[#1A9D8F] text-sm font-medium ml-2"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="text-gray-500 hover:text-[#1A9D8F]"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Heart size={24} className="text-[#1A9D8F] mr-2" />
            <h3 className="text-xl font-bold text-[#4A3C31]">My Favorites</h3>
          </div>

          {(!favorites || favorites.length === 0) ? (
            <div className="text-center py-8 bg-[#F5F5F5] rounded-lg">
              <Heart size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No favorite products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar p-2">
              {favorites.map((favorite) => (
                <div key={favorite.id} className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group">
                  <div
                    className="cursor-pointer"
                    onClick={() => onProductClick && onProductClick(favorite.id)}
                  >
                    <div className="aspect-square relative">
                      <img
                        src={`/${favorite.folder}/1.webp`}
                        alt={favorite.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm text-[#4A3C31] mb-1 truncate">
                        {favorite.product_name}
                      </h4>
                      <p className="text-[#1A9D8F] font-bold text-sm">
                        {favorite.price} DT
                      </p>
                      {favorite.rating && (
                        <div className="flex items-center mt-1">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 ml-1">{favorite.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.product_id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove from favorites"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center mb-4">
            <ShoppingBag size={24} className="text-[#1A9D8F] mr-2" />
            <h3 className="text-xl font-bold text-[#4A3C31]">My Orders</h3>
          </div>

          {orders?.length === 0 ? (
            <div className="text-center py-8 bg-[#F5F5F5] rounded-lg">
              <ShoppingBag size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No Orders for the moment</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {orders?.map((order, index) => (
                <div key={index} className="bg-[#F5F5F5] p-4 rounded-lg border-l-4 border-[#1A9D8F]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[#4A3C31]">
                        {order.display_string || `Commande #${index + 1}`}
                      </p>
                      {order.product_name && (
                        <p className="text-sm text-gray-600">{order.product_name}</p>
                      )}
                    </div>
                    <p className="font-bold text-[#1A9D8F]">
                      {parseInt(order?.total).toFixed(2)} DT
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {order.created_at ? formatDate(order.created_at) : 'Date non disponible'}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">Quantity:</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1A9D8F] text-white rounded-lg font-medium hover:bg-[#157A6E] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;