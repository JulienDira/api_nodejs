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
    const { data } = await register(form); // ⬅️ utilise ton service
    return data; // tu peux aussi gérer le token ici si ton API en renvoie un
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return { token, user, loginUser, logoutUser, registerUser }; // ⬅️ expose registerUser
};
