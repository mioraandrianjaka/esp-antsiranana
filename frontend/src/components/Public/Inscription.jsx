import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaUserPlus, 
    FaEnvelope, 
    FaPhone, 
    FaGraduationCap,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaUser
} from 'react-icons/fa';
import { getInscriptionStatut, submitInscription, getClasses } from '../../services/api';

function Inscription() {
    const [ouvert, setOuvert] = useState(false);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        classe_demandee: ''
    });

    useEffect(() => {
        Promise.all([
            getInscriptionStatut(),
            getClasses()
        ])
            .then(([statutRes, classesRes]) => {
                setOuvert(statutRes.data.ouvert);
                setClasses(classesRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');

        if (!formData.nom || !formData.prenom || !formData.email || !formData.classe_demandee) {
            setError('Veuillez remplir tous les champs obligatoires');
            setSubmitting(false);
            return;
        }

        try {
            await submitInscription(formData);
            setMessage('Votre inscription a été envoyée avec succès ! Vous recevrez une confirmation par email.');
            setFormData({ nom: '', prenom: '', email: '', telephone: '', classe_demandee: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement...</p>
            </div>
        );
    }

    if (!ouvert) {
        return (
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inscription-closed"
                >
                    <div className="closed-card">
                        <FaExclamationTriangle className="closed-icon" />
                        <h1>Inscriptions fermées</h1>
                        <p>Les inscriptions en ligne ne sont pas ouvertes actuellement.</p>
                        <p>Veuillez consulter le calendrier académique ou contacter le secrétariat.</p>
                        <div className="contact-info">
                            <p><FaPhone /> +261 32 98 089 95</p>
                            <p><FaEnvelope /> secretariat.direction@espantsiranana.mg</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="page-header">
                    <h1>
                        <FaUserPlus style={{ marginRight: '16px' }} />
                        Inscription en ligne
                    </h1>
                    <p>Rejoignez la grande famille de l'ESP Antsiranana</p>
                </div>

                <div className="inscription-grid">
                    {/* Formulaire */}
                    <div className="inscription-form-container">
                        {message && (
                            <div className="success-message">
                                <FaCheckCircle /> {message}
                            </div>
                        )}
                        {error && (
                            <div className="error-message">
                                <FaExclamationTriangle /> {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="inscription-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaUser /> Nom *</label>
                                    <input 
                                        type="text" 
                                        name="nom" 
                                        value={formData.nom} 
                                        onChange={handleChange} 
                                        placeholder="Votre nom"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FaUser /> Prénom *</label>
                                    <input 
                                        type="text" 
                                        name="prenom" 
                                        value={formData.prenom} 
                                        onChange={handleChange} 
                                        placeholder="Votre prénom"
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaEnvelope /> Email *</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        placeholder="exemple@email.com"
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label><FaPhone /> Téléphone</label>
                                    <input 
                                        type="tel" 
                                        name="telephone" 
                                        value={formData.telephone} 
                                        onChange={handleChange} 
                                        placeholder="+261 XX XXX XX"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label><FaGraduationCap /> Classe demandée *</label>
                                <select 
                                    name="classe_demandee" 
                                    value={formData.classe_demandee} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Sélectionner une classe</option>
                                    {classes.map(c => (
                                        <option key={c.id_classe} value={c.id_classe}>
                                            {c.nom} - {c.formation_nom || ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-info">
                                <FaCheckCircle />
                                <small>Les champs marqués d'un * sont obligatoires</small>
                            </div>

                            <button type="submit" className="btn-submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <FaSpinner className="spinning" /> Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus /> S'inscrire
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Informations complémentaires */}
                    <div className="inscription-info">
                        <div className="info-card">
                            <h3>Documents à fournir</h3>
                            <ul>
                                <li> Photocopie légalisée du Baccalauréat</li>
                                <li> Photocopie légalisée de la CIN</li>
                                <li> 4 photos d'identité (4x4)</li>
                                <li> Relevé de notes (datant de moins de 3 mois)</li>
                                <li> Bordereau de paiement des frais d'inscription</li>
                            </ul>
                        </div>
                        
                        <div className="info-card">
                            <h3>Calendrier</h3>
                            <ul>
                                <li> Période d'inscription : Octobre - Novembre</li>
                                <li> Rentrée universitaire : Janvier</li>
                                <li> Confirmation de place : Sous 15 jours</li>
                            </ul>
                        </div>

                        <div className="info-card contact-card">
                            <h3>Besoin d'aide ?</h3>
                            <p>Contactez le secrétariat pédagogique</p>
                            <p><FaPhone /> +261 32 98 089 95</p>
                            <p><FaEnvelope /> secretariat.direction@espantsiranana.mg</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Inscription;