import React, { useState } from 'react';
import { Heart, X, Users, Pencil, Check } from 'lucide-react';

const Post = ({ post, userId, onLike, onUnlike, onDelete, onShowLikes, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  
  // Vérifier si l'utilisateur a liké ce post - CORRECTION AMÉLIORÉE
  const isLiked = post.likes?.some(like => {
    const likeUserId = like.userId || like.user?._id || like.user?.id;
    return likeUserId === userId;
  }) || false;
  
  const likesCount = post.likes?.length || post.likesCount || 0;
  
  // Gérer les deux formats d'auteur (avec populate ou sans)
  const isOwner = (post.author?._id === userId) || (post.authorId === userId);
  const authorName = post.author?.username || post.authorName || 'Utilisateur';

  const handleSave = () => {
    if (editedContent.trim()) {
      onEdit(post._id, editedContent.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(post.content);
  };

  // CORRECTION : Une seule fonction pour gérer like/unlike
  const handleLikeClick = () => {
    onLike(post._id); // On utilise toujours onLike, la logique est dans App.js
  };

  return (
    <div className="space-y-4">
      {/* Header avec avatar et actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {authorName[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {authorName}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
              {post.updatedAt !== post.createdAt && (
                <span className="text-xs text-gray-500 ml-2">(modifié)</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Actions pour le propriétaire */}
        {isOwner && (
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave} 
                  className="p-2 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300 transition-all duration-200"
                  disabled={!editedContent.trim()}
                >
                  <Check size={18} />
                </button>
                <button 
                  onClick={handleCancel} 
                  className="p-2 rounded-full bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-white transition-all duration-200"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="p-2 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 transition-all duration-200"
                  title="Modifier le post"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
                      onDelete(post._id);
                    }
                  }} 
                  className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200"
                  title="Supprimer le post"
                >
                  <X size={18} />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Contenu du post */}
      <div className="text-gray-100 leading-relaxed">
        {isEditing ? (
          <textarea
            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            value={editedContent}
            rows={3}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Modifier votre post..."
            autoFocus
          />
        ) : (
          <p>{post.content}</p>
        )}
      </div>

      {/* Actions like et voir les likes */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-4">
          {/* Bouton Like - CORRECTION AMÉLIORÉE avec couleurs */}
          <button
            onClick={handleLikeClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isLiked 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-lg shadow-red-500/20 border border-red-500/30' 
                : 'bg-gray-500/10 text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/10 border border-gray-500/20 hover:border-red-500/30'
            }`}
            title={isLiked ? 'Retirer le like' : 'Liker le post'}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-300 ${
                isLiked 
                  ? 'fill-current text-red-400 drop-shadow-lg animate-pulse' 
                  : 'hover:scale-110'
              }`} 
            />
            <span className={`font-medium transition-colors duration-300 ${
              isLiked ? 'text-red-400' : 'text-gray-400'
            }`}>
              {likesCount}
            </span>
          </button>

          {/* Bouton Voir les likes */}
          {likesCount > 0 && (
            <button
              onClick={() => onShowLikes(post)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-blue-400 transition-all duration-200 border border-white/10 hover:border-blue-400/30"
              title="Voir qui a liké ce post"
            >
              <Users size={18} />
              <span>
                {likesCount === 1 ? '1 like' : `${likesCount} likes`}
              </span>
            </button>
          )}
        </div>

        {/* Affichage des premiers avatars des likeurs */}
        {likesCount > 0 && post.likes && (
          <div className="flex -space-x-2">
            {post.likes.slice(0, 3).map((like, index) => {
              const username = like.user?.username || like.username || `User${index + 1}`;
              const displayLetter = username[0]?.toUpperCase() || 'U';
              const likeUserId = like.userId || like.user?._id || like.user?.id;
              
              return (
                <div
                  key={likeUserId || index}
                  className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer"
                  title={username}
                >
                  <span className="text-white font-semibold text-xs">
                    {displayLetter}
                  </span>
                </div>
              );
            })}
            {likesCount > 3 && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-800 shadow-lg hover:scale-110 transition-transform duration-200 cursor-pointer">
                <span className="text-white font-semibold text-xs">
                  +{likesCount - 3}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;