import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaGraduationCap, 
    FaArrowRight, 
    FaSearch,
    FaLaptopCode,
    FaHardHat,
    FaCogs,
    FaPlug,
    FaWater,
    FaMicrochip,
    FaBrain,
    FaChartLine
} from 'react-icons/fa';
import { getFormations } from '../../services/api';

function FormationsList() {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNiveau, setSelectedNiveau] = useState('all');

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

    // Remplacer les deux useEffect par ceci :

useEffect(() => {
    chargerFormations();
}, []);

useEffect(() => {
    if (formations.length > 0) {
        filtrerFormations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm, selectedNiveau, formations]);

    const chargerFormations = async () => {
        try {
            const res = await getFormations();
            setFormations(res.data);
            setFilteredFormations(res.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const filtrerFormations = () => {
        let filtered = [...formations];
        
        if (searchTerm) {
            filtered = filtered.filter(f => 
                f.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                f.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        if (selectedNiveau !== 'all') {
            filtered = filtered.filter(f => f.niveau === selectedNiveau);
        }
        
        setFilteredFormations(filtered);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement des formations...</p>
            </div>
        );
    }

    return (
        <div className="container">
            {/* En-tête */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="page-header"
            >
                <h1>
                    <FaGraduationCap style={{ marginRight: '16px' }} />
                    Nos Formations
                </h1>
                <p>Découvrez l'ensemble de nos filières d'excellence à l'ESP Antsiranana</p>
            </motion.div>

            {/* Filtres et recherche */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="filters-section"
            >
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Rechercher une formation..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-tabs">
                    <button 
                        className={`filter-btn ${selectedNiveau === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedNiveau('all')}
                    >
                        Toutes
                    </button>
                    <button 
                        className={`filter-btn ${selectedNiveau === 'Licence' ? 'active' : ''}`}
                        onClick={() => setSelectedNiveau('Licence')}
                    >
                        Licences
                    </button>
                    <button 
                        className={`filter-btn ${selectedNiveau === 'Master' ? 'active' : ''}`}
                        onClick={() => setSelectedNiveau('Master')}
                    >
                        Masters
                    </button>
                </div>
            </motion.div>

            {/* Compteur */}
            <div className="result-count">
                <FaChartLine style={{ marginRight: '8px' }} />
                {filteredFormations.length} formation(s) trouvée(s)
            </div>

            {/* Grille des formations */}
            <div className="formations-grid">
                {filteredFormations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="no-results"
                    >
                        <FaGraduationCap style={{ fontSize: '64px', color: '#ccc', marginBottom: '16px' }} />
                        <h3>Aucune formation trouvée</h3>
                        <p>Essayez d'autres mots-clés ou filtres</p>
                    </motion.div>
                ) : (
                    filteredFormations.map((formation, index) => (
                        <motion.div
                            key={formation.id_formation}
                            className="formation-card"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -8 }}
                        >
                            <div 
                                className="formation-icon"
                                style={{ color: couleurParCode[formation.code] || '#1a237e' }}
                            >
                                {iconeParCode[formation.code] || <FaGraduationCap />}
                            </div>
                            <h3>{formation.nom}</h3>
                            <code>{formation.code}</code>
                            <p>{formation.description?.substring(0, 120)}...</p>
                            <div className="formation-footer">
                                <span className="formation-niveau">{formation.niveau || 'Licence'}</span>
                                <Link to={`/formations/${formation.code}`} className="btn-link">
                                    En savoir plus <FaArrowRight />
                                </Link>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

export default FormationsList;