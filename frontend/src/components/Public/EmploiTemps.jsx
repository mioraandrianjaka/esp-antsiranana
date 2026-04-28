import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaCalendarAlt, 
    FaSearch, 
    FaFilePdf, 
    FaDownload,
    FaSpinner,
    FaClock,
    FaUniversity,
    FaGraduationCap
} from 'react-icons/fa';
import { getEmploiTemps, getClasses } from '../../services/api';

function EmploiTemps() {
    const [filieres, setFilieres] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('S1');
    const [edt, setEdt] = useState(null);
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
        setEdt(null);

        try {
            const res = await getEmploiTemps(classeNom);
            if (res.data) {
                setEdt(res.data);
            } else {
                setError('Aucun emploi du temps trouvé pour cette filière et ce semestre');
            }
        } catch (err) {
            setError('Erreur lors de la recherche');
        } finally {
            setSearching(false);
        }
    };

    const handleDownload = () => {
        if (edt) {
            window.open(`http://localhost:5000${edt.fichier_url}`, '_blank');
        }
    };

    // Générer les semestres disponibles selon la filière
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
                        <FaCalendarAlt style={{ marginRight: '16px' }} />
                        Emplois du temps
                    </h1>
                    <p>Sélectionnez votre filière et votre semestre</p>
                </div>

                <div className="edt-search-section">
                    <div className="search-card">
                        <h3>Rechercher un emploi du temps</h3>
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
                            <button onClick={handleSearch} disabled={searching} className="search-btn">
                                {searching ? <FaSpinner className="spinning" /> : <FaSearch />}
                                {searching ? 'Recherche...' : 'Rechercher'}
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <FaCalendarAlt /> {error}
                    </div>
                )}

                {edt && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="edt-result"
                    >
                        <div className="edt-header">
                            <div className="edt-info">
                                <FaCalendarAlt />
                                <h3>Emploi du temps - {selectedFiliere} {selectedSemestre}</h3>
                            </div>
                            <button onClick={handleDownload} className="download-btn">
                                <FaDownload /> Télécharger PDF
                            </button>
                        </div>
                        
                        <div className="pdf-container">
                            <embed 
                                src={`http://localhost:5000${edt.fichier_url}`} 
                                type="application/pdf" 
                                width="100%" 
                                height="600px"
                            />
                        </div>
                    </motion.div>
                )}

                <div className="edt-info-section">
                    <div className="info-card">
                        <FaClock />
                        <h4>Horaires des cours</h4>
                        <p>Matin: 07h30 - 11h30</p>
                        <p>Après-midi: 14h30 - 17h30</p>
                    </div>
                    <div className="info-card">
                        <FaUniversity />
                        <h4>Lieux</h4>
                        <p>Campus principal: Lazaret CUR</p>
                        <p>Salles et amphithéâtres</p>
                    </div>
                    <div className="info-card">
                        <FaFilePdf />
                        <h4>Format PDF</h4>
                        <p>Téléchargez et imprimez votre emploi du temps</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default EmploiTemps;