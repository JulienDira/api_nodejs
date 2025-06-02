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

export const updateUserProfile = async (token, profileData) => {
  try {
    const response = await axios.put(
      `${API.AUTH}/profile`,
      {
        userName: profileData.userName,
        email: profileData.email
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    throw error.response?.data || error;
  }
};

export const changeUserPassword = async (token, passwordData) => {
  try {
    const response = await axios.put(
      `${API.AUTH}/changePassword`,
      {
        userName: passwordData.userName,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error.response?.data || error;
  }
};

export const getUserProfile = async (token) => {
  try {
    const response = await axios.get(
      `${API.AUTH}/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error.response?.data || error;
  }
};

export const deleteUserAccount = async (token) => {
  try {
    const response = await axios.delete(
      `${API.AUTH}}/account`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    throw error.response?.data || error;
  }
};