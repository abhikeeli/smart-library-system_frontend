import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axiosConfig';


export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Start as null (logged out)

  // When the app loads, check if the user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const refreshUser = async () => {
    try {
      // Axios automatically sends the token from localStorage via interceptors
      const response = await api.get('/auth/me'); 
      const updatedUser = response.data.user;
      console.log(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log("User score refreshed:", updatedUser.creditScore);
    } catch (err) {
      console.error("Could not refresh user session", err);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout ,refreshUser}}>
      {children}
    </UserContext.Provider>
  );
};