import React from 'react';
import { Heart, X } from 'lucide-react';

const LikesPanel = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="ml-auto w-96 h-full bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-800/95 backdrop-blur-xl border-l border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                <Heart className="text-red-400" size={24} />
                <span>Likes ({post.likes?.length || 0})</span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Post preview */}
            <div className="mt-4 p-4 bg-black/20 rounded-2xl border border-white/5">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {post.author?.username?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-gray-300 font-medium">
                  {post.author?.username || 'Utilisateur'}
                </span>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>

          {/* Likes list */}
          <div className="flex-1 overflow-y-auto p-6">
            {post.likes && post.likes.length > 0 ? (
              <div className="space-y-3">
                {post.likes.map((like, index) => (
                  <div 
                    key={like.userId || like._id || index}
                    className="flex items-center space-x-4 p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/5 hover:bg-black/30 transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">
                        {like.username?.[0]?.toUpperCase() || 
                         like.user?.username?.[0]?.toUpperCase() || 
                         like.userId?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {like.username || 
                         like.user?.username || 
                         `Utilisateur ${like.userId?.slice(-4) || index + 1}`}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {like.likedAt || like.createdAt ? 
                          new Date(like.likedAt || like.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 
                          'Récemment'
                        }
                      </p>
                    </div>
                    <Heart className="text-red-400 fill-current" size={20} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Heart className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400">Aucun like pour le moment</p>
                <p className="text-gray-500 text-sm mt-2">
                  Soyez le premier à aimer ce post !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikesPanel;