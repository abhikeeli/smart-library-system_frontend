import React, {
  createContext,
  useState,
  useEffect
} from 'react';

import api from '../api/axiosConfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  // Load saved user when application starts
  useEffect(() => {

    const savedUser = localStorage.getItem('user');

    if (savedUser && savedUser !== "undefined") {
      setUser(JSON.parse(savedUser));
    }

  }, []);


  // Get latest user information from backend
  const refreshUser = async () => {

    try {

      const token = localStorage.getItem('token');

      // Don't make request if user isn't logged in
      if (!token) {
        return;
      }

      const response = await api.get('/auth/me');

      const updatedUser = response.data.user;

      console.log(
        "User score refreshed:",
        updatedUser.creditScore
      );

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

    } catch (err) {

      console.error(
        "Could not refresh user session",
        err
      );

    }
  };


  // Automatically synchronize user data
  // from backend every 10 seconds
  useEffect(() => {

    if (!user) {
      return;
    }

    // Immediately get latest data
    refreshUser();

    const interval = setInterval(() => {
      refreshUser();
    }, 10000);

    return () => {
      clearInterval(interval);
    };

  }, [user]);


  const login = (userData, token) => {

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

    localStorage.setItem(
      'token',
      token
    );

    setUser(userData);
  };


  const logout = () => {

    localStorage.clear();

    setUser(null);
  };


  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        refreshUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

