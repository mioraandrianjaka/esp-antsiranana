import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaLock, 
    FaEnvelope, 
    FaKey, 
    FaSpinner,
    FaShieldAlt,
    FaUserLock
} from 'react-icons/fa';
import { adminLogin } from '../../services/api';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await adminLogin({ email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('adminEmail', res.data.user.email);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="login-container"
                >
                    <div className="login-header">
                        <div className="login-logo">
                            <FaUserLock />
                        </div>
                        <h1>Administration</h1>
                        <p>Espace réservé aux administrateurs de l'ESP Antsiranana</p>
                    </div>

                    <div className="login-box">
                        {error && (
                            <div className="error-message">
                                <FaLock /> {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><FaEnvelope /> Email</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@espantsiranana.mg"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label><FaKey /> Mot de passe</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Entrez votre mot de passe"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={loading}>
                                {loading ? <FaSpinner className="spinning" /> : <FaShieldAlt />}
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="login-info">
                            <p>Accès restreint au personnel autorisé uniquement</p>
                            <p>Contactez l'administrateur en cas de problème</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default AdminLogin;