import React, { useState } from 'react';
import { Heart, X, Users, Pencil, Check } from 'lucide-react';

const Post = ({ post, userId, onLike, onUnlike, onDelete, onShowLikes, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  
  // Correction : vérifier si l'utilisateur a liké ce post
  const isLiked = post.likes?.some(like => like.userId === userId) || false;
  const likesCount = post.likes?.length || post.likesCount || 0;
  
  // Correction : gérer les deux formats d'auteur
  const isOwner = (post.author?._id === userId) || (post.authorId === userId);

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

  return (
    <div className="space-y-4">
      {/* Header avec avatar et actions */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {post.author?.username?.[0]?.toUpperCase() || 
               post.authorName?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {post.author?.username || post.authorName || 'Utilisateur'}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
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
          <button
            onClick={() => isLiked ? onUnlike(post._id) : onLike(post._id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400'
            }`}
          >
            <Heart size={18} className={isLiked ? 'fill-current' : ''} />
            <span>{likesCount}</span>
          </button>

          {likesCount > 0 && (
            <button
              onClick={() => onShowLikes(post)}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-blue-400 transition-all duration-200"
            >
              <Users size={18} />
              <span>Voir les likes</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;