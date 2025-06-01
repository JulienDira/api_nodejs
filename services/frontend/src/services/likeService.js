import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'; // Base API

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const likePost = (token, postId) => {
  return axiosInstance.post(
    '/likes',
    { postId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unlikePost = (token, postId) => {
  return axiosInstance.delete(
    `/likes/${postId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const getLikesByPost = (token, postId) => {
  return axiosInstance.get(`/likes/post/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const countLikesByPost = (token, postId) => {
  return axiosInstance.get(`/likes/count/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
