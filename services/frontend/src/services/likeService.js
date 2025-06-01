// services/likeService.js

import axios from 'axios';

const LIKE_URL = import.meta.env.VITE_LIKE_URL;

export const likePost = (token, postId) => {
  return axios.post(
    `${LIKE_URL}/like/${postId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const unlikePost = (token, postId) => {
  return axios.delete(
    `${LIKE_URL}/like/${postId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
