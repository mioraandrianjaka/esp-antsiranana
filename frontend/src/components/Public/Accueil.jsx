import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaNewspaper, 
    FaCalendarAlt, 
    FaShareAlt,
    FaHeart,
    FaComment,
    FaChalkboardTeacher,
    FaUsers,
    FaFlask,
    FaUniversity,
    FaTrophy,
    FaRocket,
    FaLeaf,
    FaBirthdayCake
} from 'react-icons/fa';
import { getActualites } from '../../services/api';

/* eslint-disable jsx-a11y/anchor-is-valid */

function Accueil() {
    const [actualites, setActualites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});

    useEffect(() => {
        chargerActualites();
    }, []);

    const chargerActualites = async () => {
        try {
            const res = await getActualites();
            setActualites(res.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (id) => {
        setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div>
          {/* Hero Section avec image de fond locale */}
<div className="hero-cover" style={{
    backgroundImage: `url('/images/background-esp.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    height: '550px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    overflow: 'hidden'
}}>
    <div className="hero-overlay" style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        background: 'linear-gradient(135deg, rgba(13,27,94,0.75), rgba(26,35,126,0.85))' 
    }}></div>
    <div className="hero-content" style={{ position: 'relative', zIndex: 2, color: 'white' }}>
        <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: '56px', fontWeight: '300', letterSpacing: '2px', marginBottom: '20px', fontFamily: 'Playfair Display, serif', textTransform: 'uppercase' }}
        >
            École Supérieure Polytechnique d'Antsiranana
        </motion.h1>
        <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '22px', fontWeight: '300', letterSpacing: '6px', fontStyle: 'italic' }}
        >
            La polyvalence par excellence
        </motion.p>
    </div>
</div>

            <div className="home-layout">
                {/* Sidebar gauche - À propos, Vie étudiante, 50e Anniversaire */}
                <aside className="home-sidebar">
                    {/* Carte À propos */}
                    <div className="sidebar-card">
                        <h3>
                            <FaUniversity className="sidebar-icon" />
                            À propos de l'ESP
                        </h3>
                        <p>
                            Depuis sa création en 1976, l'ESP Antsiranana forme des ingénieurs et techniciens 
                            de haut niveau. Notre école est reconnue pour l'excellence de sa formation et 
                            son engagement au service du développement de Madagascar.
                        </p>
                    </div>

                    {/* Chiffres clés */}
                    <div className="sidebar-card stats-card">
                        <h3>Chiffres clés</h3>
                        <div className="stat-item">
                            <FaFlask className="stat-icon" />
                            <div>
                                <span className="stat-number">17</span>
                                <span className="stat-label">Laboratoires</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FaChalkboardTeacher className="stat-icon" />
                            <div>
                                <span className="stat-number">120+</span>
                                <span className="stat-label">Enseignants</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <FaUsers className="stat-icon" />
                            <div>
                                <span className="stat-number">1500+</span>
                                <span className="stat-label">Étudiants/an</span>
                            </div>
                        </div>
                    </div>

                    {/* Vie étudiante */}
                    <div className="sidebar-card">
                        <h3>
                            <FaUsers className="sidebar-icon" />
                            Vie étudiante
                        </h3>
                        <p>
                            À l'université, nous offrons bien plus que l'acquisition de connaissances académiques. 
                            Notre école est le foyer d'une vie culturelle dynamique, avec de nombreux événements, 
                            activités et clubs pour enrichir votre expérience universitaire. Immergez-vous dans 
                            des conférences fascinantes, des expositions artistiques captivantes et des performances 
                            culturelles stimulantes. À l'ESP Antsiranana, votre séjour universitaire sera une 
                            expérience inoubliable, alliant la quête du savoir à une vie riche en découvertes 
                            et en rencontres inspirantes.
                        </p>
                    </div>

                    {/* 50e Anniversaire */}
                    <div className="sidebar-card anniversary-card">
                        <h3>
                            <FaBirthdayCake className="sidebar-icon" style={{ color: 'white' }} />
                            50e Anniversaire
                        </h3>
                        <p>
                            Célébrez avec nous cinq décennies d'excellence académique, d'innovation technologique 
                            et d'engagement au service de la formation d'ingénieurs à Madagascar.
                        </p>
                        <button className="sidebar-btn" onClick={() => window.open('/50-ans', '_self')}>
                            En savoir plus
                        </button>
                    </div>

                    {/* Nos valeurs */}
                    <div className="sidebar-card values-card">
                        <h3>Nos valeurs</h3>
                        <div className="value-item">
                            <FaTrophy className="value-icon" />
                            <div>
                                <strong>Excellence</strong>
                                <p>Former les meilleurs</p>
                            </div>
                        </div>
                        <div className="value-item">
                            <FaRocket className="value-icon" />
                            <div>
                                <strong>Innovation</strong>
                                <p>À la pointe de la technologie</p>
                            </div>
                        </div>
                        <div className="value-item">
                            <FaLeaf className="value-icon" />
                            <div>
                                <strong>Durabilité</strong>
                                <p>Pour un avenir meilleur</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Flux principal - Actualités */}
                <main className="home-main">
                    <h2 className="feed-title">
                        <FaNewspaper /> Dernières actualités
                    </h2>
                    
                    <div className="actualites-feed">
                        {actualites.length === 0 ? (
                            <div className="feed-card">
                                <p>Aucune actualité pour le moment</p>
                            </div>
                        ) : (
                            actualites.map((actu, index) => (
                                <motion.div
                                    key={actu.id_actu}
                                    className="feed-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    {actu.image_url && (
                                        <div className="feed-image">
                                            <img 
                                                src={`http://esp-antsiranana.onrender.com${actu.image_url}`} 
                                                alt={actu.titre}
                                            />
                                        </div>
                                    )}
                                    <div className="feed-header">
                                        <div className="feed-info">
                                            <span className="feed-date">
                                                <FaCalendarAlt /> {new Date(actu.date_publication).toLocaleDateString()}
                                            </span>
                                            <span className="feed-author">ESP Antsiranana</span>
                                        </div>
                                    </div>
                                    <h3 className="feed-title-post">{actu.titre}</h3>
                                    <div className="feed-content">
                                        {actu.description && actu.description.includes('http') ? (
                                            <div dangerouslySetInnerHTML={{ __html: actu.description }} />
                                        ) : (
                                            <p>{actu.description}</p>
                                        )}
                                    </div>
                                    <div className="feed-actions">
                                        <button 
                                            className={`action-btn ${likedPosts[actu.id_actu] ? 'liked' : ''}`}
                                            onClick={() => handleLike(actu.id_actu)}
                                        >
                                            <FaHeart /> {likedPosts[actu.id_actu] ? 'Aimé' : 'J\'aime'}
                                        </button>
                                        <button className="action-btn">
                                            <FaComment /> Commenter
                                        </button>
                                        <button className="action-btn">
                                            <FaShareAlt /> Partager
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </main>

                {/* Sidebar droite - vide ou avec contenu optionnel */}
                <aside className="home-sidebar-right">
                    {/* Espace pour contenu futur si besoin */}
                </aside>
            </div>
        </div>
    );
}

export default Accueil;