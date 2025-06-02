import React, { useState } from 'react';
import Post from '../../components/Post';
import LikesPanel from '../../components/LikesPanel';

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
  onShowLikes, 
  isLoading 
}) => {
  // État pour gérer l'affichage du LikesPanel
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLikesPanelOpen, setIsLikesPanelOpen] = useState(false);

  // Fonction pour afficher les likes d'un post
  const handleShowLikes = async (post) => {
    try {
      // Récupérer les données mises à jour du post
      const updatedPost = await onShowLikes(post);
      setSelectedPost(updatedPost);
      setIsLikesPanelOpen(true);
    } catch (error) {
      console.error('Erreur lors de l\'affichage des likes:', error);
    }
  };

  const handleCloseLikesPanel = () => {
    setIsLikesPanelOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Formulaire de création de post */}
        <div className="mb-8 p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
          <h2 className="text-xl font-bold mb-4 text-center">
            Créer un nouveau post
          </h2>
          <textarea
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            rows={4}
            placeholder="Quoi de neuf ?"
            value={form.content}
            onChange={onChange}
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={onSubmit}
              disabled={!form.content.trim() || isLoading}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? 'Publication...' : 'Publier'}
            </button>
          </div>
        </div>

        {/* Liste des posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Aucun post pour le moment</p>
              <p className="text-gray-500 text-sm mt-2">
                Soyez le premier à publier quelque chose !
              </p>
            </div>
          ) : (
            posts.map(post => (
              <div
                key={post._id}
                className="p-6 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <Post
                  post={post}
                  userId={user.id || user._id}
                  onLike={onLike}
                  onUnlike={onUnlike}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onShowLikes={handleShowLikes} // Fonction locale
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* LikesPanel */}
      <LikesPanel
        isOpen={isLikesPanelOpen}
        onClose={handleCloseLikesPanel}
        post={selectedPost}
      />
    </div>
  );
};

export default PostsPage;