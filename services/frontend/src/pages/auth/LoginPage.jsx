import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage = ({ form, onChange, onLogin, onRegister, onForgotPassword }) => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSocialLogin = (provider) => {
    console.log(`${provider} login clicked`);
    // Logique pour la connexion sociale
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative">
        {/* Glass morphism container */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
            <p className="text-gray-400">Connectez-vous à votre compte</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Input
              label="Nom d'utilisateur"
              type="text"
              name="userName"
              value={form.userName}
              onChange={onChange}
              placeholder="Entrez votre nom d'utilisateur"
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••••••"
            />

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-400 bg-black/30 border border-white/20 rounded focus:ring-blue-400/50 focus:ring-2"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-300">
                  Se souvenir de moi
                </label>
              </div>
              <button
                type="button"
                onClick={onForgotPassword} // ← C'est ça qui manquait !
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <Button variant="primary" size="lg" onClick={onLogin}>
              Se connecter
            </Button>

            <Button variant="secondary" size="lg" onClick={onRegister}>
              Créer un compte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;