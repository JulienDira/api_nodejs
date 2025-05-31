import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import LoginPage from './pages/LoginPage';
import PostsPage from './pages/PostsPage';
import { login, register } from './services/authService';
import { createPost, fetchPosts, deletePost } from './services/postService';
import { likePost, unlikePost } from './services/likeService';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);
  const [view, setView] = useState(token ? 'posts' : 'login');
  const [form, setForm] = useState({ userName: '', password: '', content: '' });
  const [posts, setPosts] = useState([]);

  const fetchAllPosts = async () => {
    const { data } = await fetchPosts(token);
    setPosts(data);
  };

  useEffect(() => {
    if (token) fetchAllPosts();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const { data } = await login(form);
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(jwtDecode(data.token));
      setView('posts');
    } catch {
      alert('Login failed');
    }
  };

  const handleRegister = async () => {
    try {
      await register(form);
      alert('Compte créé. Vous pouvez maintenant vous connecter.');
    } catch {
      alert('Inscription échouée');
    }
  };

  const handleCreatePost = async () => {
    const { data } = await createPost(token, form.content);
    setPosts([data, ...posts]);
    setForm({ ...form, content: '' });
  };

  const handleDelete = async id => {
    await deletePost(token, id);
    setPosts(posts.filter(p => p._id !== id));
  };

  const handleLike = async id => {
    await likePost(token, id);
    fetchAllPosts();
  };

  const handleUnlike = async id => {
    await unlikePost(token, id);
    fetchAllPosts();
  };

  return view === 'login' ? (
    <LoginPage form={form} onChange={handleChange} onLogin={handleLogin} onRegister={handleRegister} />
  ) : (
    <PostsPage
      user={user}
      form={form}
      onChange={handleChange}
      onSubmit={handleCreatePost}
      posts={posts}
      onLike={handleLike}
      onUnlike={handleUnlike}
      onDelete={handleDelete}
    />
  );
};

export default App;
