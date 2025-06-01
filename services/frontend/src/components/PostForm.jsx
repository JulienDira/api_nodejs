import React from 'react';

const PostForm = ({ form, onChange, onSubmit, isLoading = false }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.content?.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Créer un nouveau post
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Contenu du post
          </label>
          <textarea
            name="content"
            value={form.content || ''}
            onChange={onChange}
            placeholder="Que voulez-vous partager ?"
            rows={4}
            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none"
            disabled={isLoading}
            required
          />
          <div className="text-right">
            <span className={`text-xs ${
              (form.content?.length || 0) > 500 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {form.content?.length || 0}/500
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !form.content?.trim() || (form.content?.length || 0) > 500}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Publication...' : 'Publier'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;