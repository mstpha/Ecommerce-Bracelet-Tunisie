import React, { useState, useEffect, useContext } from 'react';
import { User, Phone, MapPin, Edit3, ShoppingBag, Calendar, X } from 'lucide-react';
import { UserContext } from '../userContext';
import { updateUser } from './Services/userServices';
import toast from 'react-hot-toast';

const Profile = ({ onClose }) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const { user, setUser, loading } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setEditedPhone(user.phone ?? '');
      setEditedAddress(user.address ?? '');
    }
  }, [user]);

  const saveUserData = (updatedUser) => {
    try {
      const currentUser = parseInt(localStorage.getItem('currentUser'));
      const updatedUserReturn = updateUser(currentUser,updatedUser)
      if (updatedUserReturn){
        toast.success("User Updated Successfully!");
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

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-11/12">
          <div className="text-center">
            <p className="text-lg">Utilisateur non trouvé</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-[#1A9D8F] text-white rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#4A3C31]">Mon Profil</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info Section */}
        <div className="bg-[#F5F5F5] p-6 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-[#1A9D8F] rounded-full p-3 mr-4">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#4A3C31]">{user.fullName}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between mb-4 p-3 bg-white rounded">
            <div className="flex items-center">
              <Phone size={20} className="text-[#1A9D8F] mr-3" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                {isEditingPhone ? (
                  <input
                    type="tel"
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    className="border-b-2 border-[#1A9D8F] focus:outline-none"
                    placeholder="Entrez votre numéro"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium">
                    {user.phone || 'Non renseigné'}
                  </p>
                )}
              </div>
            </div>
            {isEditingPhone ? (
              <button
                onClick={handleSavePhone}
                className="text-[#1A9D8F] text-sm font-medium"
              >
                Sauvegarder
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

          {/* Address */}
          <div className="flex items-center justify-between p-3 bg-white rounded">
            <div className="flex items-center">
              <MapPin size={20} className="text-[#1A9D8F] mr-3" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                {isEditingAddress ? (
                  <textarea
                    value={editedAddress}
                    onChange={(e) => setEditedAddress(e.target.value)}
                    className="border-b-2 border-[#1A9D8F] focus:outline-none w-full resize-none"
                    placeholder="Entrez votre adresse"
                    rows="2"
                    autoFocus
                  />
                ) : (
                  <p className="font-medium">
                    {user.address || 'Non renseignée'}
                  </p>
                )}
              </div>
            </div>
            {isEditingAddress ? (
              <button
                onClick={handleSaveAddress}
                className="text-[#1A9D8F] text-sm font-medium"
              >
                Sauvegarder
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

        {/* Orders Section */}
        <div>
          <div className="flex items-center mb-4">
            <ShoppingBag size={24} className="text-[#1A9D8F] mr-2" />
            <h3 className="text-xl font-bold text-[#4A3C31]">Mes Commandes</h3>
          </div>

          {user.orders.length === 0 ? (
            <div className="text-center py-8 bg-[#F5F5F5] rounded-lg">
              <ShoppingBag size={48} className="text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {user.orders.map((order, index) => (
                <div key={index} className="bg-[#F5F5F5] p-4 rounded-lg border-l-4 border-[#1A9D8F]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-[#4A3C31]">
                        {order.displayString || `Commande #${index + 1}`}
                      </p>
                      {order.name && (
                        <p className="text-sm text-gray-600">{order.name}</p>
                      )}
                    </div>
                    <p className="font-bold text-[#1A9D8F]">
                      {order.total?.toFixed(2)} DT
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {order.timestamp ? formatDate(order.timestamp) : 'Date non disponible'}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">Quantité:</span>
                      <span className="font-medium">{order.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#1A9D8F] text-white rounded-lg font-medium hover:bg-[#157A6E] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;