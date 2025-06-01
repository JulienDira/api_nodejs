import { useState } from 'react';
import * as jwtDecode from 'jwt-decode';
import { login } from '../services/authService';

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? jwtDecode.default(token) : null);

  const loginUser = async (form) => {
    const { data } = await login(form);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(jwtDecode.default(data.token));
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { token, user, loginUser, logoutUser };
};
