import axios from 'axios';
import API from '../api/api';

export const login = (credentials) => axios.post(`${API.AUTH}/login`, credentials);
export const register = (credentials) => axios.post(`${API.AUTH}/register`, credentials);
