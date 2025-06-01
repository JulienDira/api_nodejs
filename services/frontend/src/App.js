import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'react-hot-toast';

import LoginPage from './pages/auth/LoginPage';
import PostsPage from './pages/PostsPage';
import Loader from './components/common/Loader';

import { useAuth } from './hooks/useAuth';
import { fetchPosts, createPost, deletePost, updatePost } from './services/postService';
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
    } catch (error) {
      toast.error("Erreur lors du chargement des posts");
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await likePost(token, id);
      setPosts(posts.map(p => 
        p._id === id 
          ? { ...p, likes: [...(p.likes || []), { userId: user._id, username: user.username }] } 
          : p
      ));
      toast.success("Post liké !");
    } catch (error) {
      toast.error("Erreur lors du like");
      console.error('Like error:', error);
    }
  };

  const handleUnlike = async (id) => {
    try {
      await unlikePost(token, id);
      setPosts(posts.map(p => 
        p._id === id 
          ? { ...p, likes: (p.likes || []).filter(like => like.userId !== user._id) } 
          : p
      ));
      toast.success("Like retiré");
    } catch (error) {
      toast.error("Erreur lors du unlike");
      console.error('Unlike error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(token, id);
      setPosts(posts.filter(p => p._id !== id));
      toast.success("Post supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error('Delete error:', error);
    }
  };

  const handleEdit = async (id, newContent) => {
    try {
      const { data } = await updatePost(token, id, newContent);
      setPosts(posts.map(p => 
        p._id === id 
          ? { ...p, content: newContent, updatedAt: new Date().toISOString() } 
          : p
      ));
      toast.success("Post modifié");
    } catch (error) {
      toast.error("Erreur lors de la modification");
      console.error('Edit error:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error("Le contenu ne peut pas être vide");
      return;
    }

    try {
      setLoading(true);
      const { data } = await createPost(token, postContent.trim());
      setPosts([data, ...posts]);
      setPostContent('');
      toast.success("Post créé avec succès !");
    } catch (error) {
      toast.error("Échec de la création du post");
      console.error('Create post error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginUser(authForm);
      setView('posts');
      toast.success("Connexion réussie !");
    } catch (error) {
      toast.error("Échec de la connexion");
      console.error('Login error:', error);
    }
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      
      {view === 'login' ? (
        <LoginPage
          form={authForm}
          onChange={(e) => setAuthForm({ ...authForm, [e.target.name]: e.target.value })}
          onLogin={handleLogin}
          onRegister={() => setView('register')}
        />
      ) : (
        <>
          <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-900">
            <button
              onClick={() => {
                logoutUser();
                setView('login');
                setPosts([]);
                setPostContent('');
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Déconnexion
            </button>
          </div>
          
          {loading && posts.length === 0 ? (
            <Loader />
          ) : (
            <PostsPage
              user={user}
              form={{ content: postContent }}
              onChange={(e) => setPostContent(e.target.value)}
              onSubmit={handleCreatePost}
              posts={posts}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onDelete={handleDelete}
              onEdit={handleEdit}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;