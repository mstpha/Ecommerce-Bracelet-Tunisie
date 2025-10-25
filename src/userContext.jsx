import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUserId = parseInt(localStorage.getItem('currentUser'));
    
    if (currentUserId) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      
      const foundUser = users.find(u => u.id === parseInt(currentUserId));
      
      if (foundUser) {
        const { password, confirmPassword, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      } else {
        localStorage.removeItem('currentUser');
      }
    }
    
    setLoading(false);
  }, []);
  const login = (userId) => {
    localStorage.setItem('currentUser', userId);
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.id === parseInt(userId));
    if (foundUser) {
      const { password, confirmPassword, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};