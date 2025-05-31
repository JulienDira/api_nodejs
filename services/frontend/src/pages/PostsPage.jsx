import React from 'react';
import Post from '../components/Post';
import PostForm from '../components/PostForm';

const PostsPage = ({ user, form, onChange, onSubmit, posts, onLike, onUnlike, onDelete }) => (
  <div className="p-8 max-w-xl mx-auto">
    <h2 className="text-2xl mb-4">Bienvenue {user.username}</h2>
    <PostForm content={form.content} onChange={onChange} onSubmit={onSubmit} />
    <div className="space-y-4">
      {posts.map(post => (
        <Post key={post._id} post={post} userId={user.id} onLike={onLike} onUnlike={onUnlike} onDelete={onDelete} />
      ))}
    </div>
  </div>
);

export default PostsPage;
