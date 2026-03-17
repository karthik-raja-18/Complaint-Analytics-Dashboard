import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set the default Authorization header natively in Axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      // Decrypt or reconstruct basic user mock if not full fledged lookup API
      // Or in a real app, call /api/auth/me
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (email, password) => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const res = await axios.post(`${API_BASE}/auth/register`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
