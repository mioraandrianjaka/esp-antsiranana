import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaArrowLeft, 
    FaUserTie, 
    FaGraduationCap, 
    FaBriefcase, 
    FaBook,
    FaCheckCircle,
    FaCalendarAlt,
    FaLaptopCode,
    FaHardHat,
    FaCogs,
    FaPlug,
    FaWater,
    FaMicrochip,
    FaBrain
} from 'react-icons/fa';
import { getFormationByCode } from '../../services/api';

function FormationDetail() {
    const { code } = useParams();
    const [formation, setFormation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('description');

    const iconeParCode = {
        'STIC': <FaLaptopCode />,
        'GC': <FaHardHat />,
        'GM': <FaCogs />,
        'GE': <FaPlug />,
        'HE': <FaWater />,
        'GET': <FaMicrochip />,
        'TNC': <FaBrain />,
        'GMH': <FaWater />
    };

    const couleurParCode = {
        'STIC': '#3b82f6',
        'GC': '#10b981',
        'GM': '#f59e0b',
        'GE': '#ef4444',
        'HE': '#06b6d4',
        'GET': '#8b5cf6',
        'TNC': '#ec4899',
        'GMH': '#14b8a6'
    };

    useEffect(() => {
    chargerFormation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [code]);

    const chargerFormation = async () => {
        try {
            const res = await getFormationByCode(code);
            setFormation(res.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement de la formation...</p>
            </div>
        );
    }

    if (!formation) {
        return (
            <div className="container">
                <div className="error-message">
                    Formation non trouvée
                </div>
                <Link to="/formations" className="btn">Retour aux formations</Link>
            </div>
        );
    }

    const parcours = formation.details?.filter(d => d.type === 'parcours') || [];
    const debouches = formation.details?.filter(d => d.type === 'debouché') || [];

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Bouton retour */}
                <Link to="/formations" className="back-link">
                    <FaArrowLeft /> Retour aux formations
                </Link>

                {/* En-tête de la formation */}
                <div className="formation-detail-header">
                    <div 
                        className="formation-detail-icon"
                        style={{ background: couleurParCode[formation.code] || '#1a237e' }}
                    >
                        {iconeParCode[formation.code] || <FaGraduationCap />}
                    </div>
                    <div className="formation-detail-info">
                        <h1>{formation.nom}</h1>
                        <div className="formation-meta">
                            <code>{formation.code}</code>
                            <span className="formation-niveau-badge">{formation.niveau || 'Licence'}</span>
                        </div>
                    </div>
                </div>

                {/* Tabs navigation */}
                <div className="detail-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        <FaBook /> Description
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'parcours' ? 'active' : ''}`}
                        onClick={() => setActiveTab('parcours')}
                    >
                        <FaGraduationCap /> Parcours
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'debouches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('debouches')}
                    >
                        <FaBriefcase /> Débouchés
                    </button>
                </div>

                {/* Contenu des tabs */}
                <div className="tab-content">
                    {activeTab === 'description' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="description-content"
                        >
                            <p>{formation.description}</p>
                            
                            <div className="info-grid">
                                <div className="info-card">
                                    <FaUserTie />
                                    <strong>Responsable de mention</strong>
                                    <span>{formation.responsable_nom || 'À venir'}</span>
                                </div>
                                <div className="info-card">
                                    <FaCalendarAlt />
                                    <strong>Durée</strong>
                                    <span>3 ans (Licence) / 2 ans (Master)</span>
                                </div>
                                <div className="info-card">
                                    <FaGraduationCap />
                                    <strong>Diplôme</strong>
                                    <span>Licence / Master</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'parcours' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="parcours-content"
                        >
                            {parcours.length === 0 ? (
                                <p>Les informations sur les parcours seront bientôt disponibles.</p>
                            ) : (
                                <div className="parcours-list">
                                    {parcours.map((p, index) => (
                                        <div key={index} className="parcours-item">
                                            <FaCheckCircle />
                                            <div>
                                                <h4>Parcours {index + 1}</h4>
                                                <p>{p.contenu}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'debouches' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="debouches-content"
                        >
                            {debouches.length === 0 ? (
                                <p>Les informations sur les débouchés seront bientôt disponibles.</p>
                            ) : (
                                <div className="debouches-list">
                                    {debouches.map((d, index) => (
                                        <div key={index} className="debouch-item">
                                            <FaBriefcase />
                                            <span>{d.contenu}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
                
               
            </motion.div>
            
        </div>
    );
}

export default FormationDetail;