import React from 'react';
import Post from '../components/Post';
import TextArea from '../components/ui/TextArea';
import Button from '../components/ui/Button'; // Import manquant

const PostsPage = ({ user, form, onChange, onSubmit, posts, onLike, onUnlike, onDelete }) => {
  if (!user) {
    return <div>Chargement...</div>;
  }

  const safeForm = form || {};
  const safePosts = posts || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Bienvenue {user.username}
          </h1>
          <p className="text-gray-400">Partagez vos pensées avec la communauté</p>
        </div>

        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Créer un nouveau post</h2>
          
          <div className="space-y-6">
            <TextArea
              label="Contenu du post"
              name="content"
              value={safeForm.content || ''}
              onChange={onChange}
              placeholder="Que voulez-vous partager ?"
              rows={4}
            />

            <Button variant="primary" size="lg" onClick={onSubmit}>
              Publier
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {safePosts.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
              <p className="text-gray-400">Aucun post pour le moment. Soyez le premier à publier !</p>
            </div>
          ) : (
            safePosts.map(post => (
              <div key={post._id} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <Post 
                  post={post} 
                  userId={user.id} 
                  onLike={onLike} 
                  onUnlike={onUnlike} 
                  onDelete={onDelete} 
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsPage; // Export par défaut ajouté