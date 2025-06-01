import axios from 'axios';
import API from '../api/api';

export const likePost = (token, postId) => {
  return axios.post(
    `${API.LIKES}/like/${postId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const unlikePost = (token, postId) => {
  return axios.delete(
    `${API.LIKES}/like/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
