import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaPlus, 
    FaEdit, 
    FaTrash, 
    //FaImage, 
    FaTimes,
    FaNewspaper,
    FaCalendarAlt,
    FaUser
} from 'react-icons/fa';
import { adminGetActualites, adminCreateActualite, adminUpdateActualite, adminDeleteActualite } from '../../services/api';

function GestionActualites() {
    const [actualites, setActualites] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingActu, setEditingActu] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        chargerActualites();
    }, []);

    const chargerActualites = async () => {
        try {
            const res = await adminGetActualites();
            setActualites(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (actu = null) => {
        if (actu) {
            setEditingActu(actu);
            setFormData({
                titre: actu.titre,
                description: actu.description,
                image: null
            });
            if (actu.image_url) {
                setImagePreview(`http://localhost:5000${actu.image_url}`);
            } else {
                setImagePreview('');
            }
        } else {
            setEditingActu(null);
            setFormData({ titre: '', description: '', image: null });
            setImagePreview('');
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingActu(null);
        setFormData({ titre: '', description: '', image: null });
        setImagePreview('');
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const submitData = new FormData();
        submitData.append('titre', formData.titre);
        submitData.append('description', formData.description);
        if (formData.image) submitData.append('image', formData.image);

        try {
            if (editingActu) {
                await adminUpdateActualite(editingActu.id_actu, { titre: formData.titre, description: formData.description });
                if (formData.image) {
                    // Note: La mise à jour d'image nécessiterait une route spécifique
                }
            } else {
                await adminCreateActualite(submitData);
            }
            chargerActualites();
            handleCloseModal();
        } catch (err) {
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cette actualité ?')) {
            try {
                await adminDeleteActualite(id);
                chargerActualites();
            } catch (err) {
                alert('Erreur lors de la suppression');
            }
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h2>
                    <FaNewspaper style={{ marginRight: '12px' }} />
                    Gestion des actualités
                </h2>
                <button onClick={() => handleOpenModal()} className="btn">
                    <FaPlus /> Nouvelle actualité
                </button>
            </div>

            {/* Liste des actualités */}
            <div className="formations-grid">
                {actualites.map((actu, index) => (
                    <motion.div
                        key={actu.id_actu}
                        className="formation-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {actu.image_url && (
                            <img 
                                src={`http://localhost:5000${actu.image_url}`} 
                                alt={actu.titre}
                                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }}
                            />
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ flex: 1 }}>{actu.titre}</h3>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    onClick={() => handleOpenModal(actu)} 
                                    className="btn-edit"
                                    style={{ background: '#ffc107', padding: '8px 12px' }}
                                >
                                    <FaEdit />
                                </button>
                                <button 
                                    onClick={() => handleDelete(actu.id_actu)} 
                                    className="btn-delete"
                                    style={{ background: '#dc3545', padding: '8px 12px' }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', margin: '12px 0', color: '#888', fontSize: '12px' }}>
                            <span><FaCalendarAlt /> {new Date(actu.date_publication).toLocaleDateString()}</span>
                            <span><FaUser /> {actu.auteur || 'Admin'}</span>
                        </div>
                        <p>{actu.description?.substring(0, 100)}...</p>
                    </motion.div>
                ))}
            </div>

            {/* Modal d'ajout/édition */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000
                        }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            style={{
                                background: 'white',
                                borderRadius: '24px',
                                padding: '32px',
                                maxWidth: '600px',
                                width: '90%',
                                maxHeight: '90vh',
                                overflow: 'auto'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <h3>{editingActu ? 'Modifier' : 'Nouvelle'} actualité</h3>
                                <button onClick={handleCloseModal} style={{ background: 'none', color: '#666', padding: '8px' }}>
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Titre</label>
                                    <input
                                        type="text"
                                        name="titre"
                                        value={formData.titre}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Titre de l'actualité"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        rows="6"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Contenu détaillé de l'actualité..."
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label>Image (optionnel)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <div style={{ marginTop: '12px' }}>
                                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={handleCloseModal} className="btn-outline">
                                        Annuler
                                    </button>
                                    <button type="submit" disabled={loading}>
                                        {loading ? 'Enregistrement...' : (editingActu ? 'Modifier' : 'Publier')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default GestionActualites;