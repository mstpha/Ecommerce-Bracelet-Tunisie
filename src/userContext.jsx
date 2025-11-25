import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserById } from './app/Services/userServices';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favoriteChange,setFavoriteChange]=useState(false);
  const navigate=useNavigate()
  const logout = () => {
    localStorage.removeItem('ID');
    setUser(null);
    navigate("/")
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout,favoriteChange,setFavoriteChange }}>
      {children}
    </UserContext.Provider>
  );
};