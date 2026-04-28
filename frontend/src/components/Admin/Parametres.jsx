import React, { useState, useEffect } from 'react';
import { 
    FaCog, 
    FaKey, 
    FaUserLock, 
    FaSave, 
    FaCheck,
    FaSpinner,
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaShieldAlt,
    FaCalendarAlt
} from 'react-icons/fa';
import { adminGetParametres, adminUpdateParametre, adminUpdatePassword } from '../../services/api';

function Parametres() {
    const [params, setParams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const chargerParametres = async () => {
        try {
            const res = await adminGetParametres();
            setParams(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        chargerParametres();
    }, []);

    const handleToggleInscriptions = async () => {
        const inscriptionParam = params.find(p => p.cle === 'inscriptions_ouvertes');
        const newValue = inscriptionParam?.valeur === 'true' ? 'false' : 'true';
        try {
            await adminUpdateParametre('inscriptions_ouvertes', { valeur: newValue });
            chargerParametres();
            alert(`Inscriptions ${newValue === 'true' ? 'ouvertes' : 'fermées'}`);
        } catch (err) {
            alert('Erreur');
        }
    };

    const handleUpdateAnnee = async () => {
        const newAnnee = prompt('Nouvelle année académique (ex: 2026-2027)', 
            params.find(p => p.cle === 'annee_academique')?.valeur || '2025-2026');
        if (newAnnee) {
            try {
                await adminUpdateParametre('annee_academique', { valeur: newAnnee });
                chargerParametres();
                alert('Année académique mise à jour');
            } catch (err) {
                alert('Erreur');
            }
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordError('Veuillez remplir tous les champs');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setSaving(true);
        try {
            await adminUpdatePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });
            setPasswordMessage('Mot de passe modifié avec succès');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setPasswordMessage(''), 3000);
        } catch (err) {
            setPasswordError(err.response?.data?.error || 'Erreur lors du changement de mot de passe');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading"><div className="spinner"></div><p>Chargement...</p></div>;

    const inscriptionsOuvertes = params.find(p => p.cle === 'inscriptions_ouvertes')?.valeur === 'true';
    const anneeAcademique = params.find(p => p.cle === 'annee_academique')?.valeur;

    return (
        <div>
            <h2><FaCog /> Paramètres du site</h2>

            <div className="admin-card" style={{ borderLeft: '4px solid #ef4444' }}>
                <h3><FaUserLock /> Changer le mot de passe administrateur</h3>
                <form onSubmit={handlePasswordChange} className="password-form">
                    {passwordMessage && (
                        <div className="success-message">
                            <FaCheck /> {passwordMessage}
                        </div>
                    )}
                    {passwordError && (
                        <div className="error-message">
                            <FaShieldAlt /> {passwordError}
                        </div>
                    )}
                    <div className="form-group">
                        <label>Mot de passe actuel</label>
                        <div className="password-input-group">
                            <input 
                                type={showPassword ? 'text' : 'password'} 
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                                placeholder="Entrez votre mot de passe actuel"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nouveau mot de passe</label>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                                placeholder="Minimum 6 caractères"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirmer le nouveau mot de passe</label>
                            <input 
                                type={showPassword ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                                placeholder="Répétez le nouveau mot de passe"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-show-password" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />} 
                            {showPassword ? 'Masquer les mots de passe' : 'Afficher les mots de passe'}
                        </button>
                        <button type="submit" disabled={saving}>
                            {saving ? <FaSpinner className="spinning" /> : <FaSave />}
                            {saving ? 'Modification...' : 'Modifier le mot de passe'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="admin-card">
                <h3><FaKey /> Inscriptions en ligne</h3>
                <div className="param-row">
                    <div className="param-info">
                        <strong>Statut actuel :</strong>
                        <span className={`status-badge ${inscriptionsOuvertes ? 'status-open' : 'status-closed'}`}>
                            {inscriptionsOuvertes ? 'Ouvertes' : 'Fermées'}
                        </span>
                    </div>
                    <button onClick={handleToggleInscriptions} className={inscriptionsOuvertes ? 'btn-danger' : 'btn-success'}>
                        {inscriptionsOuvertes ? 'Fermer les inscriptions' : 'Ouvrir les inscriptions'}
                    </button>
                </div>
            </div>

            <div className="admin-card">
                <h3><FaCalendarAlt /> Année académique</h3>
                <div className="param-row">
                    <div className="param-info">
                        <strong>Année actuelle :</strong>
                        <span className="current-value">{anneeAcademique || 'Non définie'}</span>
                    </div>
                    <button onClick={handleUpdateAnnee}>Modifier l'année académique</button>
                </div>
            </div>

            <div className="admin-card">
                <h3><FaEnvelope /> Informations</h3>
                <div className="info-list">
                    <div className="info-item">
                        <strong><FaEnvelope /> Email admin :</strong> admin@espantsiranana.mg
                    </div>
                    <div className="info-item">
                        <strong><FaShieldAlt /> Conseil :</strong> Utilisez un mot de passe fort avec lettres, chiffres et caractères spéciaux
                    </div>
                    <div className="info-item">
                        <strong><FaCalendarAlt /> Dernière modification :</strong> {new Date().toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Parametres;