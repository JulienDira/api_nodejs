import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CreateAccountPage = ({ form, onChange, onRegister, onBackToLogin }) => {
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main container */}
      <div className="w-full max-w-md relative">
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
            <p className="text-gray-400">Rejoignez la communauté dès maintenant</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <Input
              label="Nom d'utilisateur"
              type="text"
              name="userName"
              value={form.userName}
              onChange={onChange}
              placeholder="Choisissez un nom d'utilisateur"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Adresse e-mail"
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••••••"
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword || ''}
              onChange={onChange}
              placeholder="Répétez votre mot de passe"
            />

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-400 bg-black/30 border border-white/20 rounded focus:ring-blue-400/50 focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                J'accepte les <span className="text-blue-400 underline cursor-pointer">conditions d'utilisation</span>
              </label>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (!agreeTerms) return alert("Veuillez accepter les conditions.");
                onRegister();
              }}
            >
              Créer un compte
            </Button>

            <Button variant="secondary" size="lg" onClick={onBackToLogin}>
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;
