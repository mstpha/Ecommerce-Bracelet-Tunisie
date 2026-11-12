import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favoriteChange,setFavoriteChange]=useState(false);
  const navigate=useNavigate()
  const logout = () => {
    localStorage.removeItem('ID');
    localStorage.removeItem('auth_token');
    setUser(null);
    navigate("/")
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout,favoriteChange,setFavoriteChange }}>
      {children}
    </UserContext.Provider>
  );
};
