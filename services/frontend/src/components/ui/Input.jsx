import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  ...props 
}) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-4 bg-black/30 backdrop-blur-sm text-white placeholder-gray-500 rounded-xl border border-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:bg-black/40 transition-all duration-300 shadow-inner outline-none ${className}`}
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(0, 0, 0, 0.4)'
          }}
          {...props}
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/5 to-purple-400/5 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default Input;