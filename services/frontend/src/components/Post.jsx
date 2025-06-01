import React from 'react';

const Post = ({ post, userId, onLike, onUnlike, onDelete }) => {
  const isLiked = post.likes?.includes(userId);
  const isAuthor = post.author?._id === userId || post.author === userId;
  
  return (
    <div className="space-y-4">
      {/* Header du post */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {(post.author?.username || post.author)?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">
              {post.author?.username || post.author || 'Utilisateur'}
            </p>
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
        
        {/* Bouton de suppression si c'est l'auteur */}
        {isAuthor && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-red-400 hover:text-red-300 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10"
            title="Supprimer le post"
          >
            🗑️
          </button>
        )}
      </div>
      
      {/* Contenu du post */}
      <div className="text-white leading-relaxed text-base">
        {post.content}
      </div>
      
      {/* Actions (Like, Commentaires) */}
      <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
        <button
          onClick={() => isLiked ? onUnlike(post._id) : onLike(post._id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
            isLiked 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
              : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{post.likes?.length || 0}</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200">
          <span>💬</span>
          <span>{post.comments?.length || 0}</span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all duration-200">
          <span>📤</span>
          <span>Partager</span>
        </button>
      </div>
    </div>
  );
};

export default Post;