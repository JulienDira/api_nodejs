import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'react-hot-toast';

import LoginPage from './pages/auth/LoginPage';
import PostsPage from './pages/PostsPage';
import Loader from './components/common/Loader';

import { useAuth } from './hooks/useAuth';
import { fetchPosts, createPost, deletePost, updatePost } from './services/postService';
import { likePost, unlikePost, getLikesByPost } from './services/likeService';

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
      
      // Utiliser directement les données de l'API qui contiennent déjà likesCount
      const enrichedPosts = data.map(post => ({
        ...post,
        likes: [], // On garde un tableau vide pour la compatibilité
        // likesCount est déjà fourni par l'API
      }));

      setPosts(enrichedPosts);
    } catch (error) {
      toast.error("Erreur lors du chargement des posts");
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les likes détaillés seulement quand nécessaire (pour afficher la liste)
  const loadPostLikes = async (postId) => {
    try {
      const likesResponse = await getLikesByPost(token, postId);
      return likesResponse.data || [];
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
      return [];
    }
  };

  const handleLike = async (id) => {
    try {
      await likePost(token, id);
      
      // Mise à jour optimiste du compteur seulement
      setPosts(posts.map(p => {
        if (p._id === id) {
          return { 
            ...p, 
            likesCount: (p.likesCount || 0) + 1
          };
        }
        return p;
      }));
      
      toast.success("Post liké !");
    } catch (error) {
      toast.error("Erreur lors du like");
      console.error('Like error:', error);
      
      // En cas d'erreur, recharger tous les posts pour avoir les données exactes
      fetchAllPosts();
    }
  };

  const handleUnlike = async (id) => {
    try {
      await unlikePost(token, id);
      
      // Mise à jour optimiste du compteur seulement
      setPosts(posts.map(p => {
        if (p._id === id) {
          return { 
            ...p, 
            likesCount: Math.max((p.likesCount || 0) - 1, 0)
          };
        }
        return p;
      }));
      
      toast.success("Like retiré");
    } catch (error) {
      toast.error("Erreur lors du unlike");
      console.error('Unlike error:', error);
      
      // En cas d'erreur, recharger tous les posts pour avoir les données exactes
      fetchAllPosts();
    }
  };

  const handleShowPostLikes = async (post) => {
    // Charger les likes détaillés seulement pour l'affichage de la liste
    try {
      const freshLikes = await loadPostLikes(post._id);
      return {
        ...post,
        likes: freshLikes,
        // Garder le likesCount existant ou utiliser la longueur des likes chargés
        likesCount: post.likesCount || freshLikes.length
      };
    } catch (error) {
      console.error('Erreur lors du chargement des likes:', error);
      return post;
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
      
      // Nouveau post avec likesCount initial à 0
      const newPost = {
        ...data,
        likes: [],
        likesCount: 0
      };
      
      setPosts([newPost, ...posts]);
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
              onShowLikes={handleShowPostLikes}
              isLoading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;