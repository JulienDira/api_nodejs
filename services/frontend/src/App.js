import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'react-hot-toast';

import LoginPage from './pages/auth/LoginPage';
import PostsPage from './pages/PostsPage';
import Loader from './components/common/Loader';

import { useAuth } from './hooks/useAuth';
import { fetchPosts, createPost, deletePost } from './services/postService';
import { likePost, unlikePost } from './services/likeService';

const App = () => {
  const { token, user, loginUser, logoutUser } = useAuth();
  const [authForm, setAuthForm] = useState({ userName: '', password: '' });
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  const [view, setView] = useState(token ? 'posts' : 'login');

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logoutUser();
        setView('login');
        return;
      }
      fetchAllPosts();
    }
  }, [token]);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchPosts(token);
      setPosts(data);
    } catch {
      toast.error("Erreur lors du chargement des posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async id => {
    await likePost(token, id);
    setPosts(posts.map(p => p._id === id ? { ...p, likes: [...p.likes, user._id] } : p));
  };

  const handleUnlike = async id => {
    await unlikePost(token, id);
    setPosts(posts.map(p => p._id === id ? { ...p, likes: p.likes.filter(uid => uid !== user._id) } : p));
  };

  const handleDelete = async id => {
    await deletePost(token, id);
    setPosts(posts.filter(p => p._id !== id));
  };

  const handleCreatePost = async () => {
    try {
      const { data } = await createPost(token, postContent);
      setPosts([data, ...posts]);
      setPostContent('');
    } catch {
      toast.error("Échec de la création du post");
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser(authForm);
      setView('posts');
      toast.success("Connexion réussie !");
    } catch {
      toast.error("Échec de la connexion");
    }
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <Toaster />
      
      {view === 'login' ? (
        <LoginPage
          form={authForm}
          onChange={(e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value })}
          onLogin={handleLogin}
          onRegister={() => setView('register')} // Ajout d'une page d'inscription
        />
      ) : (
        <>
          <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-900">
            <button
              onClick={() => {
                logoutUser();
                setView('login');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <PostsPage
              user={user}
              form={{ content: postContent }} // Correction: objet form au lieu de content
              onChange={(e) => setPostContent(e.target.value)} // Correction: onChange au lieu de onContentChange
              onSubmit={handleCreatePost}
              posts={posts}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
