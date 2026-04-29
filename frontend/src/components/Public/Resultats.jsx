import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaChartLine, 
    FaSearch, 
    FaFilePdf, 
    FaDownload,
    FaSpinner,
    FaAward,
    FaGraduationCap,
    FaCalendarAlt
} from 'react-icons/fa';
import { getResultats, getClasses } from '../../services/api';

function Resultats() {
    const [filieres, setFilieres] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('S1');
    const [selectedType, setSelectedType] = useState('notes');
    const [resultat, setResultat] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getClasses()
    .then(res => {
        const uniqueFilieres = [...new Set(res.data.map(c => {
            if (c.nom.startsWith('TCI')) return 'TCI';
            return c.nom.split(' ')[0];
        }))];
        setFilieres(uniqueFilieres);
    })
            .catch(err => console.error(err));
    }, []);

    const handleSearch = async () => {
        if (!selectedFiliere || !selectedSemestre) {
            setError('Veuillez sélectionner une filière et un semestre');
            return;
        }
        
        const classeNom = selectedFiliere === 'TCI' 
            ? `TCI ${selectedSemestre}`
            : `${selectedFiliere} ${selectedSemestre}`;
        
        setSearching(true);
        setError('');
        setResultat(null);

        try {
            const res = await getResultats(classeNom);
            if (res.data) {
                setResultat(res.data);
            } else {
                setError('Aucun résultat trouvé pour cette filière et ce semestre');
            }
        } catch (err) {
            setError('Erreur lors de la recherche');
        } finally {
            setSearching(false);
        }
    };

    const handleDownload = () => {
        if (resultat) {
            window.open(`http://localhost:5000${resultat.fichier_url}`, '_blank');
        }
    };

    const getAvailableSemestres = () => {
        if (selectedFiliere === 'TCI') {
            return ['S1', 'S2'];
        }
        return ['S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
    };

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="page-header">
                    <h1>
                        <FaChartLine style={{ marginRight: '16px' }} />
                        Résultats et notes
                    </h1>
                    <p>Sélectionnez votre filière et votre semestre</p>
                </div>

                <div className="resultats-search-section">
                    <div className="search-card">
                        <h3>Rechercher des résultats</h3>
                        <div className="search-form-two">
                            <div className="form-group">
                                <label><FaGraduationCap /> Filière</label>
                                <select 
                                    value={selectedFiliere} 
                                    onChange={(e) => setSelectedFiliere(e.target.value)}
                                >
                                    <option value="">Sélectionner une filière</option>
                                    {filieres.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FaCalendarAlt /> Semestre</label>
                                <select 
                                    value={selectedSemestre} 
                                    onChange={(e) => setSelectedSemestre(e.target.value)}
                                >
                                    <option value="">Sélectionner un semestre</option>
                                    {getAvailableSemestres().map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FaAward /> Type</label>
                                <select 
                                    value={selectedType} 
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    <option value="notes">Notes trimestrielles</option>
                                    <option value="deliberation">Délibération finale</option>
                                </select>
                            </div>
                            <button onClick={handleSearch} disabled={searching} className="search-btn">
                                {searching ? <FaSpinner className="spinning" /> : <FaSearch />}
                                {searching ? 'Recherche...' : 'Rechercher'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <FaChartLine /> {error}
                    </div>
                )}

                {resultat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="resultat-detail"
                    >
                        <div className="resultat-header">
                            <div className="resultat-info">
                                {resultat.type === 'notes' ? <FaChartLine /> : <FaAward />}
                                <h3>
                                    {resultat.type === 'notes' ? 'Notes - ' : 'Délibération - '}
                                    {selectedFiliere} {selectedSemestre}
                                </h3>
                            </div>
                            <button onClick={handleDownload} className="download-btn">
                                <FaDownload /> Télécharger PDF
                            </button>
                        </div>
                        
                        <div className="pdf-container">
                            <embed 
                                src={`http://esp-antsiranana.onrender.com${resultat.fichier_url}`} 
                                type="application/pdf" 
                                width="100%" 
                                height="600px"
                            />
                        </div>
                    </motion.div>
                )}

                <div className="resultats-info-section">
                    <div className="info-card">
                        <FaAward />
                        <h4>Mentions</h4>
                        <p>Passable: 10-12</p>
                        <p>Assez bien: 12-14</p>
                        <p>Bien: 14-16</p>
                        <p>Très bien: 16+</p>
                    </div>
                    <div className="info-card">
                        <FaGraduationCap />
                        <h4>Validation</h4>
                        <p>Moyenne générale ≥ 10/20</p>
                        <p>Passage en année supérieure</p>
                    </div>
                    <div className="info-card">
                        <FaFilePdf />
                        <h4>Relevé officiel</h4>
                        <p>Téléchargez votre relevé de notes</p>
                        <p>Version officielle disponible</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Resultats;