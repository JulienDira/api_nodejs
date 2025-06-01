import React, { useState } from 'react';
import Post from '../components/Post';
import LikesPanel from '../components/LikesPanel';
import PostForm from '../components/PostForm';

const PostsPage = ({ 
  user, 
  form, 
  onChange, 
  onSubmit, 
  posts, 
  onLike, 
  onUnlike, 
  onDelete, 
  onEdit,
  isLoading = false 
}) => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [showLikesPanel, setShowLikesPanel] = useState(false);

  // Vérification de l'utilisateur
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  const safeForm = form || {};
  const safePosts = posts || [];

  const handleShowLikes = (post) => {
    setSelectedPost(post);
    setShowLikesPanel(true);
  };

  const handleCloseLikes = () => {
    setShowLikesPanel(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue {user.username}
          </h1>
          <p className="text-gray-400">
            Partagez vos pensées avec la communauté
          </p>
        </div>

        {/* Formulaire de création */}
        <PostForm 
          form={safeForm}
          onChange={onChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />

        {/* Liste des posts */}
        <div className="space-y-6">
          {safePosts.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-gray-400 mb-2">
                  Aucun post pour le moment
                </p>
                <p className="text-gray-500 text-sm">
                  Soyez le premier à publier quelque chose !
                </p>
              </div>
            </div>
          ) : (
            safePosts.map(post => (
              <div 
                key={post._id} 
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Post 
                  post={post} 
                  userId={user.id || user._id} 
                  onLike={onLike} 
                  onUnlike={onUnlike} 
                  onDelete={onDelete}
                  onShowLikes={handleShowLikes}
                  onEdit={onEdit}
                />
              </div>
            ))
          )}
        </div>

        {/* Indicateur de chargement pour les posts */}
        {isLoading && safePosts.length > 0 && (
          <div className="text-center mt-6">
            <div className="inline-flex items-center space-x-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm">Mise à jour...</span>
            </div>
          </div>
        )}
      </div>

      {/* Panneau des likes */}
      <LikesPanel 
        isOpen={showLikesPanel}
        onClose={handleCloseLikes}
        post={selectedPost}
      />
    </div>
  );
};

export default PostsPage;