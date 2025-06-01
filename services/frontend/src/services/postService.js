import axios from 'axios';
import API from '../api/api';

export const fetchPosts = (token) => axios.get(API.POSTS, { headers: { Authorization: `Bearer ${token}` } });

export const createPost = (token, content) => axios.post(API.POSTS, { content }, {
  headers: { Authorization: `Bearer ${token}` },
});

export const deletePost = (token, id) => axios.delete(`${API.POSTS}/${id}`, {
  headers: { Authorization: `Bearer ${token}` },
});

export const updatePost = (token, id, content) => axios.put(`${API.POSTS}/${id}`, { content }, {
  headers: { Authorization: `Bearer ${token}` },
});