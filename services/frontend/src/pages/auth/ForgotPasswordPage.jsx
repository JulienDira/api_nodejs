import { useState } from 'react';
import { forgotPassword } from '../../services/authService';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = ({ onBack }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async () => {
    try {
      await forgotPassword(email);
      toast.success('Lien de réinitialisation envoyé. Vérifiez votre boîte mail.');
    } catch (error) {
      toast.error("Erreur lors de l'envoi du lien.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Mot de passe oublié</h2>
      <input
        type="email"
        placeholder="Votre adresse email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer le lien
        </button>
        <button
          onClick={onBack}
          className="text-gray-600 underline"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
