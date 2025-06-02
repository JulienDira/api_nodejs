import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { login, register } from '../services/authService'; // ⬅️ ajoute register ici

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const loginUser = async (form) => {
    const { data } = await login(form);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(jwtDecode(data.token));
  };

  const registerUser = async (form) => {
    const { data } = await register(form);
    return data;
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  return { token, user, loginUser, logoutUser, registerUser, updateUser };
};
