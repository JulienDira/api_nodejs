import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Toaster, toast } from 'react-hot-toast';

import LoginPage from './pages/auth/LoginPage';
import CreateAccountPage from './pages/auth/CreateAccountPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PostsPage from './pages/post/PostsPage';
import Loader from './components/common/Loader';

import { useAuth } from './hooks/useAuth';
import {
  fetchPosts,
  createPost,
  deletePost,
  updatePost,
} from './services/postService';
import {
  likePost,
  unlikePost,
  getLikesByPost,
} from './services/likeService';

const AppRoutes = () => {
  const navigate = useNavigate();
  const { token, user, loginUser, logoutUser, registerUser } = useAuth();
  const [authForm, setAuthForm] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
  });
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logoutUser();
        return;
      }
      fetchAllPosts();
    }
  }, [token]);

  const fetchAllPosts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchPosts(token);
      const enriched = data.map(post => ({
        ...post,
        author:
          post.author || {
            _id: post.authorId,
            username: post.authorUsername || 'Inconnu',
          },
        likesCount: post.likesCount || 0,
        likes: post.likes || [],
      }));
      setPosts(enriched);
    } catch (e) {
      toast.error('Erreur chargement posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error('Le contenu ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);
      const { data } = await createPost(token, postContent.trim());
      const newPost = {
        ...data,
        author: data.author || {
          _id: user.id,
          username: user.userName,
        },
        likes: [],
        likesCount: 0,
      };
      setPosts([newPost, ...posts]);
      setPostContent('');
      toast.success('Post créé !');
    } catch (e) {
      toast.error('Erreur création post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async id => {
    try {
      await likePost(token, id);
      setPosts(
        posts.map(p =>
          p._id === id ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p
        )
      );
    } catch (e) {
      toast.error('Erreur lors du like');
    }
  };

  const handleUnlike = async id => {
    try {
      await unlikePost(token, id);
      setPosts(
        posts.map(p =>
          p._id === id
            ? { ...p, likesCount: Math.max((p.likesCount || 0) - 1, 0) }
            : p
        )
      );
    } catch (e) {
      toast.error('Erreur lors du unlike');
    }
  };

  const handleDelete = async id => {
    try {
      await deletePost(token, id);
      setPosts(posts.filter(p => p._id !== id));
      toast.success('Post supprimé');
    } catch (e) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = async (id, newContent) => {
    try {
      await updatePost(token, id, newContent);
      setPosts(
        posts.map(p =>
          p._id === id
            ? { ...p, content: newContent, updatedAt: new Date().toISOString() }
            : p
        )
      );
      toast.success('Post modifié');
    } catch (e) {
      toast.error('Erreur lors de la modification');
    }
  };

  const handleShowPostLikes = async post => {
    try {
      const res = await getLikesByPost(token, post._id);
      return {
        ...post,
        likes: res.data || [],
        likesCount: post.likesCount || res.data.length,
      };
    } catch (e) {
      toast.error('Erreur chargement des likes');
      return post;
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/posts" /> : <Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={
          <LoginPage
            form={authForm}
            onChange={e =>
              setAuthForm({ ...authForm, [e.target.name]: e.target.value })
            }
            onLogin={async () => {
              try {
                await loginUser(authForm);
                toast.success('Connexion réussie !');
                navigate('/posts');
              } catch {
                toast.error('Erreur de connexion');
              }
            }}
            onRegister={() => navigate('/register')}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        }
      />

      <Route
        path="/register"
        element={
          <CreateAccountPage
            form={authForm}
            onChange={e =>
              setAuthForm({ ...authForm, [e.target.name]: e.target.value })
            }
            onRegister={async () => {
              if (authForm.password !== authForm.confirmPassword) {
                toast.error('Les mots de passe ne correspondent pas');
                return;
              }
              try {
                await registerUser(authForm);
                toast.success('Inscription réussie !');
                navigate('/login');
              } catch {
                toast.error("Erreur d'inscription");
              }
            }}
            onBackToLogin={() => navigate('/login')}
          />
        }
      />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage onBack={() => navigate('/login')} />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPasswordPage onBackToLogin={() => navigate('/login')} />}
      />

      <Route
        path="/posts"
        element={
          token ? (
            <>
              <div className="p-4 bg-gray-200 dark:bg-gray-900 flex justify-between items-center">
                <span className="text-gray-800 dark:text-gray-100">
                  Connecté en tant que {user?.userName}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setDark(!dark)}>🎨</button>
                  <button
                    onClick={() => {
                      logoutUser();
                      navigate('/login');
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>

              {loading ? (
                <Loader />
              ) : (
                <PostsPage
                  user={user}
                  form={{ content: postContent }}
                  onChange={e => setPostContent(e.target.value)}
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
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
};

const App = () => (
  <Router>
    <div className="min-h-screen">
      <Toaster />
      <AppRoutes />
    </div>
  </Router>
);

export default App;
