import React from 'react';

const LoginPage = ({ form, onChange, onLogin, onRegister }) => (
  <div className="p-8 max-w-sm mx-auto">
    <h1 className="text-xl mb-4">Login / Register</h1>
    <input className="border p-2 w-full mb-2" placeholder="Username" name="userName" onChange={onChange} />
    <input className="border p-2 w-full mb-2" type="password" placeholder="Password" name="password" onChange={onChange} />
    <button className="bg-blue-500 text-white p-2 w-full mb-2" onClick={onLogin}>Login</button>
    <button className="bg-green-500 text-white p-2 w-full" onClick={onRegister}>Register</button>
  </div>
);

export default LoginPage;
