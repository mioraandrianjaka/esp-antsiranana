import React, { useState, useEffect } from 'react';
import { 
    FaDatabase, 
    FaFilePdf, 
    FaFileImage, 
    FaTrash, 
    FaEye,
    FaGraduationCap,
    FaCalendarAlt,
    FaChartLine,
    FaFolderOpen,
    FaSpinner,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa';
import { 
    adminGetClasses, 
    adminGetEmploisTemps, 
    adminGetResultats,
    adminGetCoursFiles,
    adminDeleteDocument
} from '../../services/api';

function GestionDonnees() {
    const [activeTab, setActiveTab] = useState('edt');
    const [loading, setLoading] = useState(true);
    const [emplois, setEmplois] = useState([]);
    const [resultats, setResultats] = useState([]);
    const [cours, setCours] = useState([]);
    const [classes, setClasses] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        chargerToutesDonnees();
    }, []);

    const chargerToutesDonnees = async () => {
        setLoading(true);
        try {
            const [classesRes, emploisRes, resultatsRes, coursRes] = await Promise.all([
                adminGetClasses(),
                adminGetEmploisTemps(),
                adminGetResultats(),
                adminGetCoursFiles()
            ]);
            setClasses(classesRes.data);
            setEmplois(emploisRes.data);
            setResultats(resultatsRes.data);
            setCours(coursRes.data);
        } catch (err) {
            console.error('Erreur chargement:', err);
            setError('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const getNomClasse = (idClasse) => {
        const classe = classes.find(c => c.id_classe === idClasse);
        return classe ? classe.nom : 'Inconnu';
    };

    const getFileIcon = (url) => {
        if (!url) return <FaFilePdf />;
        if (url.endsWith('.pdf')) return <FaFilePdf style={{ color: '#ef4444' }} />;
        if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) return <FaFileImage style={{ color: '#10b981' }} />;
        return <FaFilePdf />;
    };

    const handleDelete = async (type, id) => {
        if (window.confirm('Supprimer ce document ? Cette action est irréversible.')) {
            try {
                await adminDeleteDocument(type, id);
                setMessage(`${type} supprimé avec succès`);
                chargerToutesDonnees();
                setTimeout(() => setMessage(''), 3000);
            } catch (err) {
                setError('Erreur lors de la suppression');
                setTimeout(() => setError(''), 3000);
            }
        }
    };

    const stats = {
        totalEdt: emplois.length,
        totalResultats: resultats.length,
        totalCours: cours.length,
        totalClasses: classes.length
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <div className="stat-icon" style={{ color }}>{icon}</div>
            <div className="stat-info">
                <h3>{value}</h3>
                <p>{title}</p>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Chargement des données...</p>
            </div>
        );
    }

    return (
        <div>
            <h2><FaDatabase /> Gestion des données</h2>
            <p>Visualisez et gérez toutes les données enregistrées sur le site</p>

            {message && <div className="success-message"><FaCheckCircle /> {message}</div>}
            {error && <div className="error-message"><FaExclamationTriangle /> {error}</div>}

            {/* Statistiques */}
            <div className="stats-grid">
                <StatCard title="Emplois du temps" value={stats.totalEdt} icon={<FaCalendarAlt />} color="#3b82f6" />
                <StatCard title="Résultats" value={stats.totalResultats} icon={<FaChartLine />} color="#10b981" />
                <StatCard title="Documents cours" value={stats.totalCours} icon={<FaFolderOpen />} color="#f59e0b" />
                <StatCard title="Classes" value={stats.totalClasses} icon={<FaGraduationCap />} color="#8b5cf6" />
            </div>

            {/* Tabs */}
            <div className="data-tabs">
                <button className={`data-tab ${activeTab === 'edt' ? 'active' : ''}`} onClick={() => setActiveTab('edt')}>
                    <FaCalendarAlt /> Emplois du temps ({emplois.length})
                </button>
                <button className={`data-tab ${activeTab === 'resultats' ? 'active' : ''}`} onClick={() => setActiveTab('resultats')}>
                    <FaChartLine /> Résultats ({resultats.length})
                </button>
                <button className={`data-tab ${activeTab === 'cours' ? 'active' : ''}`} onClick={() => setActiveTab('cours')}>
                    <FaFolderOpen /> Cours ({cours.length})
                </button>
            </div>

            {/* Tableau EDT */}
            {activeTab === 'edt' && (
                <div className="data-table-container">
                    <h3>Liste des emplois du temps</h3>
                    {emplois.length === 0 ? (
                        <div className="empty-data">Aucun emploi du temps enregistré</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Classe</th>
                                    <th>Semestre</th>
                                    <th>Fichier</th>
                                    <th>Date upload</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emplois.map(edt => (
                                    <tr key={edt.id_edt}>
                                        <td>{edt.id_edt}</td>
                                        <td>{getNomClasse(edt.id_classe)}</td>
                                        <td>{edt.semestre}</td>
                                        <td> style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            {getFileIcon(edt.fichier_url)}
                                            <a href={`https://esp-antsiranana.onrender.com${edt.fichier_url}`} target="_blank" rel="noopener noreferrer">
                                                Voir le fichier
                                            </a>
                                        </td>
                                        <td>{new Date(edt.uploaded_at).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDelete('edt', edt.id_edt)} className="btn-delete">
                                                <FaTrash /> Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Tableau Résultats */}
            {activeTab === 'resultats' && (
                <div className="data-table-container">
                    <h3>Liste des résultats</h3>
                    {resultats.length === 0 ? (
                        <div className="empty-data">Aucun résultat enregistré</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Classe</th>
                                    <th>Type</th>
                                    <th>Semestre</th>
                                    <th>Fichier</th>
                                    <th>Date upload</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultats.map(res => (
                                    <tr key={res.id_resultat}>
                                        <td>{res.id_resultat}</td>
                                        <td>{getNomClasse(res.id_classe)}</td>
                                        <td>{res.type === 'notes' ? 'Notes' : 'Délibération'}</td>
                                        <td>{res.semestre}</td>
                                        <td> style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            {getFileIcon(res.fichier_url)}
                                            <a href={`https://esp-antsiranana.onrender.com${res.fichier_url}`} target="_blank" rel="noopener noreferrer">
                                                Voir le fichier
                                            </a>
                                        </td>
                                        <td>{new Date(res.uploaded_at).toLocaleDateString()}</td>
                                        <td>
                                            <button onClick={() => handleDelete('resultat', res.id_resultat)} className="btn-delete">
                                                <FaTrash /> Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Tableau Cours */}
            {activeTab === 'cours' && (
                <div className="data-table-container">
                    <h3>Liste des documents cours</h3>
                    {cours.length === 0 ? (
                        <div className="empty-data">Aucun document cours enregistré</div>
                    ) : (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Classe</th>
                                    <th>Titre</th>
                                    <th>Fichier</th>
                                    <th>Uploadé par</th>
                                    <th>Date</th>
                                    <th>Téléchargements</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cours.map(doc => (
                                    <tr key={doc.id_fichier}>
                                        <td>{doc.id_fichier}</td>
                                        <td>{getNomClasse(doc.id_classe)}</td>
                                        <td>{doc.titre}</td>
                                        <td> style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                                            {getFileIcon(doc.fichier_url)}
                                            <a href={`https://esp-antsiranana.onrender.com${doc.fichier_url}`} target="_blank" rel="noopener noreferrer">
                                                Voir le fichier
                                            </a>
                                        </td>
                                        <td>{doc.uploaded_by_email || 'Anonyme'}</td>
                                        <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                                        <td>{doc.downloads_count || 0}</td>
                                        <td>
                                            <button onClick={() => handleDelete('cours', doc.id_fichier)} className="btn-delete">
                                                <FaTrash /> Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {/* Bouton rafraîchir */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button onClick={chargerToutesDonnees} className="btn-refresh">
                    <FaSpinner className={loading ? 'spinning' : ''} /> Rafraîchir les données
                </button>
            </div>
        </div>
    );
}

export default GestionDonnees;