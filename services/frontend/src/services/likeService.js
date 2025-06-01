import axios from 'axios';
import API from '../api/api';

export const likePost = (token, postId) => {
  return axios.post(
    API.LIKES,
    { postId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikePost = (token, postId) => {
  return axios.delete(
    `${API.LIKES}/${postId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getLikesByPost = (token, postId) => {
  return axios.get(`${API.LIKES}/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const countLikesByPost = (token, postId) => {
  return axios.get(`${API.LIKES}/count/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
