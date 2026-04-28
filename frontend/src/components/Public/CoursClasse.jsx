import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FaFolderOpen, 
    FaLock, 
    FaDownload, 
    FaUpload, 
    FaSpinner,
    FaFilePdf,
    FaFileWord,
    FaFileImage,
    FaFileAlt,
    FaKey,
    FaCheckCircle,
    FaGraduationCap,
    FaEye,
    FaSignOutAlt,
    FaInfoCircle,
    FaEnvelope,
    FaCalendarAlt
} from 'react-icons/fa';
import { getClasses, verifyCoursPassword, getCoursFiles, uploadCoursFile } from '../../services/api';

function CoursClasse() {
    const [filieres, setFilieres] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedSemestre, setSelectedSemestre] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [idClasse, setIdClasse] = useState(null);
    const [selectedClasseNom, setSelectedClasseNom] = useState('');
    const [fichiers, setFichiers] = useState([]);
    const [uploadFile, setUploadFile] = useState(null);
    const [titre, setTitre] = useState('');
    const [uploaderEmail, setUploaderEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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

    const getAvailableSemestres = () => {
        if (selectedFiliere === 'TCI') {
            return ['S1', 'S2'];
        }
        return ['S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
    };

    const handleLogin = async () => {
        if (!selectedFiliere || !selectedSemestre || !password) {
            setError('Veuillez sélectionner une filière, un semestre et entrer le mot de passe');
            return;
        }

        const classeNom = selectedFiliere === 'TCI' 
            ? `TCI ${selectedSemestre}`
            : `${selectedFiliere} ${selectedSemestre}`;

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await verifyCoursPassword({ classe: classeNom, password });
            if (res.data.success) {
                setAuthenticated(true);
                setIdClasse(res.data.id_classe);
                setSelectedClasseNom(classeNom);
                chargerFichiers(res.data.id_classe);
                setSuccess('Accès autorisé');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('Mot de passe incorrect');
            }
        } catch (err) {
            setError('Erreur de vérification');
        } finally {
            setLoading(false);
        }
    };

    const chargerFichiers = async (id) => {
        try {
            const res = await getCoursFiles(id);
            setFichiers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpload = async () => {
        if (!uploadFile) {
            setError('Sélectionnez un fichier');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('fichier', uploadFile);
        formData.append('id_classe', idClasse);
        formData.append('uploaded_by_email', uploaderEmail || 'Anonyme');
        formData.append('titre', titre || uploadFile.name);

        try {
            await uploadCoursFile(formData);
            setSuccess('Fichier uploadé avec succès');
            setUploadFile(null);
            setTitre('');
            setUploaderEmail('');
            chargerFichiers(idClasse);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Erreur lors de l\'upload');
        } finally {
            setUploading(false);
        }
    };

    const getFileIcon = (type) => {
        if (type?.includes('pdf')) return <FaFilePdf style={{ color: '#ef4444' }} />;
        if (type?.includes('word')) return <FaFileWord style={{ color: '#3b82f6' }} />;
        if (type?.includes('image')) return <FaFileImage style={{ color: '#10b981' }} />;
        return <FaFileAlt style={{ color: '#6b7280' }} />;
    };

    if (!authenticated) {
        return (
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="page-header">
                        <h1>
                            <FaFolderOpen style={{ marginRight: '16px' }} />
                            Espace Cours
                        </h1>
                        <p>Sélectionnez votre filière et semestre pour accéder aux documents</p>
                    </div>

                    <div className="login-card">
                        <div className="login-icon">
                            <FaLock />
                        </div>
                        <h3>Accès par filière et semestre</h3>
                        <p>Entrez vos identifiants pour accéder aux documents</p>

                        {error && (
                            <div className="error-message">
                                <FaLock /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                <FaCheckCircle /> {success}
                            </div>
                        )}

                        <div className="login-form">
                            <div className="form-group">
                                <label><FaGraduationCap /> Filière</label>
                                <select 
                                    value={selectedFiliere} 
                                    onChange={(e) => {
                                        setSelectedFiliere(e.target.value);
                                        setSelectedSemestre('');
                                    }}
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
                                    disabled={!selectedFiliere}
                                >
                                    <option value="">Sélectionner un semestre</option>
                                    {getAvailableSemestres().map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label><FaKey /> Mot de passe</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mot de passe de la classe"
                                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                />
                            </div>
                            <button onClick={handleLogin} disabled={loading} className="btn-login">
                                {loading ? <FaSpinner className="spinning" /> : <FaLock />}
                                {loading ? 'Vérification...' : 'Accéder aux cours'}
                            </button>
                        </div>

                        <div className="login-info">
                            <p><FaInfoCircle /> Le mot de passe vous a été fourni par votre professeur</p>
                            <p><FaEnvelope /> En cas de perte, contactez votre responsable de classe</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="cours-header">
                    <div className="cours-title">
                        <h1>
                            <FaFolderOpen style={{ marginRight: '16px' }} />
                            Cours - {selectedClasseNom}
                        </h1>
                        <button onClick={() => {
                            setAuthenticated(false);
                            setPassword('');
                            setSelectedFiliere('');
                            setSelectedSemestre('');
                        }} className="btn-logout">
                            <FaSignOutAlt /> Changer de classe
                        </button>
                    </div>
                    <p>Accédez aux documents et partagez vos fichiers avec votre promotion</p>
                </div>

                <div className="upload-section">
                    <h3><FaUpload /> Partager un document</h3>
                    <div className="upload-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Titre du document</label>
                                <input 
                                    type="text" 
                                    value={titre} 
                                    onChange={(e) => setTitre(e.target.value)}
                                    placeholder="Ex: Cours - Chapitre 1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Votre email</label>
                                <input 
                                    type="email" 
                                    value={uploaderEmail} 
                                    onChange={(e) => setUploaderEmail(e.target.value)}
                                    placeholder="email@exemple.com (optionnel)"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Fichier</label>
                            <div className="file-input">
                                <input 
                                    type="file" 
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="file-label">
                                    {uploadFile ? uploadFile.name : 'Choisir un fichier (PDF, Word, Image)'}
                                </label>
                            </div>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}
                        <button onClick={handleUpload} disabled={uploading} className="btn-upload">
                            {uploading ? <FaSpinner className="spinning" /> : <FaUpload />}
                            {uploading ? 'Upload en cours...' : 'Publier le document'}
                        </button>
                    </div>
                </div>

                <div className="documents-section">
                    <h3><FaFolderOpen /> Documents disponibles ({fichiers.length})</h3>
                    
                    {fichiers.length === 0 ? (
                        <div className="empty-docs">
                            <FaFileAlt />
                            <p>Aucun document disponible pour le moment</p>
                            <p>Soyez le premier à partager un document</p>
                        </div>
                    ) : (
                        <div className="documents-grid">
                            {fichiers.map((doc, index) => (
                                <motion.div
                                    key={doc.id_fichier}
                                    className="document-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div className="doc-icon">
                                        {getFileIcon(doc.type_fichier)}
                                    </div>
                                    <div className="doc-info">
                                        <h4>{doc.titre}</h4>
                                        <div className="doc-meta">
                                            <span className="doc-author">
                                                <FaEye /> {doc.uploaded_by_email || 'Anonyme'}
                                            </span>
                                            <span className="doc-date">
                                                {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <a 
                                        href={`http://localhost:5000${doc.fichier_url}`} 
                                        download 
                                        className="doc-download"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaDownload /> Télécharger
                                    </a>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default CoursClasse;