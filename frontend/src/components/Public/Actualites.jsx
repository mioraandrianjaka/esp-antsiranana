import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaNewspaper, 
    FaCalendarAlt, 
    FaUser, 
    FaEye,
    FaSearch,
    FaFilter,
    FaArrowLeft
} from 'react-icons/fa';
import { getActualites } from '../../services/api';

function Actualites() {
    const [actualites, setActualites] = useState([]);
    const [filteredActualites, setFilteredActualites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedActu, setSelectedActu] = useState(null);

    useEffect(() => {
    chargerActualites();
}, []);

useEffect(() => {
    if (actualites.length > 0) {
        filtrerActualites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm]);

    const chargerActualites = async () => {
        try {
            const res = await getActualites();
            setActualites(res.data);
            setFilteredActualites(res.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtrerActualites = () => {
        if (!searchTerm) {
            setFilteredActualites(actualites);
        } else {
            const filtered = actualites.filter(actu =>
                actu.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                actu.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredActualites(filtered);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement des actualités...</p>
            </div>
        );
    }

    if (selectedActu) {
        return (
            <div className="container">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <button onClick={() => setSelectedActu(null)} className="btn">
                        <FaArrowLeft /> Retour aux actualités
                    </button>
                    
                    <div className="card" style={{ marginTop: '24px' }}>
                        <h1>{selectedActu.titre}</h1>
                        <div style={{ display: 'flex', gap: '20px', margin: '20px 0', color: '#888' }}>
                            <span><FaCalendarAlt /> {new Date(selectedActu.date_publication).toLocaleDateString()}</span>
                            <span><FaUser /> Administration</span>
                            <span><FaEye /> {Math.floor(Math.random() * 100)} vues</span>
                        </div>
                        {selectedActu.image_url && (
                            <img 
                                src={`http://localhost:5000${selectedActu.image_url}`} 
                                alt={selectedActu.titre}
                                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }}
                            />
                        )}
                        <p style={{ fontSize: '18px', lineHeight: '1.8' }}>{selectedActu.description}</p>
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
                <div className="hero" style={{ padding: '40px', marginBottom: '40px' }}>
                    <h1>
                        <FaNewspaper style={{ marginRight: '16px' }} />
                        Actualités de l'ESP
                    </h1>
                    <p>Restez informés des dernières nouvelles de l'école</p>
                </div>

                {/* Barre de recherche */}
                <div className="card" style={{ marginBottom: '32px' }}>
                    <div className="search-form" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <FaSearch style={{ color: '#667eea', fontSize: '20px' }} />
                        <input
                            type="text"
                            placeholder="Rechercher une actualité..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ flex: 1, padding: '12px', border: '2px solid #e0e0e0', borderRadius: '12px', fontSize: '16px' }}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="btn-outline">Effacer</button>
                        )}
                    </div>
                </div>

                {/* Compteur */}
                <p style={{ marginBottom: '20px', color: '#666' }}>
                    <FaFilter style={{ display: 'inline', marginRight: '8px' }} />
                    {filteredActualites.length} actualité(s) trouvée(s)
                </p>

                {/* Grille des actualités */}
                <div className="formations-grid">
                    {filteredActualites.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', gridColumn: '1/-1' }}>
                            <FaNewspaper style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                            <h3>Aucune actualité trouvée</h3>
                            <p>Essayez d'autres mots-clés</p>
                        </div>
                    ) : (
                        filteredActualites.map((actu, index) => (
                            <motion.div
                                key={actu.id_actu}
                                className="formation-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setSelectedActu(actu)}
                                style={{ cursor: 'pointer' }}
                            >
                                {actu.image_url && (
                                    <img 
                                        src={`http://esp-antsiranana.onrender.com${actu.image_url}`} 
                                        alt={actu.titre}
                                        style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }}
                                    />
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <code style={{ background: '#667eea', color: 'white' }}>Nouvelle</code>
                                    <small style={{ color: '#888' }}>
                                        <FaCalendarAlt style={{ marginRight: '4px' }} />
                                        {new Date(actu.date_publication).toLocaleDateString()}
                                    </small>
                                </div>
                                <h3>{actu.titre}</h3>
                                <p>{actu.description?.substring(0, 120)}...</p>
                                <div className="btn" style={{ marginTop: '16px', display: 'inline-flex' }}>
                                    Lire la suite
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default Actualites;