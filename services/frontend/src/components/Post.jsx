import React from 'react';

const Post = ({ post, userId, onLike, onUnlike, onDelete }) => (
  <div className="border p-4 rounded shadow">
    <p>{post.content}</p>
    <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
    <div className="flex space-x-2 mt-2">
      <button onClick={() => onLike(post._id)} className="bg-green-500 text-white px-2">Like</button>
      <button onClick={() => onUnlike(post._id)} className="bg-yellow-500 text-white px-2">Unlike</button>
      <span className="text-gray-700">❤️ {post.likesCount}</span>
      {post.authorId === userId && (
        <button onClick={() => onDelete(post._id)} className="bg-red-600 text-white px-2">Supprimer</button>
      )}
    </div>
  </div>
);

export default Post;
