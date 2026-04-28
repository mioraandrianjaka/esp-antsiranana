import React, { useState, useEffect } from 'react';
import { 
    FaChalkboardTeacher, 
    FaKey, 
    FaUpload, 
    FaFilePdf, 
    FaFileImage,
    FaFileAlt,
    FaCheck,
    FaSpinner,
    FaEdit,
    FaSave,
    FaTimes,
    FaList,
    FaInfoCircle
} from 'react-icons/fa';
import { 
    adminGetClasses, 
    adminUpdateClassePassword, 
    adminUploadEmploiTemps, 
    adminUploadResultats
} from '../../services/api';

function GestionClasses() {
    const [classes, setClasses] = useState([]);
    const [filieres, setFilieres] = useState([]);
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedClasse, setSelectedClasse] = useState('');
    const [selectedClasseNom, setSelectedClasseNom] = useState('');
    const [edtFile, setEdtFile] = useState(null);
    const [resultatsFile, setResultatsFile] = useState(null);
    const [semestre, setSemestre] = useState('S1');
    const [documentType, setDocumentType] = useState('edt');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPasswordList, setShowPasswordList] = useState(false);
    const [editingPassword, setEditingPassword] = useState(null);
    const [tempPassword, setTempPassword] = useState('');

    useEffect(() => {
        chargerClasses();
    }, []);

    const chargerClasses = async () => {
        try {
            const res = await adminGetClasses();
            setClasses(res.data);
            const uniqueFilieres = [...new Set(res.data.map(c => {
                if (c.nom.startsWith('TCI')) return 'TCI';
                return c.nom.split(' ')[0];
            }))];
            setFilieres(uniqueFilieres);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUploadDocument = async () => {
        const file = documentType === 'edt' ? edtFile : resultatsFile;
        if (!selectedFiliere || !selectedClasse || !file) {
            setError('Veuillez sélectionner une filière, une classe et un fichier');
            return;
        }
        setLoading(true);
        const formData = new FormData();
        formData.append('id_classe', selectedClasse);
        formData.append('fichier', file);
        formData.append('semestre', semestre);
        formData.append('annee_academique', '2025-2026');
        if (documentType === 'resultats') {
            formData.append('type', 'notes');
        }

        try {
            if (documentType === 'edt') {
                await adminUploadEmploiTemps(formData);
                setMessage('Emploi du temps uploadé avec succès');
                setEdtFile(null);
            } else {
                await adminUploadResultats(formData);
                setMessage('Résultats uploadés avec succès');
                setResultatsFile(null);
            }
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Erreur lors de l\'upload');
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (filename) => {
        const ext = filename?.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return <FaFilePdf style={{ color: '#ef4444' }} />;
        if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') return <FaFileImage style={{ color: '#10b981' }} />;
        return <FaFileAlt style={{ color: '#6b7280' }} />;
    };

    const classesFiltrees = selectedFiliere
        ? classes.filter(c => {
            if (selectedFiliere === 'TCI') return c.nom.startsWith('TCI');
            return c.nom.startsWith(selectedFiliere);
        })
        : [];

    const passwordList = classes.map(c => ({
        id: c.id_classe,
        nom: c.nom,
        filiere: c.formation_nom || 'TCI',
        motDePasse: c.mot_de_passe || 'Non défini'
    }));

    const handleEditPassword = (classe) => {
        setEditingPassword(classe);
        setTempPassword('');
    };

    const handleSavePassword = async () => {
        if (!tempPassword) {
            setError('Veuillez entrer un mot de passe');
            return;
        }
        setLoading(true);
        try {
            await adminUpdateClassePassword(editingPassword.id, { mot_de_passe: tempPassword });
            setMessage(`Mot de passe pour ${editingPassword.nom} mis à jour`);
            setEditingPassword(null);
            setTempPassword('');
            chargerClasses();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Erreur lors de la mise à jour');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2><FaChalkboardTeacher /> Gestion des classes et documents</h2>

            {message && <div className="success-message"><FaCheck /> {message}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Section Upload documents */}
            <div className="admin-card">
                <h3><FaUpload /> Upload de documents</h3>
                
                <div className="info-banner">
                    <FaInfoCircle /> Cette section permet d'ajouter les emplois du temps et les résultats/notes pour chaque classe.
                    Les étudiants pourront ensuite les consulter sur le site public.
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Type de document</label>
                        <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
                            <option value="edt">📅 Emploi du temps (EDT)</option>
                            <option value="resultats">📊 Résultats / Notes</option>
                        </select>
                        <small className="field-hint">
                            {documentType === 'edt' ? 
                                'Les étudiants verront ce document dans la page "EDT"' : 
                                'Les étudiants verront ce document dans la page "Résultats"'}
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Filière</label>
                        <select value={selectedFiliere} onChange={(e) => setSelectedFiliere(e.target.value)}>
                            <option value="">Sélectionner une filière</option>
                            {filieres.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <small className="field-hint">Exemple: STIC, GC, GM, TCI...</small>
                    </div>
                    <div className="form-group">
                        <label>Classe / Semestre</label>
                        <select 
                            value={selectedClasse} 
                            onChange={(e) => {
                                setSelectedClasse(e.target.value);
                                const classe = classes.find(c => c.id_classe === parseInt(e.target.value));
                                setSelectedClasseNom(classe?.nom || '');
                            }}
                        >
                            <option value="">Sélectionner une classe</option>
                            {classesFiltrees.map(c => (
                                <option key={c.id_classe} value={c.id_classe}>{c.nom}</option>
                            ))}
                        </select>
                        <small className="field-hint">
                            {selectedFiliere === 'TCI' ? 
                                'TCI S1 (Semestre 1) ou TCI S2 (Semestre 2)' : 
                                'Exemple: STIC S3 (Semestre 3), STIC S4 (Semestre 4)...'}
                        </small>
                    </div>
                    <div className="form-group">
                        <label>Semestre académique</label>
                        <select value={semestre} onChange={(e) => setSemestre(e.target.value)}>
                            <option value="S1">Semestre 1</option>
                            <option value="S2">Semestre 2</option>
                            <option value="S3">Semestre 3</option>
                            <option value="S4">Semestre 4</option>
                            <option value="S5">Semestre 5</option>
                            <option value="S6">Semestre 6</option>
                            <option value="S7">Semestre 7</option>
                            <option value="S8">Semestre 8</option>
                            <option value="S9">Semestre 9</option>
                            <option value="S10">Semestre 10</option>
                        </select>
                        <small className="field-hint">Sélectionnez le semestre correspondant au document</small>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Fichier (PDF ou Image)</label>
                        <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png,.gif" 
                            onChange={(e) => {
                                if (documentType === 'edt') setEdtFile(e.target.files[0]);
                                else setResultatsFile(e.target.files[0]);
                            }}
                        />
                        <small className="field-hint">
                            Formats acceptés: PDF, JPG, JPEG, PNG, GIF
                        </small>
                        {(documentType === 'edt' && edtFile) && (
                            <div className="file-selected">{getFileIcon(edtFile.name)} {edtFile.name}</div>
                        )}
                        {(documentType === 'resultats' && resultatsFile) && (
                            <div className="file-selected">{getFileIcon(resultatsFile.name)} {resultatsFile.name}</div>
                        )}
                    </div>
                    <button onClick={handleUploadDocument} disabled={loading} className="upload-btn">
                        {loading ? <FaSpinner className="spinning" /> : <FaUpload />}
                        {loading ? 'Upload en cours...' : 'Uploader le document'}
                    </button>
                </div>
            </div>

            {/* Section Gestion des mots de passe */}
            <div className="admin-card">
                <h3><FaKey /> Gestion des mots de passe des classes</h3>
                
                <div className="info-banner info-blue">
                    <FaInfoCircle /> Chaque classe a un mot de passe pour accéder à l'espace cours.
                    Voici la liste complète des mots de passe actuels.
                </div>

                <button 
                    className="btn-outline" 
                    onClick={() => setShowPasswordList(!showPasswordList)}
                    style={{ marginBottom: '16px' }}
                >
                    <FaList /> {showPasswordList ? 'Masquer la liste' : 'Afficher la liste des mots de passe'}
                </button>

                {showPasswordList && (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Classe</th>
                                <th>Filière</th>
                                <th>Mot de passe actuel</th>
                                <th>Nouveau mot de passe</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passwordList.map(classe => (
                                <tr key={classe.id}>
                                    <td>{classe.nom}</td>
                                    <td>{classe.filiere}</td>
                                    <td>
                                        <code className="password-display">{classe.motDePasse !== 'Non défini' ? classe.motDePasse : 'Non défini'}</code>
                                    </td>
                                    <td>
                                        {editingPassword?.id === classe.id ? (
                                            <input 
                                                type="text" 
                                                value={tempPassword} 
                                                onChange={(e) => setTempPassword(e.target.value)}
                                                placeholder="Nouveau mot de passe"
                                                className="password-input"
                                            />
                                        ) : (
                                            <span className="placeholder-text">—</span>
                                        )}
                                    </td>
                                    <td>
                                        {editingPassword?.id === classe.id ? (
                                            <div className="action-buttons">
                                                <button onClick={handleSavePassword} className="btn-save">
                                                    <FaSave /> Enregistrer
                                                </button>
                                                <button onClick={() => setEditingPassword(null)} className="btn-cancel">
                                                    <FaTimes /> Annuler
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEditPassword(classe)} className="btn-edit">
                                                <FaEdit /> Modifier
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default GestionClasses;