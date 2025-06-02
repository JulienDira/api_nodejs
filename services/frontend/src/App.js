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
import ControlPanel from './components/ControlPanel';

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
import {
  updateUserProfile,
  changeUserPassword,
  getUserProfile
} from './services/authService';

const AppRoutes = () => {
  const navigate = useNavigate();
  const { token, user, loginUser, logoutUser, registerUser, updateUser } = useAuth();
  const [authForm, setAuthForm] = useState({
    userName: '',
    password: '',
    confirmPassword: '',
  });
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(true);
  
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

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

  // CORRECTION : Gestion unifiée des likes
  const handleLike = async id => {
    try {
      // Vérifier d'abord si l'utilisateur a déjà liké ce post
      const post = posts.find(p => p._id === id);
      if (!post) {
        toast.error('Post non trouvé');
        return;
      }

      const currentUserId = user.id || user._id;
      const isAlreadyLiked = post.likes?.some(like => {
        const likeUserId = like.userId || like.user?._id || like.user?.id;
        return likeUserId === currentUserId;
      });

      if (isAlreadyLiked) {
        // Unlike
        await unlikePost(token, id);
        
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p._id === id) {
              const updatedLikes = (p.likes || []).filter(like => {
                const likeUserId = like.userId || like.user?._id || like.user?.id;
                return likeUserId !== currentUserId;
              });
              
              return {
                ...p,
                likes: updatedLikes,
                likesCount: updatedLikes.length
              };
            }
            return p;
          })
        );
        
        toast.success('Like retiré !');
      } else {
        // Like
        await likePost(token, id);
        
        setPosts(prevPosts =>
          prevPosts.map(p => {
            if (p._id === id) {
              const newLike = {
                userId: currentUserId,
                user: {
                  _id: currentUserId,
                  id: currentUserId,
                  username: user.userName
                },
                likedAt: new Date().toISOString()
              };
              
              const updatedLikes = [...(p.likes || []), newLike];
              
              return {
                ...p,
                likes: updatedLikes,
                likesCount: updatedLikes.length
              };
            }
            return p;
          })
        );
        
        toast.success('Post liké !');
      }
    } catch (e) {
      console.error('Erreur lors du like/unlike:', e);
      
      // Gestion d'erreur plus spécifique
      if (e.response?.status === 500) {
        toast.error('Erreur serveur. Vérifiez votre connexion.');
      } else if (e.response?.status === 401) {
        toast.error('Session expirée. Reconnectez-vous.');
        logoutUser();
        navigate('/login');
      } else {
        toast.error('Erreur lors de l\'action');
      }
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

  // CORRECTION : Amélioration de la fonction showPostLikes
  const handleShowPostLikes = async post => {
    try {
      // Récupérer les likes à jour depuis le serveur
      const res = await getLikesByPost(token, post._id);
      const updatedLikes = res.data || [];
      
      // Mettre à jour le post avec les likes récupérés
      const updatedPost = {
        ...post,
        likes: updatedLikes,
        likesCount: updatedLikes.length,
      };
      
      // Mettre à jour l'état des posts aussi
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id ? updatedPost : p
        )
      );
      
      return updatedPost;
    } catch (e) {
      console.error('Erreur chargement des likes:', e);
      toast.error('Erreur chargement des likes');
      return post;
    }
  };

  // Gestionnaires pour le ControlPanel
  const handleUpdateProfile = async (profileData) => {
    try {
      await updateUserProfile(token, profileData);
      const response = await getUserProfile(token);
      updateUser(response.user);
      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      console.error('Erreur API updateUserProfile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  const handleChangePassword = async (passwordData) => {
    try {
      await changeUserPassword(token, passwordData);
      toast.success('Mot de passe modifié avec succès !');
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
      throw error;
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsControlPanelOpen(false);
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <>
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
                      onClick={() => setIsControlPanelOpen(true)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      ⚙️ Paramètres
                    </button>
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
                    onUnlike={handleLike} // Même fonction
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

      <ControlPanel
        isOpen={isControlPanelOpen}
        onClose={() => setIsControlPanelOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        onLogout={handleLogout}
      />
    </>
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