import axios from 'axios';
import API from '../api/api';

// Auth classique
export const login = (credentials) => axios.post(`${API.AUTH}/login`, credentials);
export const register = (credentials) => axios.post(`${API.AUTH}/register`, credentials);

// Mot de passe oublié
export const forgotPassword = (email) =>
  axios.post(`${API.AUTH}/forgot-password`, { email });

export const resetPassword = (token, newPassword) =>
  axios.post(`${API.AUTH}/reset-password/${token}`, { newPassword });