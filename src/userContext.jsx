import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading,setLoading }}>
      {children}
    </UserContext.Provider>
  );
};