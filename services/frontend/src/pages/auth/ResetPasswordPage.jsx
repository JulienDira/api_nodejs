// ResetPasswordPage.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { resetPassword } from '../../services/authService';
import { toast } from 'react-hot-toast';

const ResetPasswordPage = ({ onBackToLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const { token } = useParams();

  const handleReset = async () => {
    try {
      await resetPassword(token, newPassword);
      toast.success("Mot de passe mis à jour !");
      onBackToLogin?.();
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Réinitialiser le mot de passe</h2>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleReset}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Réinitialiser
      </button>
    </div>
  );
};

export default ResetPasswordPage;
