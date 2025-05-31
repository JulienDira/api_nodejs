import React from 'react';

const PostForm = ({ content, onChange, onSubmit }) => (
  <div className="mb-4">
    <textarea name="content" value={content} onChange={onChange} className="border p-2 w-full mb-2" placeholder="Écrire un post..." />
    <button onClick={onSubmit} className="bg-blue-600 text-white p-2 rounded">Publier</button>
  </div>
);

export default PostForm;
